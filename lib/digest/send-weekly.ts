/**
 * Weekly digest send function.
 *
 * Differences from lib/devotionals/send-daily.ts:
 *  - One content composition for everyone (digest is identical for all
 *    subscribers; only the manage/unsubscribe links are personalised).
 *  - One HTML render per send run, not per subscriber.
 *  - Idempotency tracked in digest_send_log by week_start (unique constraint).
 *  - On hard bounce, we remove the "digest" tag from the subscriber so the
 *    next run skips them, but other tags ("devotionals") remain.
 *
 * Error isolation: a single subscriber failure does not stop the loop. All
 * failures are collected into the returned summary.
 */

import React from "react";
import { render } from "@react-email/render";
import { getResend } from "@/lib/resend";
import {
  findActiveSubscribersForDigest,
  getDigestSendLog,
  logDigestSend,
  deleteDigestSendLog,
  removeTagFromSubscriber,
} from "@/lib/db/queries";
import { composeDigest } from "./compose";
import { DigestEmail, renderDigestPlainText } from "@/emails/digest/DigestEmail";
import { isEmptyPayload, type DigestPayload } from "./types";

export interface DigestSendSummary {
  weekStart: string;
  weekEnd: string;
  attempted: number;
  sent: number;
  failed: number;
  skipped: number;
  skipReason?: "already_sent" | "no_content" | "feature_disabled" | "no_subscribers";
  errors: Array<{ subscriberId: string; message: string }>;
}

const HARD_BOUNCE_CODES = new Set([
  "hard_bounce",
  "invalid_address",
  "domain_error",
]);

function isHardBounce(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as Record<string, unknown>;
  if (e.statusCode === 422) return true;
  const name = String(e.name ?? "").toLowerCase();
  return HARD_BOUNCE_CODES.has(name);
}

function isoWeekTag(weekStart: string): string {
  // Approximate ISO week label: e.g. "2026-W20". For the Resend tag we just
  // need something that buckets sends per-week — exact ISO week is overkill.
  const d = new Date(weekStart + "T12:00:00Z");
  const year = d.getUTCFullYear();
  const start = new Date(Date.UTC(year, 0, 1));
  const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86_400_000) + 1;
  const week = String(Math.ceil(dayOfYear / 7)).padStart(2, "0");
  return `${year}-W${week}`;
}

function buildSubject(template: string, vars: { churchName: string; weekStart: string; weekEnd: string }): string {
  return template
    .replace("{{churchName}}", vars.churchName)
    .replace("{{weekStart}}", vars.weekStart)
    .replace("{{weekEnd}}", vars.weekEnd);
}

export interface SendWeeklyArgs {
  baseUrl: string;
  /** When true, bypass the "already sent this week" idempotency guard. */
  force?: boolean;
  /** Override the current time — used by tests. */
  now?: Date;
}

export async function sendWeeklyDigest({ baseUrl, force = false, now = new Date() }: SendWeeklyArgs): Promise<DigestSendSummary> {
  const payload = composeDigest({ now, siteUrl: baseUrl });
  const summary: DigestSendSummary = {
    weekStart: payload.weekStart,
    weekEnd: payload.weekEnd,
    attempted: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  if (!payload.settings.isEnabled) {
    summary.skipped = 1;
    summary.skipReason = "feature_disabled";
    return summary;
  }

  // Idempotency: refuse to double-send unless explicitly forced.
  const existing = await getDigestSendLog(payload.weekStart);
  if (existing && !force) {
    summary.skipped = 1;
    summary.skipReason = "already_sent";
    return summary;
  }

  // No content → skip entirely. Don't deliver an empty email.
  if (isEmptyPayload(payload)) {
    summary.skipped = 1;
    summary.skipReason = "no_content";
    return summary;
  }

  const subscribers = await findActiveSubscribersForDigest();
  if (subscribers.length === 0) {
    summary.skipped = 1;
    summary.skipReason = "no_subscribers";
    return summary;
  }

  // If forcing a re-send for the same week, clear the prior log so the new
  // insert succeeds against the unique constraint.
  if (existing && force) {
    await deleteDigestSendLog(payload.weekStart).catch((err) => {
      console.error("[digest] Failed to delete prior log row for forced re-send", err);
    });
  }

  const subject = buildSubject(payload.settings.subjectTemplate, {
    churchName: payload.churchName,
    weekStart: payload.weekStart,
    weekEnd: payload.weekEnd,
  });

  const resend = getResend();
  const weekTag = isoWeekTag(payload.weekStart);

  for (const subscriber of subscribers) {
    summary.attempted++;
    try {
      const props = {
        payload,
        subscriber: {
          name: subscriber.name,
          email: subscriber.email,
          unsubscribeToken: subscriber.unsubscribeToken,
        },
      };

      const html = await render(React.createElement(DigestEmail, props));
      const text = renderDigestPlainText(props);

      const { error } = await resend.emails.send({
        from: `${payload.settings.senderName} <${payload.settings.senderEmail}>`,
        to: subscriber.email,
        subject,
        html,
        text,
        tags: [
          { name: "type", value: "digest" },
          { name: "week", value: weekTag },
        ],
        headers: {
          "X-Entity-Ref-ID": `digest:${subscriber.id}:${payload.weekStart}`,
        },
      });

      if (error) throw error;

      summary.sent++;
    } catch (err: unknown) {
      summary.failed++;
      const message = err instanceof Error ? err.message : String(err);
      summary.errors.push({ subscriberId: subscriber.id, message });

      if (isHardBounce(err)) {
        // Drop the digest tag but keep other tags — they may still want devotionals.
        await removeTagFromSubscriber(subscriber.id, "digest").catch((dbErr) => {
          console.error("[digest] Failed to remove digest tag after hard bounce", dbErr);
        });
      }
    }
  }

  await logDigestSend({
    weekStart: payload.weekStart,
    weekEnd: payload.weekEnd,
    attempted: summary.attempted,
    sent: summary.sent,
    failed: summary.failed,
    errors: summary.errors,
  }).catch((err) => {
    console.error("[digest] Failed to write send log row", err);
  });

  return summary;
}

/** Public helper for the admin preview's "send test to my email" button. */
export async function sendDigestTestTo(opts: {
  to: string;
  baseUrl: string;
  now?: Date;
}): Promise<{ ok: true; payload: DigestPayload } | { ok: false; error: string }> {
  const payload = composeDigest({ now: opts.now, siteUrl: opts.baseUrl });

  // Synthesize a token-bearing subscriber for the test email so the manage/
  // unsubscribe links resolve to something meaningful but harmless.
  const fakeToken = "preview-test-token";
  const props = {
    payload,
    subscriber: { name: null, email: opts.to, unsubscribeToken: fakeToken },
  };

  try {
    const html = await render(React.createElement(DigestEmail, props));
    const text = renderDigestPlainText(props);
    const subject = `[TEST] ${buildSubject(payload.settings.subjectTemplate, {
      churchName: payload.churchName,
      weekStart: payload.weekStart,
      weekEnd: payload.weekEnd,
    })}`;

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: `${payload.settings.senderName} <${payload.settings.senderEmail}>`,
      to: opts.to,
      subject,
      html,
      text,
      tags: [
        { name: "type", value: "digest" },
        { name: "mode", value: "test" },
      ],
    });
    if (error) {
      const message = typeof error === "object" && error !== null ? JSON.stringify(error) : String(error);
      return { ok: false, error: message };
    }
    return { ok: true, payload };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
