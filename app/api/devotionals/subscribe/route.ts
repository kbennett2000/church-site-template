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

    await sendVerificationEmail({
      to: email,
      name: name ?? existing.name ?? null,
      planSlugs,
      verToken,
      churchName,
      settings,
      baseUrl: new URL(req.url).origin,
    });
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

    await sendVerificationEmail({
      to: email,
      name: name ?? null,
      planSlugs,
      verToken,
      churchName,
      settings,
      baseUrl: new URL(req.url).origin,
    });
  }

  return NextResponse.json({ ok: true });
}

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
}) {
  const planTitles = planSlugs
    .map((slug) => {
      const plan = getReadingPlan(slug);
      return plan?.title ?? slug;
    })
    .filter(Boolean) as string[];

  const verificationUrl = `${baseUrl}/devotionals/verify?token=${verToken}`;

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
  await resend.emails.send({
    from: `${settings.senderName} <${settings.senderEmail}>`,
    to,
    subject: `Confirm your devotional subscription — ${churchName}`,
    html,
  });
}
