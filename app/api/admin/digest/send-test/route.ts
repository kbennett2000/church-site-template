import { NextRequest, NextResponse } from "next/server";
import { sendDigestTestTo } from "@/lib/digest/send-weekly";

// POST /api/admin/digest/send-test
// Body: { to: string }
//
// Admin-gated via /middleware.ts. Sends the current week's digest to a single
// address (the admin's own inbox) without recording a send log row. Subject
// is prefixed with [TEST] so it's obvious in the inbox.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { to } = body as { to?: string };

  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Valid email address required" }, { status: 400 });
  }

  const baseUrl = new URL(req.url).origin;
  const result = await sendDigestTestTo({ to, baseUrl });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, weekStart: result.payload.weekStart });
}
