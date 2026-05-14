import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL, CHURCH_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, topic, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Topic: ${topic}`,
      ``,
      `Message:`,
      message,
    ].filter(Boolean);

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CHURCH_EMAIL,
      replyTo: email,
      subject: `Contact form: ${topic} — ${name}`,
      text: [
        `New contact form submission`,
        ``,
        ...lines,
      ].join("\n"),
    });

    if (error) {
      console.error("[contact submit]", error);
      return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact submit]", err);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}
