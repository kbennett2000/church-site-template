import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { findByUnsubscribeToken } from "@/lib/db/queries";
import { getDevotionalEmailSettingsForSend } from "@/lib/devotionals/email-settings";
import { UnsubscribeConfirmationEmail } from "@/lib/devotionals/emails/unsubscribe-confirmation-email";
import { getResend } from "@/lib/resend";
import { churchData } from "@/content/site";
import { eq } from "drizzle-orm";

// GET /api/devotionals/unsubscribe?token=<unsubscribeToken>
// One-click unsubscribe. Redirects to /devotionals/unsubscribe?status=success|invalid.
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${origin}/devotionals/unsubscribe?status=invalid`);
  }

  const subscriber = await findByUnsubscribeToken(token);
  if (!subscriber) {
    return NextResponse.redirect(`${origin}/devotionals/unsubscribe?status=invalid`);
  }
  if (subscriber.status === "unsubscribed") {
    return NextResponse.redirect(`${origin}/devotionals/unsubscribe?status=already`);
  }

  await db
    .update(subscribers)
    .set({ status: "unsubscribed", unsubscribedAt: new Date() })
    .where(eq(subscribers.id, subscriber.id));

  // Send confirmation email (best-effort — unsubscribe already completed above)
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? origin;
    const settings = getDevotionalEmailSettingsForSend(baseUrl);
    const churchName = churchData?.name ?? settings.senderName;
    const resubscribeUrl = `${origin}/devotionals`;

    const html = await render(
      UnsubscribeConfirmationEmail({
        churchName,
        subscriberName: subscriber.name,
        resubscribeUrl,
        brandColor: settings.brandColor,
        logoUrl: settings.logoUrl,
        footerText: settings.footerText,
      })
    );

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: `${settings.senderName} <${settings.senderEmail}>`,
      to: subscriber.email,
      subject: `You've been unsubscribed from ${churchName} devotionals`,
      html,
    });

    if (error) {
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }
  } catch (err) {
    console.error("[unsubscribe] Confirmation email failed for", subscriber.email, err);
  }

  return NextResponse.redirect(`${origin}/devotionals/unsubscribe?status=success`);
}
