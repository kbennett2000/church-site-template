import fs from "node:fs";
import path from "node:path";
import type { DigestSettings } from "./types";

const SETTINGS_PATH = path.join(process.cwd(), "content/digest-settings.json");

const DEFAULTS: DigestSettings = {
  isEnabled: false,
  senderName: "",
  senderEmail: "",
  subjectTemplate: "{{churchName}} — Week of {{weekStart}}",
  sendDay: "Wednesday",
  sendHour: 14,
  sendTimezone: "America/New_York",
  eventsLookaheadDays: 10,
  sermonsLookbackCount: 1,
  brandColor: "#1a3c5e",
  logoUrl: "",
  footerText: "",
  introHtml: "",
};

/** Loads digest-settings.json. RESEND_FROM_EMAIL env var overrides senderEmail. */
export function getDigestSettings(): DigestSettings {
  if (!fs.existsSync(SETTINGS_PATH)) return { ...DEFAULTS };
  const raw = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8")) as Partial<DigestSettings>;
  const merged: DigestSettings = { ...DEFAULTS, ...raw };
  return {
    ...merged,
    senderEmail: process.env.RESEND_FROM_EMAIL ?? merged.senderEmail,
  };
}
