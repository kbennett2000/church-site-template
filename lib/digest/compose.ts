import { getActiveAnnouncements } from "@/content/announcements";
import { getAllSermons } from "@/content/sermons";
import { upcomingEventsAfter } from "@/lib/calendar-data";
import { churchInfo } from "@/lib/church-info";
import { getDigestSettings } from "./settings";
import { findReadyNoteForWeek } from "./notes";
import { addDays, digestWeekWindow } from "./week-helpers";
import type { DigestPayload } from "./types";

export interface ComposeArgs {
  /** Defaults to "now". */
  now?: Date;
  /** Defaults to `${origin}` of the request — use a real URL for production. */
  siteUrl: string;
  /**
   * When provided, only announcements posted on/after this date are included.
   * Otherwise we use a 7-day lookback from the start of the digest week.
   */
  sinceDate?: string;
}

/**
 * Build a DigestPayload for "this week" given the church timezone and config.
 *
 * Pure read-only — does not touch the DB or hit the network. Suitable for the
 * admin preview, the send job, and the archive page.
 */
export function composeDigest({ now = new Date(), siteUrl, sinceDate }: ComposeArgs): DigestPayload {
  const settings = getDigestSettings();
  const { weekStart, weekEnd, today } = digestWeekWindow(settings.sendTimezone, now);

  // ---------- Announcements ----------
  // Take active announcements whose post date is >= `sinceDate` (or the week
  // before the digest if no sinceDate is given). We keep already-active ones
  // even if posted >7 days ago when they're new since the last send.
  const announcementCutoff = sinceDate ?? addDays(weekStart, -7);
  const announcements = getActiveAnnouncements().filter(
    (a) => a.date >= announcementCutoff
  );

  // ---------- Events ----------
  // Events between "today" and today + lookahead days, in the church's timezone.
  const eventsLookahead = Math.max(1, settings.eventsLookaheadDays || 10);
  // upcomingEventsAfter() returns events sorted by date asc — we slice by date,
  // not by count, so a busy week shows everything in the lookahead window.
  const cutoff = addDays(today, eventsLookahead);
  const events = upcomingEventsAfter(today, 100).filter((e) => e.date < cutoff);

  // ---------- Sermons ----------
  const sermonsLookbackCount = Math.max(0, settings.sermonsLookbackCount || 0);
  const sermons = getAllSermons().slice(0, sermonsLookbackCount);

  // ---------- Pastor's note ----------
  const note = findReadyNoteForWeek(weekStart, weekEnd);

  return {
    weekStart,
    weekEnd,
    churchName: churchInfo.name,
    settings,
    siteUrl,
    note,
    announcements,
    events,
    sermons,
  };
}

/**
 * A short summary of what each section contains — used by the admin preview
 * sidebar. Mirrors composeDigest() exactly so the numbers are guaranteed accurate.
 */
export function describePayload(p: DigestPayload): {
  announcements: string;
  events: string;
  sermons: string;
  note: string;
} {
  return {
    announcements: `${p.announcements.length} announcement${p.announcements.length === 1 ? "" : "s"} since ${addDays(p.weekStart, -7)}`,
    events: `${p.events.length} event${p.events.length === 1 ? "" : "s"} in next ${p.settings.eventsLookaheadDays} days`,
    sermons: `${p.sermons.length} sermon${p.sermons.length === 1 ? "" : "s"} (most recent ${p.settings.sermonsLookbackCount})`,
    note: p.note ? `Pastor's note: present (weekOf ${p.note.weekOf})` : "Pastor's note: none ready this week — section will be omitted",
  };
}
