import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { getDevotionalEmailSettingsForSend } from "@/lib/devotionals/email-settings";
import { fetchScripture } from "@/lib/devotionals/scripture-api";
import { getReadingPlan } from "@/content/devotionals";
import { getResend } from "@/lib/resend";
import { churchData } from "@/content/site";
import { SoapEmail } from "@/emails/devotional/SoapEmail";
import { SimpleEmail } from "@/emails/devotional/SimpleEmail";
import { LectioEmail } from "@/emails/devotional/LectioEmail";
import type { DevotionalEmailProps } from "@/emails/devotional/shared";

// POST /api/admin/devotionals/send-test
// Body: { toEmail: string; planSlug: string; date?: string }
// Protected by middleware Basic Auth.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { toEmail, planSlug, date } = body as {
    toEmail?: string;
    planSlug?: string;
    date?: string;
  };

  if (!toEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!planSlug) {
    return NextResponse.json({ error: "planSlug required" }, { status: 400 });
  }

  const plan = getReadingPlan(planSlug);
  if (!plan) {
    return NextResponse.json({ error: `Plan "${planSlug}" not found` }, { status: 404 });
  }

  const targetDate = date ?? new Date().toISOString().slice(0, 10);
  const entry = plan.entries.find((e) => e.date === targetDate);
  if (!entry) {
    return NextResponse.json(
      { error: `No entry for ${targetDate} in plan "${planSlug}"` },
      { status: 404 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const settings = getDevotionalEmailSettingsForSend(baseUrl);
  const churchName = churchData?.name ?? settings.senderName;
  const settingsWithUrl = { ...settings, senderName: churchName, siteUrl: baseUrl };

  const passage = await fetchScripture(entry.scriptureReference, plan.defaultTranslation);

  const props: DevotionalEmailProps = {
    subscriber: {
      name: "Test Recipient",
      email: toEmail,
      unsubscribeToken: "test-preview-token",
    },
    plan: {
      slug: plan.slug,
      title: plan.title,
      style: plan.style,
      defaultTranslation: plan.defaultTranslation,
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

  const Component =
    plan.style === "soap"
      ? SoapEmail
      : plan.style === "lectio_divina"
      ? LectioEmail
      : SimpleEmail;

  const [html, text] = await Promise.all([
    render(Component(props)),
    render(Component(props), { plainText: true }),
  ]);

  const subject = `[TEST] ${entry.scriptureReference} — ${entry.date}`;

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: `${settings.senderName} <${settings.senderEmail}>`,
    to: toEmail,
    subject,
    html,
    text,
    tags: [{ name: "type", value: "test" }],
  });

  if (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }

  return NextResponse.json({ ok: true, subject, plan: plan.title, date: targetDate });
}
