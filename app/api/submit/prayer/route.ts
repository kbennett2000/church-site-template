import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL, CHURCH_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, request: prayerRequest, privateToTeam, wantsCall } = data;

    if (!prayerRequest) {
      return NextResponse.json({ error: "Prayer request text is required." }, { status: 400 });
    }

    const lines = [
      `From: ${name || "Anonymous"}`,
      email ? `Email: ${email}` : null,
      phone && wantsCall ? `Phone: ${phone}` : null,
      `Private to pastoral team: ${privateToTeam ? "Yes" : "No (share with prayer chain)"}`,
      wantsCall ? `Requested a call: Yes` : null,
      ``,
      `Request:`,
      prayerRequest,
    ].filter(Boolean);

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CHURCH_EMAIL,
      replyTo: email || undefined,
      subject: `Prayer request from ${name || "Anonymous"}`,
      text: [
        `New prayer request`,
        ``,
        ...lines,
      ].join("\n"),
    });

    if (error) {
      console.error("[prayer submit]", error);
      return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[prayer submit]", err);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}
