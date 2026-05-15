// Shared types for the weekly digest pipeline.
// Loaders, composer, email template, and send job all import from here.

import type { Announcement } from "@/lib/announcements";
import type { EventInstance } from "@/lib/calendar-data";
import type { Sermon } from "@/lib/sermons";

export interface DigestSettings {
  isEnabled: boolean;
  senderName: string;
  senderEmail: string;
  subjectTemplate: string;
  sendDay: string;        // "Sunday" .. "Saturday"
  sendHour: number;       // 0..23
  sendTimezone: string;   // IANA, e.g. "America/Denver"
  eventsLookaheadDays: number;
  sermonsLookbackCount: number;
  brandColor: string;
  logoUrl: string;
  footerText: string;
  introHtml: string;
}

export interface DigestNote {
  /** Slug of the file (YYYY-MM-DD). */
  id: string;
  /** Monday of the week the note belongs to. */
  weekOf: string;         // YYYY-MM-DD
  title?: string;
  signedBy?: string;
  status: "draft" | "ready" | "sent";
  /** HTML rendered from the markdown body. */
  bodyHtml: string;
  /** Plain-text version of the body — for the text/plain MIME part. */
  bodyText: string;
}

/**
 * What composeDigest() returns. The email template renders this directly.
 * Every section is optional — the template hides sections that are null/empty.
 */
export interface DigestPayload {
  weekStart: string;      // YYYY-MM-DD (Monday)
  weekEnd: string;        // YYYY-MM-DD (Sunday)
  churchName: string;
  settings: DigestSettings;
  /** Origin URL the email will link back to (e.g. https://yourchurch.org). */
  siteUrl: string;
  note: DigestNote | null;
  announcements: Announcement[];
  events: EventInstance[];
  sermons: Sermon[];
}

/** Computed at compose time. True when every section is empty. */
export function isEmptyPayload(p: DigestPayload): boolean {
  return (
    !p.note &&
    p.announcements.length === 0 &&
    p.events.length === 0 &&
    p.sermons.length === 0
  );
}
