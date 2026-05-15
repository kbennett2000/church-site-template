import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { findByEmail, upsertPlanSubscription } from "@/lib/db/queries";
import { generateToken, verificationExpiresAt } from "@/lib/devotionals/tokens";
import { getDevotionalEmailSettingsForSend } from "@/lib/devotionals/email-settings";
import { VerificationEmail } from "@/lib/devotionals/emails/verification-email";
import { getReadingPlan } from "@/content/devotionals";
import { getResend } from "@/lib/resend";
import { churchData } from "@/content/site";
import { eq, sql } from "drizzle-orm";

const EMAIL_SEND_FAILED =
  "We couldn't send your confirmation email. Please try again or contact the church.";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, name, planSlugs, tags, timezone, sendHour } = body as {
    email?: string;
    name?: string;
    planSlugs?: string[];
    tags?: string[];
    timezone?: string;
    sendHour?: number;
  };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Normalise tags — default to devotionals-only for backward compatibility.
  const requestedTags: string[] = tags && tags.length > 0 ? tags : ["devotionals"];

  // planSlugs are required only if subscribing to devotionals.
  const wantsDevotionals = requestedTags.includes("devotionals");
  if (wantsDevotionals && (!planSlugs || planSlugs.length === 0)) {
    return NextResponse.json({ error: "Select at least one reading plan" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const settings = getDevotionalEmailSettingsForSend(baseUrl);
  const churchName = churchData?.name ?? settings.senderName;

  const verToken = generateToken();
  const verExpiry = verificationExpiresAt();
  const unsubToken = generateToken();

  const existing = await findByEmail(email);

  if (existing) {
    // Merge new tags with any the subscriber already has.
    const mergedTags = Array.from(new Set([...existing.tags, ...requestedTags]));

    await db
      .update(subscribers)
      .set({
        name: name ?? existing.name,
        status: "pending_verification",
        timezone: timezone ?? existing.timezone,
        sendHour: sendHour ?? existing.sendHour,
        tags: mergedTags,
        verificationToken: verToken,
        verificationTokenExpiresAt: verExpiry,
        verifiedAt: null,
        unsubscribedAt: null,
      })
      .where(eq(subscribers.id, existing.id));

    if (wantsDevotionals && planSlugs) {
      for (const slug of planSlugs) {
        await upsertPlanSubscription(existing.id, slug);
      }
    }

    let sendError: unknown;
    try {
      sendError = await sendVerificationEmail({
        to: email,
        name: name ?? existing.name ?? null,
        requestedTags,
        planSlugs: planSlugs ?? [],
        verToken,
        churchName,
        settings,
        baseUrl,
      });
    } catch (err) {
      sendError = err;
    }

    if (sendError) {
      console.error("[subscribe] Verification email failed for existing subscriber", email, sendError);
      return NextResponse.json({ error: EMAIL_SEND_FAILED }, { status: 500 });
    }
  } else {
    const [row] = await db
      .insert(subscribers)
      .values({
        email: email.toLowerCase().trim(),
        name: name ?? null,
        status: "pending_verification",
        timezone: timezone ?? "America/New_York",
        sendHour: sendHour ?? 6,
        tags: requestedTags,
        verificationToken: verToken,
        verificationTokenExpiresAt: verExpiry,
        unsubscribeToken: unsubToken,
      })
      .returning();

    if (wantsDevotionals && planSlugs) {
      for (const slug of planSlugs) {
        await upsertPlanSubscription(row.id, slug);
      }
    }

    let sendError: unknown;
    try {
      sendError = await sendVerificationEmail({
        to: email,
        name: name ?? null,
        requestedTags,
        planSlugs: planSlugs ?? [],
        verToken,
        churchName,
        settings,
        baseUrl,
      });
    } catch (err) {
      sendError = err;
    }

    if (sendError) {
      await db.delete(subscribers).where(eq(subscribers.id, row.id)).catch((dbErr) => {
        console.error("[subscribe] Rollback failed after email send failure", dbErr);
      });
      console.error("[subscribe] Verification email failed, rolled back new subscriber", email, sendError);
      return NextResponse.json({ error: EMAIL_SEND_FAILED }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

/** Returns the Resend error if the send failed, or null on success. */
async function sendVerificationEmail({
  to,
  name,
  requestedTags,
  planSlugs,
  verToken,
  churchName,
  settings,
  baseUrl,
}: {
  to: string;
  name: string | null;
  requestedTags: string[];
  planSlugs: string[];
  verToken: string;
  churchName: string;
  settings: ReturnType<typeof getDevotionalEmailSettingsForSend>;
  baseUrl: string;
}): Promise<unknown> {
  const planTitles = planSlugs
    .map((slug) => {
      const plan = getReadingPlan(slug);
      return plan?.title ?? slug;
    })
    .filter(Boolean) as string[];

  const verificationUrl = `${baseUrl}/api/devotionals/verify?token=${verToken}`;

  const html = await render(
    VerificationEmail({
      churchName,
      subscriberName: name,
      planTitles,
      verificationUrl,
      brandColor: settings.brandColor,
      logoUrl: settings.logoUrl,
      footerText: settings.footerText,
    })
  );

  const wantsDigest = requestedTags.includes("digest");
  const wantsDevotionals = requestedTags.includes("devotionals");
  const subject = wantsDevotionals
    ? `Confirm your devotional subscription — ${churchName}`
    : wantsDigest
    ? `Confirm your weekly digest subscription — ${churchName}`
    : `Confirm your email subscription — ${churchName}`;

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: `${settings.senderName} <${settings.senderEmail}>`,
    to,
    subject,
    html,
  });

  return error ?? null;
}
