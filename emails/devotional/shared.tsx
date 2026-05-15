/**
 * Shared types, helpers, and sub-components used by all three devotional
 * email templates (SOAP, Simple, Lectio Divina).
 */

import * as React from "react";
import {
  Hr,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import type { DevotionalEmailSettings } from "@/lib/devotionals/email-settings";

// ---------------------------------------------------------------------------
// Props contract shared by all three templates
// ---------------------------------------------------------------------------

export interface DevotionalEmailProps {
  subscriber: {
    name: string | null;
    email: string;
    unsubscribeToken: string;
  };
  plan: {
    slug: string;
    title: string;
    style: string;
    defaultTranslation: string;
  };
  entry: {
    date: string;       // YYYY-MM-DD
    scriptureReference: string;
    title?: string;
    leaderNotes?: string;
  };
  /** Email-safe HTML version of the scripture passage. */
  scriptureHtml: string;
  /** Plain-text version (for the text/plain MIME part). */
  scriptureText: string;
  scriptureAttribution: string;
  settings: DevotionalEmailSettings & { siteUrl: string };
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

export function formatEmailDate(isoDate: string): string {
  return new Date(isoDate + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

/** Top header: logo (or church name text) + plan name + date. */
export function EmailHeader({
  settings,
  planTitle,
  date,
}: {
  settings: DevotionalEmailProps["settings"];
  planTitle: string;
  date: string;
}) {
  return (
    <Section style={headerSection}>
      {settings.logoUrl ? (
        <Img
          src={settings.logoUrl}
          alt={settings.senderName}
          style={{ maxWidth: 120, marginBottom: 12 }}
        />
      ) : (
        <Text style={{ ...churchName, color: settings.brandColor }}>
          {settings.senderName}
        </Text>
      )}
      <Text style={planNameStyle}>{planTitle}</Text>
      <Text style={dateStyle}>{formatEmailDate(date)}</Text>
    </Section>
  );
}

/** Scripture passage block — renders email-safe HTML. */
export function ScriptureBlock({
  reference,
  html,
  attribution,
  brandColor,
}: {
  reference: string;
  html: string;
  attribution: string;
  brandColor: string;
}) {
  return (
    <Section style={scriptureSection}>
      <Text style={{ ...referenceLabel, color: brandColor }}>{reference}</Text>
      {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
      <div
        style={scriptureText}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {attribution ? (
        <Text style={attributionStyle}>{attribution}</Text>
      ) : null}
    </Section>
  );
}

/** Leader notes card — only rendered when leaderNotes is non-empty. */
export function LeaderNotesBlock({ notes }: { notes: string }) {
  if (!notes.trim()) return null;
  return (
    <Section style={leaderNotesSection}>
      <Text style={leaderNotesLabel}>A note from your pastor</Text>
      <Text style={leaderNotesText}>{notes}</Text>
    </Section>
  );
}

/** Outro + footer (CAN-SPAM compliant). */
export function EmailFooter({
  outro,
  settings,
  unsubscribeToken,
}: {
  outro: string;
  settings: DevotionalEmailProps["settings"];
  unsubscribeToken: string;
}) {
  const unsubscribeUrl = `${settings.siteUrl}/api/devotionals/unsubscribe?token=${unsubscribeToken}`;
  const manageUrl = `${settings.siteUrl}/devotionals/manage?token=${unsubscribeToken}`;

  return (
    <>
      {outro ? <Text style={outroText}>{outro}</Text> : null}
      <Hr style={divider} />
      <Text style={footerText}>{settings.footerText}</Text>
      <Text style={footerLinks}>
        <Link href={manageUrl} style={footerLink}>Manage preferences</Link>
        {"  ·  "}
        <Link href={unsubscribeUrl} style={footerLink}>Unsubscribe</Link>
      </Text>
    </>
  );
}

/** A single prompt row used in SOAP and Lectio sections. */
export function PromptRow({
  label,
  labelColor,
  prompt,
}: {
  label: string;
  labelColor: string;
  prompt: string;
}) {
  return (
    <Section style={promptSection}>
      <Text style={{ ...promptLabel, color: labelColor }}>{label}</Text>
      <Text style={promptText}>{prompt}</Text>
      {/* Visual whitespace that signals "write here" */}
      <div style={promptSpace} />
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Shared inline styles
// ---------------------------------------------------------------------------

export const emailBody: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
};

export const emailContainer: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: 600,
  margin: "32px auto",
  borderRadius: 8,
  overflow: "hidden",
  // Outlook doesn't support border-radius — acceptable degradation
};

const headerSection: React.CSSProperties = {
  padding: "32px 40px 24px",
  borderBottom: "1px solid #e4e4e7",
};

const churchName: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  margin: "0 0 8px",
};

const planNameStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#71717a",
  margin: "0 0 4px",
};

const dateStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#a1a1aa",
  margin: 0,
};

const scriptureSection: React.CSSProperties = {
  padding: "28px 40px",
  backgroundColor: "#fafafa",
  borderBottom: "1px solid #e4e4e7",
};

const referenceLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  margin: "0 0 12px",
};

const scriptureText: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1.75,
  color: "#18181b",
  fontFamily: 'Georgia, "Times New Roman", serif',
  margin: "0 0 12px",
};

const attributionStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#a1a1aa",
  fontStyle: "italic",
  margin: 0,
};

const leaderNotesSection: React.CSSProperties = {
  margin: "0 40px 24px",
  padding: "16px 20px",
  backgroundColor: "#f0f9ff",
  borderLeft: "3px solid #0ea5e9",
  borderRadius: "0 6px 6px 0",
};

const leaderNotesLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#0369a1",
  margin: "0 0 6px",
};

const leaderNotesText: React.CSSProperties = {
  fontSize: 15,
  color: "#0c4a6e",
  lineHeight: 1.6,
  margin: 0,
};

const outroText: React.CSSProperties = {
  fontSize: 15,
  color: "#52525b",
  lineHeight: 1.7,
  padding: "24px 40px 0",
  margin: 0,
};

const divider: React.CSSProperties = {
  borderColor: "#e4e4e7",
  margin: "24px 40px 0",
};

const footerText: React.CSSProperties = {
  fontSize: 11,
  color: "#a1a1aa",
  lineHeight: 1.6,
  padding: "0 40px",
  whiteSpace: "pre-line",
  margin: "16px 0 0",
};

const footerLinks: React.CSSProperties = {
  fontSize: 11,
  color: "#a1a1aa",
  padding: "8px 40px 32px",
  margin: 0,
};

const footerLink: React.CSSProperties = {
  color: "#a1a1aa",
};

const promptSection: React.CSSProperties = {
  padding: "0 40px",
  marginBottom: 24,
};

const promptLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  margin: "0 0 6px",
};

const promptText: React.CSSProperties = {
  fontSize: 14,
  color: "#71717a",
  lineHeight: 1.6,
  margin: 0,
};

const promptSpace: React.CSSProperties = {
  height: 48,
  marginTop: 8,
  borderBottom: "1px dashed #e4e4e7",
};
