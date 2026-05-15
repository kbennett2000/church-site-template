import { NextRequest, NextResponse } from "next/server";
import { sendDailyDevotionals } from "@/lib/devotionals/send-daily";
import { logDevotionalSend } from "@/lib/db/queries";

// Vercel Cron authenticates with: Authorization: Bearer <CRON_SECRET>
// https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = new URL(req.url).origin;

  try {
    const summary = await sendDailyDevotionals(baseUrl);

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
    console.error("[cron/devotionals] Fatal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
