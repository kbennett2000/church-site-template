import { NextRequest, NextResponse } from "next/server";
import { getDigestSettings } from "@/lib/digest/settings";
import { sendWeeklyDigest } from "@/lib/digest/send-weekly";
import { getDigestSendLog } from "@/lib/db/queries";
import {
  dayOfWeekIndex,
  digestWeekWindow,
  dowOfDate,
  localHourInZone,
} from "@/lib/digest/week-helpers";

// Vercel Cron — runs hourly (0 * * * * in vercel.json). We use one shared
// schedule for all churches; the per-church send day/hour comes from the CMS
// digest-settings.json file and is checked on each fire.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = getDigestSettings();
  if (!settings.isEnabled) {
    return NextResponse.json({ skipped: true, reason: "feature_disabled" });
  }

  const configuredDow = dayOfWeekIndex(settings.sendDay);
  if (configuredDow === null) {
    return NextResponse.json({ skipped: true, reason: "invalid_send_day", value: settings.sendDay }, { status: 200 });
  }

  const now = new Date();
  const { weekStart, today } = digestWeekWindow(settings.sendTimezone, now);
  const todayDow = dowOfDate(today);
  const localHour = localHourInZone(settings.sendTimezone, now);

  if (todayDow !== configuredDow) {
    return NextResponse.json({
      skipped: true,
      reason: "wrong_day",
      today,
      todayDow,
      configuredDow,
      configuredDayName: settings.sendDay,
    });
  }

  if (localHour !== settings.sendHour) {
    return NextResponse.json({
      skipped: true,
      reason: "wrong_hour",
      today,
      localHour,
      configuredHour: settings.sendHour,
    });
  }

  // Belt-and-suspenders idempotency check before the send function runs.
  const prior = await getDigestSendLog(weekStart);
  if (prior) {
    return NextResponse.json({ skipped: true, reason: "already_sent", weekStart });
  }

  const baseUrl = new URL(req.url).origin;
  try {
    const summary = await sendWeeklyDigest({ baseUrl, now });
    return NextResponse.json(summary);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[cron/digest] Fatal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
