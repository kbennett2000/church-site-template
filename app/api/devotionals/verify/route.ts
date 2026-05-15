import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import {
  findByVerificationToken,
  findByVerificationTokenAny,
  getSubscriberPlans,
} from "@/lib/db/queries";
import { getDevotionalEmailSettingsForSend } from "@/lib/devotionals/email-settings";
import { WelcomeEmail } from "@/lib/devotionals/emails/welcome-email";
import { getReadingPlan } from "@/content/devotionals";
import { getResend } from "@/lib/resend";
import { churchData } from "@/content/site";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${origin}/devotionals/verify?status=invalid`);
  }

  const subscriber = await findByVerificationToken(token);

  if (!subscriber) {
    // Check if the token exists but is expired
    const expired = await findByVerificationTokenAny(token);
    if (expired) {
      return NextResponse.redirect(
        `${origin}/devotionals/verify?status=expired&email=${encodeURIComponent(expired.email)}`
      );
    }
    return NextResponse.redirect(`${origin}/devotionals/verify?status=invalid`);
  }

  // Activate the subscriber
  await db
    .update(subscribers)
    .set({
      status: "active",
      verifiedAt: new Date(),
      verificationToken: null,
      verificationTokenExpiresAt: null,
    })
    .where(eq(subscribers.id, subscriber.id));

  // Send welcome email (best-effort — don't block on failure)
  try {
    await sendWelcomeEmail({ subscriber, origin });
  } catch (err) {
    // Verification already succeeded; log but don't reverse it.
    console.error("[verify] Welcome email failed for", subscriber.email, err);
  }

  return NextResponse.redirect(`${origin}/devotionals/verify?status=success`);
}

async function sendWelcomeEmail({
  subscriber,
  origin,
}: {
  subscriber: { id: string; email: string; name: string | null; unsubscribeToken: string };
  origin: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? origin;
  const settings = getDevotionalEmailSettingsForSend(baseUrl);
  const churchName = churchData?.name ?? settings.senderName;

  const plans = await getSubscriberPlans(subscriber.id);
  const planTitles = plans
    .map((p) => getReadingPlan(p.planSlug)?.title ?? p.planSlug)
    .filter(Boolean) as string[];

  const manageUrl = `${origin}/preferences?token=${subscriber.unsubscribeToken}`;

  const html = await render(
    WelcomeEmail({
      churchName,
      subscriberName: subscriber.name,
      planTitles,
      manageUrl,
      brandColor: settings.brandColor,
      logoUrl: settings.logoUrl,
      footerText: settings.footerText,
      intro: settings.intro,
      outro: settings.outro,
    })
  );

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: `${settings.senderName} <${settings.senderEmail}>`,
    to: subscriber.email,
    subject: `Welcome! Your ${churchName} devotionals start tomorrow`,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}
