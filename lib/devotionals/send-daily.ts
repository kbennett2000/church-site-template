/**
 * Core daily devotional send function.
 *
 * Idempotency contract:
 *   Running this function twice for the same date produces the same outcome —
 *   subscribers who already received an entry (lastSentDate === localDate) are
 *   skipped. Update lastSentDate only after a confirmed Resend success.
 *
 * Timezone handling:
 *   Each subscriber has a timezone + sendHour. "Today" for them is the local
 *   date in their timezone. We send if localHour >= sendHour AND lastSentDate
 *   !== localDate. This is forgiving — a cron that fires late still delivers
 *   without needing a retry queue.
 *
 * Error isolation:
 *   Any failure for one subscriber-plan pair is caught, logged, and skipped so
 *   other sends continue. The function always returns a summary.
 */

import React from "react";
import { render } from "@react-email/render";
import { getResend } from "@/lib/resend";
import {
  getActiveSubscribersWithPlans,
  updateLastSentDate,
  markSubscriberBounced,
} from "@/lib/db/queries";
import { getReadingPlan } from "@/content/devotionals";
import { fetchScripture } from "@/lib/devotionals/scripture-api";
import { getDevotionalEmailSettings } from "@/lib/devotionals/email-settings";
import { SoapEmail } from "@/emails/devotional/SoapEmail";
import { SimpleEmail } from "@/emails/devotional/SimpleEmail";
import { LectioEmail } from "@/emails/devotional/LectioEmail";
import type { DevotionalEmailProps } from "@/emails/devotional/shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SendSummary {
  runDate: string; // YYYY-MM-DD UTC date of this run
  attempted: number;
  sent: number;
  skipped: number;
  failed: number;
  errors: Array<{ subscriberId: string; planSlug: string; message: string }>;
}

// ---------------------------------------------------------------------------
// Timezone helpers
// ---------------------------------------------------------------------------

/** Returns the subscriber's local date as YYYY-MM-DD. */
function localDate(timezone: string, now: Date): string {
  return now.toLocaleDateString("en-CA", { timeZone: timezone });
}

/** Returns the subscriber's current local hour (0–23). */
function localHour(timezone: string, now: Date): number {
  const h = now.toLocaleString("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  });
  // "24" can be returned at midnight in some environments; normalise to 0
  return Number(h) % 24;
}

// ---------------------------------------------------------------------------
// Subject line builder
// ---------------------------------------------------------------------------

function buildSubject(
  template: string,
  vars: { date: string; title: string | undefined; reference: string; planTitle: string }
): string {
  const dateFormatted = new Date(vars.date + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  return template
    .replace("{{date}}", dateFormatted)
    .replace("{{title}}", vars.title ?? vars.reference)
    .replace("{{reference}}", vars.reference)
    .replace("{{planTitle}}", vars.planTitle);
}

// ---------------------------------------------------------------------------
// Template selector
// ---------------------------------------------------------------------------

function renderTemplate(props: DevotionalEmailProps): { html: string; text: string } | Promise<{ html: string; text: string }> {
  const components: Record<string, React.FC<DevotionalEmailProps>> = {
    soap: SoapEmail,
    simple: SimpleEmail,
    lectio_divina: LectioEmail,
  };
  const Component = components[props.plan.style] ?? SimpleEmail;

  return Promise.all([
    render(React.createElement(Component, props)),
    render(React.createElement(Component, props), { plainText: true }),
  ]).then(([html, text]) => ({ html, text }));
}

// ---------------------------------------------------------------------------
// Bounce detection
// ---------------------------------------------------------------------------

const HARD_BOUNCE_CODES = new Set([
  "hard_bounce",
  "invalid_address",
  "domain_error",
]);

function isHardBounce(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as Record<string, unknown>;
  // Resend SDK v4 returns { name, message, statusCode }
  if (e.statusCode === 422) return true;
  const name = String(e.name ?? "").toLowerCase();
  return HARD_BOUNCE_CODES.has(name);
}

// ---------------------------------------------------------------------------
// Core send function
// ---------------------------------------------------------------------------

/**
 * Send today's devotional entries to all qualifying active subscribers.
 *
 * @param baseUrl  The site's origin (e.g. "https://yourchurch.org") for links.
 * @param now      Override the current time — useful for backfill runs.
 */
export async function sendDailyDevotionals(
  baseUrl: string,
  now: Date = new Date()
): Promise<SendSummary> {
  const runDate = now.toISOString().slice(0, 10);
  const stats: SendSummary = {
    runDate,
    attempted: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  const [subscribers, settings, resend] = await Promise.all([
    getActiveSubscribersWithPlans(),
    Promise.resolve(getDevotionalEmailSettings()),
    Promise.resolve(getResend()),
  ]);

  const settingsWithUrl = { ...settings, siteUrl: baseUrl };

  for (const subscriber of subscribers) {
    const subLocalDate = localDate(subscriber.timezone, now);
    const subLocalHour = localHour(subscriber.timezone, now);

    for (const plan of subscriber.plans) {
      // Skip if already sent today for this plan
      if (plan.lastSentDate === subLocalDate) {
        stats.skipped++;
        continue;
      }

      // Skip if it's not yet their send hour in their local timezone
      if (subLocalHour < subscriber.sendHour) {
        stats.skipped++;
        continue;
      }

      const readingPlan = getReadingPlan(plan.planSlug);
      if (!readingPlan || !readingPlan.isActive) {
        stats.skipped++;
        continue;
      }

      // Find the entry for the subscriber's local date
      const entry = readingPlan.entries.find((e) => e.date === subLocalDate);
      if (!entry) {
        // No entry today for this plan — not an error, just skip
        stats.skipped++;
        continue;
      }

      stats.attempted++;

      try {
        const passage = await fetchScripture(
          entry.scriptureReference,
          readingPlan.defaultTranslation
        );

        const props: DevotionalEmailProps = {
          subscriber: {
            name: subscriber.name,
            email: subscriber.email,
            unsubscribeToken: subscriber.unsubscribeToken,
          },
          plan: {
            slug: readingPlan.slug,
            title: readingPlan.title,
            style: readingPlan.style,
            defaultTranslation: readingPlan.defaultTranslation,
          },
          entry: {
            date: entry.date,
            scriptureReference: entry.scriptureReference,
            title: entry.title,
            leaderNotes: entry.leaderNotes,
          },
          scriptureHtml: passage.html,
          scriptureText: passage.text,
          scriptureAttribution: passage.attribution,
          settings: settingsWithUrl,
        };

        const { html, text } = await renderTemplate(props);

        const subject = buildSubject(settings.subjectTemplate, {
          date: subLocalDate,
          title: entry.title,
          reference: entry.scriptureReference,
          planTitle: readingPlan.title,
        });

        const { error } = await resend.emails.send({
          from: `${settings.senderName} <${settings.senderEmail}>`,
          to: subscriber.email,
          subject,
          html,
          text,
          tags: [
            { name: "plan", value: readingPlan.slug },
            { name: "style", value: readingPlan.style },
            { name: "date", value: subLocalDate },
          ],
          headers: {
            // Serves as an idempotency signal in Resend's dashboard
            "X-Entity-Ref-ID": `${subscriber.id}:${readingPlan.slug}:${subLocalDate}`,
          },
        });

        if (error) throw error;

        await updateLastSentDate(subscriber.id, plan.planSlug, subLocalDate);
        stats.sent++;
      } catch (err: unknown) {
        stats.failed++;
        const message = err instanceof Error ? err.message : String(err);
        stats.errors.push({
          subscriberId: subscriber.id,
          planSlug: plan.planSlug,
          message,
        });

        if (isHardBounce(err)) {
          await markSubscriberBounced(subscriber.email).catch(() => {
            // don't let a DB failure cascade
          });
        }
      }
    }
  }

  return stats;
}

// ---------------------------------------------------------------------------
// Backfill variant — sends to all active subscribers for a specific past date
// regardless of sendHour, but still respects lastSentDate idempotency
// ---------------------------------------------------------------------------

export async function backfillDate(
  baseUrl: string,
  targetDate: string
): Promise<SendSummary> {
  // Set now to noon UTC on the target date so localDate() resolves correctly
  const backfillNow = new Date(`${targetDate}T12:00:00Z`);

  const runDate = targetDate;
  const stats: SendSummary = {
    runDate,
    attempted: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  const [subscribers, settings, resend] = await Promise.all([
    getActiveSubscribersWithPlans(),
    Promise.resolve(getDevotionalEmailSettings()),
    Promise.resolve(getResend()),
  ]);

  const settingsWithUrl = { ...settings, siteUrl: baseUrl };

  for (const subscriber of subscribers) {
    for (const plan of subscriber.plans) {
      // Idempotency: skip if already sent for this date
      if (plan.lastSentDate === targetDate) {
        stats.skipped++;
        continue;
      }

      const readingPlan = getReadingPlan(plan.planSlug);
      if (!readingPlan) {
        stats.skipped++;
        continue;
      }

      const entry = readingPlan.entries.find((e) => e.date === targetDate);
      if (!entry) {
        stats.skipped++;
        continue;
      }

      stats.attempted++;

      try {
        const passage = await fetchScripture(
          entry.scriptureReference,
          readingPlan.defaultTranslation
        );

        const props: DevotionalEmailProps = {
          subscriber: {
            name: subscriber.name,
            email: subscriber.email,
            unsubscribeToken: subscriber.unsubscribeToken,
          },
          plan: {
            slug: readingPlan.slug,
            title: readingPlan.title,
            style: readingPlan.style,
            defaultTranslation: readingPlan.defaultTranslation,
          },
          entry: {
            date: entry.date,
            scriptureReference: entry.scriptureReference,
            title: entry.title,
            leaderNotes: entry.leaderNotes,
          },
          scriptureHtml: passage.html,
          scriptureText: passage.text,
          scriptureAttribution: passage.attribution,
          settings: settingsWithUrl,
        };

        const { html, text } = await renderTemplate(props);

        const subject = buildSubject(settings.subjectTemplate, {
          date: targetDate,
          title: entry.title,
          reference: entry.scriptureReference,
          planTitle: readingPlan.title,
        });

        const { error } = await resend.emails.send({
          from: `${settings.senderName} <${settings.senderEmail}>`,
          to: subscriber.email,
          subject: `[Backfill] ${subject}`,
          html,
          text,
          tags: [
            { name: "plan", value: readingPlan.slug },
            { name: "style", value: readingPlan.style },
            { name: "date", value: targetDate },
            { name: "type", value: "backfill" },
          ],
        });

        if (error) throw error;

        await updateLastSentDate(subscriber.id, plan.planSlug, targetDate);
        stats.sent++;
      } catch (err: unknown) {
        stats.failed++;
        stats.errors.push({
          subscriberId: subscriber.id,
          planSlug: plan.planSlug,
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  return stats;
}
