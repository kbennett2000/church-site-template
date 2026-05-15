import { NextRequest, NextResponse } from "next/server";
import { sendWeeklyDigest } from "@/lib/digest/send-weekly";

// POST /api/admin/digest/send-now[?force=true]
//
// Admin-gated via /middleware.ts (HTTP basic auth on /api/admin/*).
// Same logic as the cron, but bypasses day/hour checks. Useful for sending
// "right now" on a major announcement day.
//
// Idempotency: refuses to re-send for a week that already has a log row
// unless `force=true` is set.
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "true";
  const baseUrl = url.origin;

  try {
    const summary = await sendWeeklyDigest({ baseUrl, force });
    return NextResponse.json(summary);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/digest/send-now] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
