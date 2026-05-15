import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL, CHURCH_EMAIL } from "@/lib/resend";
import { getGroup } from "@/content/groups";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { groupId, name, email, phone, message } = data;

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!groupId) {
      return NextResponse.json({ error: "Group ID is required." }, { status: 400 });
    }

    // Look up the group server-side so the client cannot specify an arbitrary
    // recipient — prevents this route from acting as an open email relay.
    const group = getGroup(groupId);
    if (!group) {
      return NextResponse.json({ error: "Group not found." }, { status: 404 });
    }

    const to = group.contactEmail || CHURCH_EMAIL;

    const lines = [
      `Name: ${name}`,
      email ? `Email: ${email}` : null,
      phone ? `Phone: ${phone}` : null,
      message ? `\nMessage:\n${message}` : null,
    ].filter(Boolean);

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: email || undefined,
      subject: `Group interest: ${group.name} — ${name}`,
      text: [
        `New interest in small group: ${group.name}`,
        ``,
        ...lines,
        ``,
        `Reply to this email to follow up.`,
      ].join("\n"),
    });

    if (error) {
      console.error("[group submit]", error);
      return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[group submit]", err);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}
