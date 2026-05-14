import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL, CHURCH_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, roleId, roleTitle } = data;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CHURCH_EMAIL,
      replyTo: email,
      subject: `Volunteer interest: ${roleTitle} — ${name}`,
      text: [
        `New volunteer interest`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        `Role: ${roleTitle} (${roleId})`,
        ``,
        `Reply to this email to follow up.`,
      ].join("\n"),
    });

    if (error) {
      console.error("[serve submit]", error);
      return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[serve submit]", err);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}
