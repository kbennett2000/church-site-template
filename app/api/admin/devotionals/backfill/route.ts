import { NextRequest, NextResponse } from "next/server";
import { backfillDate } from "@/lib/devotionals/send-daily";
import { logDevotionalSend } from "@/lib/db/queries";

// POST /api/admin/devotionals/backfill
// Body: { date: string }  (YYYY-MM-DD)
// Protected by middleware Basic Auth.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { date } = body as { date?: string };
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Valid date (YYYY-MM-DD) required" }, { status: 400 });
  }

  // Don't allow future dates — that's what the cron is for
  const today = new Date().toISOString().slice(0, 10);
  if (date > today) {
    return NextResponse.json({ error: "Cannot backfill a future date" }, { status: 400 });
  }

  const baseUrl = new URL(req.url).origin;

  try {
    const summary = await backfillDate(baseUrl, date);

    await logDevotionalSend(
      summary.runDate,
      {
        attempted: summary.attempted,
        sent: summary.sent,
        skipped: summary.skipped,
        failed: summary.failed,
      },
      summary.errors
    );

    return NextResponse.json(summary);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
