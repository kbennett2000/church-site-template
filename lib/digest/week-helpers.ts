// Helpers for week-window math.
//
// All "current week" calculations are anchored to a *date* (YYYY-MM-DD), not a
// timestamp — the church configures one timezone, and the send job evaluates
// "what week is it" in that timezone before calling these helpers.

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/** "Wednesday" → 3. Case-insensitive. Returns null for unknown names. */
export function dayOfWeekIndex(name: string): number | null {
  const idx = DAYS_OF_WEEK.findIndex((d) => d.toLowerCase() === name.toLowerCase());
  return idx === -1 ? null : idx;
}

/** Local date (YYYY-MM-DD) for `now` in the given IANA timezone. */
export function localDateInZone(timezone: string, now: Date): string {
  return now.toLocaleDateString("en-CA", { timeZone: timezone });
}

/** Local hour (0–23) for `now` in the given IANA timezone. */
export function localHourInZone(timezone: string, now: Date): number {
  const h = now.toLocaleString("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  });
  return Number(h) % 24;
}

/** Day-of-week (0=Sun .. 6=Sat) for the given YYYY-MM-DD. */
export function dowOfDate(yyyyMmDd: string): number {
  // Use noon UTC to dodge timezone-edge issues — we only care about the date.
  return new Date(yyyyMmDd + "T12:00:00Z").getUTCDay();
}

/** Returns YYYY-MM-DD `n` days from the given date. Negative `n` goes backwards. */
export function addDays(yyyyMmDd: string, n: number): string {
  const d = new Date(yyyyMmDd + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Returns the Monday of the week containing `yyyyMmDd`.
 * Treats Monday as week-start (ISO 8601).
 */
export function mondayOfWeek(yyyyMmDd: string): string {
  const dow = dowOfDate(yyyyMmDd); // 0=Sun..6=Sat
  // Days to go back to reach Monday: Sun → 6, Mon → 0, Tue → 1, ... Sat → 5
  const back = (dow + 6) % 7;
  return addDays(yyyyMmDd, -back);
}

/** Returns the Sunday of the week containing `yyyyMmDd`. (6 days after Monday.) */
export function sundayOfWeek(yyyyMmDd: string): string {
  return addDays(mondayOfWeek(yyyyMmDd), 6);
}

/**
 * The window of dates this digest covers, given the moment `now` and the
 * church's timezone. The send job's "today" is `now` in `timezone`; the digest
 * covers the Monday-to-Sunday window containing that date.
 */
export function digestWeekWindow(
  timezone: string,
  now: Date = new Date()
): { weekStart: string; weekEnd: string; today: string } {
  const today = localDateInZone(timezone, now);
  return {
    weekStart: mondayOfWeek(today),
    weekEnd: sundayOfWeek(today),
    today,
  };
}

/** Format YYYY-MM-DD as a human-friendly date (e.g. "May 11"). */
export function formatShortDate(yyyyMmDd: string): string {
  return new Date(yyyyMmDd + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
