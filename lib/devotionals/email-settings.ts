import fs from "node:fs";
import path from "node:path";
import { resolveEmailImageUrl } from "@/lib/email/logo-url";

interface SoapOverride {
  intro?: string;
  outro?: string;
}

export interface DevotionalEmailSettings {
  senderName: string;
  senderEmail: string;
  subjectTemplate: string;
  intro: string;
  outro: string;
  brandColor: string;
  logoUrl: string;
  footerText: string;
  soapOverride?: SoapOverride;
  simpleOverride?: SoapOverride;
  lectioOverride?: SoapOverride;
}

export function getDevotionalEmailSettings(): DevotionalEmailSettings {
  const filePath = path.join(process.cwd(), "content/devotional-email-settings.json");
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as DevotionalEmailSettings;
  // RESEND_FROM_EMAIL env var wins over the JSON value — production deployments
  // set this in Vercel environment variables; the JSON field is a human-readable
  // fallback for editors who don't know about env vars.
  return {
    ...raw,
    senderEmail: process.env.RESEND_FROM_EMAIL ?? raw.senderEmail,
  };
}

/**
 * Same as getDevotionalEmailSettings() but with logoUrl normalized to an
 * absolute URL using `baseUrl`. Always use this when handing settings to an
 * email template — relative paths render as broken images in both real
 * inboxes and the admin srcDoc preview iframe.
 */
export function getDevotionalEmailSettingsForSend(baseUrl: string): DevotionalEmailSettings {
  const settings = getDevotionalEmailSettings();
  return {
    ...settings,
    logoUrl: resolveEmailImageUrl(settings.logoUrl, baseUrl),
  };
}
