import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL, CHURCH_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, adults, kids, kidsAges, visit, notes } = data;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const serviceLabel = visit === "unsure" ? "Not sure yet" : visit;
    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Adults: ${adults ?? 1}`,
      `Kids: ${kids ?? 0}`,
      kids && Number(kids) > 0 && kidsAges ? `Kids' ages: ${kidsAges}` : null,
      `Service: ${serviceLabel}`,
      notes ? `Notes: ${notes}` : null,
    ].filter(Boolean);

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CHURCH_EMAIL,
      replyTo: email,
      subject: `Visit notification: ${name}`,
      text: [
        `New visit form submission`,
        ``,
        ...lines,
      ].join("\n"),
    });

    if (error) {
      console.error("[visit submit]", error);
      return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[visit submit]", err);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}
