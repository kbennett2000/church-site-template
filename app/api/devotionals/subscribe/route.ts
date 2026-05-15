import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { findByEmail, upsertPlanSubscription } from "@/lib/db/queries";
import { generateToken, verificationExpiresAt } from "@/lib/devotionals/tokens";
import { getDevotionalEmailSettings } from "@/lib/devotionals/email-settings";
import { VerificationEmail } from "@/lib/devotionals/emails/verification-email";
import { getReadingPlan } from "@/content/devotionals";
import { getResend } from "@/lib/resend";
import { churchData } from "@/content/site";
import { eq } from "drizzle-orm";

const EMAIL_SEND_FAILED =
  "We couldn't send your confirmation email. Please try again or contact the church.";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, name, planSlugs, timezone, sendHour } = body as {
    email?: string;
    name?: string;
    planSlugs?: string[];
    timezone?: string;
    sendHour?: number;
  };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!planSlugs || planSlugs.length === 0) {
    return NextResponse.json({ error: "Select at least one plan" }, { status: 400 });
  }

  const settings = getDevotionalEmailSettings();
  const churchName = churchData?.name ?? settings.senderName;

  const verToken = generateToken();
  const verExpiry = verificationExpiresAt();
  const unsubToken = generateToken();

  const existing = await findByEmail(email);

  if (existing) {
    // Reuse the row: update token + status regardless of prior state.
    await db
      .update(subscribers)
      .set({
        name: name ?? existing.name,
        status: "pending_verification",
        timezone: timezone ?? existing.timezone,
        sendHour: sendHour ?? existing.sendHour,
        verificationToken: verToken,
        verificationTokenExpiresAt: verExpiry,
        verifiedAt: null,
        unsubscribedAt: null,
      })
      .where(eq(subscribers.id, existing.id));

    for (const slug of planSlugs) {
      await upsertPlanSubscription(existing.id, slug);
    }

    let sendError: unknown;
    try {
      sendError = await sendVerificationEmail({
        to: email,
        name: name ?? existing.name ?? null,
        planSlugs,
        verToken,
        churchName,
        settings,
        baseUrl: new URL(req.url).origin,
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
        verificationToken: verToken,
        verificationTokenExpiresAt: verExpiry,
        unsubscribeToken: unsubToken,
      })
      .returning();

    for (const slug of planSlugs) {
      await upsertPlanSubscription(row.id, slug);
    }

    let sendError: unknown;
    try {
      sendError = await sendVerificationEmail({
        to: email,
        name: name ?? null,
        planSlugs,
        verToken,
        churchName,
        settings,
        baseUrl: new URL(req.url).origin,
      });
    } catch (err) {
      sendError = err;
    }

    if (sendError) {
      // Roll back the new row so the user can retry without hitting a duplicate-email error.
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
  planSlugs,
  verToken,
  churchName,
  settings,
  baseUrl,
}: {
  to: string;
  name: string | null;
  planSlugs: string[];
  verToken: string;
  churchName: string;
  settings: ReturnType<typeof getDevotionalEmailSettings>;
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

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: `${settings.senderName} <${settings.senderEmail}>`,
    to,
    subject: `Confirm your devotional subscription — ${churchName}`,
    html,
  });

  return error ?? null;
}
