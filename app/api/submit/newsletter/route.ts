import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL, CHURCH_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email } = data;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CHURCH_EMAIL,
      subject: `Newsletter signup: ${email}`,
      text: [
        `New newsletter signup`,
        ``,
        `Email: ${email}`,
        ``,
        `Add this address to your mailing list or email platform.`,
      ].join("\n"),
    });

    if (error) {
      console.error("[newsletter submit]", error);
      return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[newsletter submit]", err);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}
