/**
 * Weekly digest email template.
 *
 * Renders the same shape devotional emails use:
 *  - Container card on a light-grey body, max-width 600px
 *  - Brand-colored hero band with logo/sender name + week range
 *  - Sections: pastor's note, announcements, events, recent sermons
 *  - CAN-SPAM footer with manage + unsubscribe links
 *
 * Every section renders nothing if its data is empty, so the same template
 * works whether the church has one announcement or thirty.
 */

import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type { DigestPayload } from "@/lib/digest/types";
import { formatShortDate } from "@/lib/digest/week-helpers";

export interface DigestEmailProps {
  payload: DigestPayload;
  subscriber: {
    name: string | null;
    email: string;
    unsubscribeToken: string;
  };
}

// ---------------------------------------------------------------------------
// Top-level component
// ---------------------------------------------------------------------------

export function DigestEmail({ payload, subscriber }: DigestEmailProps) {
  const { settings, weekStart, weekEnd, churchName, siteUrl, note, announcements, events, sermons } = payload;

  const preview =
    note?.title
      ? `${note.title} — and what's happening this week`
      : `What's happening at ${churchName} this week`;

  const manageUrl = `${siteUrl}/preferences?token=${subscriber.unsubscribeToken}`;
  const unsubscribeUrl = `${siteUrl}/api/devotionals/unsubscribe?token=${subscriber.unsubscribeToken}`;

  return (
    <Html lang="en">
      <Head>
        <style>{`
          @media (prefers-color-scheme: dark) {
            .email-body { background-color: #18181b !important; }
            .email-card { background-color: #27272a !important; }
            .digest-section { background-color: #1c1c1f !important; }
            .digest-text { color: #e4e4e7 !important; }
            .digest-muted { color: #a1a1aa !important; }
          }
          /* Outlook 2007–2016 fallback — no rounded corners, smaller padding */
          /*[if mso]>
            <style type="text/css">
              .email-card { border-radius: 0 !important; }
            </style>
          <![endif]*/
        `}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="email-body" style={emailBody}>
          <Container className="email-card" style={emailContainer}>

            {/* ---- Header ---- */}
            <Section style={{ ...headerSection, backgroundColor: settings.brandColor }}>
              {settings.logoUrl ? (
                <Img
                  src={settings.logoUrl}
                  alt={settings.senderName || churchName}
                  style={{ maxWidth: 140, marginBottom: 12 }}
                />
              ) : (
                <Text style={headerChurchName}>{settings.senderName || churchName}</Text>
              )}
              <Text style={headerWeekLabel}>Weekly Digest</Text>
              <Text style={headerWeekRange}>
                Week of {formatShortDate(weekStart)} – {formatShortDate(weekEnd)}
              </Text>
            </Section>

            {/* ---- Optional intro ---- */}
            {settings.introHtml && (
              <Section style={introSection}>
                <div
                  className="digest-text"
                  style={introStyle}
                  dangerouslySetInnerHTML={{ __html: settings.introHtml }}
                />
              </Section>
            )}

            {/* ---- Pastor's note ---- */}
            {note && (
              <Section style={noteSection}>
                <Text style={{ ...sectionLabel, color: settings.brandColor }}>
                  {note.title ?? "A Note from the Pastor"}
                </Text>
                <div
                  className="digest-text"
                  style={noteBody}
                  dangerouslySetInnerHTML={{ __html: note.bodyHtml }}
                />
                {note.signedBy && (
                  <Text className="digest-muted" style={noteSignature}>— {note.signedBy}</Text>
                )}
              </Section>
            )}

            {/* ---- Announcements ---- */}
            {announcements.length > 0 && (
              <Section className="digest-section" style={announcementsSection}>
                <Text style={{ ...sectionLabel, color: settings.brandColor }}>Announcements</Text>
                {announcements.map((a, i) => (
                  <div key={a.id} style={announcementCard(i === announcements.length - 1)}>
                    <Text className="digest-text" style={announcementTitle}>
                      {a.pinned ? "📌 " : ""}{a.title}
                    </Text>
                    <Text className="digest-muted" style={announcementMeta}>
                      Posted {formatShortDate(a.date)}
                    </Text>
                    <Text className="digest-text" style={announcementBody}>
                      {a.body}
                    </Text>
                    {a.link && (
                      <Link
                        href={a.link.startsWith("http") ? a.link : `${siteUrl}${a.link}`}
                        style={{ ...announcementLink, color: settings.brandColor }}
                      >
                        {a.linkLabel ?? "Read more"} →
                      </Link>
                    )}
                  </div>
                ))}
              </Section>
            )}

            {/* ---- Upcoming events ---- */}
            {events.length > 0 && (
              <Section style={eventsSection}>
                <Text style={{ ...sectionLabel, color: settings.brandColor }}>This Week & Beyond</Text>
                {events.map((e) => (
                  <div key={e.id} style={eventRow}>
                    <Text className="digest-muted" style={eventDate}>
                      {formatShortDate(e.date)} · {e.time}
                    </Text>
                    <Text className="digest-text" style={eventTitle}>{e.title}</Text>
                    {e.location && (
                      <Text className="digest-muted" style={eventLocation}>{e.location}</Text>
                    )}
                  </div>
                ))}
                <Text style={{ marginTop: 16, marginBottom: 0 }}>
                  <Link
                    href={`${siteUrl}/calendar`}
                    style={{ ...announcementLink, color: settings.brandColor }}
                  >
                    See the full calendar →
                  </Link>
                </Text>
              </Section>
            )}

            {/* ---- Recent sermons ---- */}
            {sermons.length > 0 && (
              <Section className="digest-section" style={sermonsSection}>
                <Text style={{ ...sectionLabel, color: settings.brandColor }}>
                  {sermons.length === 1 ? "Latest Sermon" : "Recent Sermons"}
                </Text>
                {sermons.map((s) => (
                  <div key={s.id} style={sermonCard}>
                    {s.thumbnail && (
                      <Img
                        src={s.thumbnail.startsWith("http") ? s.thumbnail : `${siteUrl}${s.thumbnail}`}
                        alt={s.title}
                        style={sermonThumb}
                      />
                    )}
                    <Text className="digest-text" style={sermonTitle}>{s.title}</Text>
                    <Text className="digest-muted" style={sermonMeta}>
                      {s.speaker} · {formatShortDate(s.date)}
                      {s.scripture ? ` · ${s.scripture}` : ""}
                    </Text>
                    <Text style={{ marginTop: 12, marginBottom: 0 }}>
                      <Button
                        href={`${siteUrl}/watch/${s.id}`}
                        style={{
                          backgroundColor: settings.brandColor,
                          color: "#ffffff",
                          fontSize: 13,
                          fontWeight: 600,
                          padding: "10px 20px",
                          borderRadius: 6,
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Watch / Listen / Notes →
                      </Button>
                    </Text>
                  </div>
                ))}
              </Section>
            )}

            {/* ---- Footer ---- */}
            <Hr style={divider} />
            <Text className="digest-muted" style={footerText}>{settings.footerText}</Text>
            <Text style={footerLinksRow}>
              <Link href={manageUrl} style={footerLink}>Manage preferences</Link>
              {"  ·  "}
              <Link href={unsubscribeUrl} style={footerLink}>Unsubscribe</Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Plain-text alternative
// ---------------------------------------------------------------------------

/**
 * A simple plain-text rendering of the digest — used for the text/plain MIME
 * part. Email clients fall back to this when HTML is blocked.
 */
export function renderDigestPlainText(props: DigestEmailProps): string {
  const { payload, subscriber } = props;
  const { weekStart, weekEnd, churchName, siteUrl, note, announcements, events, sermons, settings } = payload;

  const lines: string[] = [];
  lines.push(`${settings.senderName || churchName} — Weekly Digest`);
  lines.push(`Week of ${formatShortDate(weekStart)} – ${formatShortDate(weekEnd)}`);
  lines.push("");

  if (note) {
    lines.push(note.title ?? "A Note from the Pastor");
    lines.push(note.bodyText);
    if (note.signedBy) lines.push(`— ${note.signedBy}`);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  if (announcements.length > 0) {
    lines.push("ANNOUNCEMENTS");
    lines.push("");
    for (const a of announcements) {
      lines.push(`${a.pinned ? "[Pinned] " : ""}${a.title} (posted ${formatShortDate(a.date)})`);
      lines.push(a.body);
      if (a.link) lines.push(`${a.linkLabel ?? "Read more"}: ${a.link.startsWith("http") ? a.link : siteUrl + a.link}`);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  if (events.length > 0) {
    lines.push("THIS WEEK & BEYOND");
    lines.push("");
    for (const e of events) {
      lines.push(`${formatShortDate(e.date)} · ${e.time} — ${e.title}${e.location ? ` (${e.location})` : ""}`);
    }
    lines.push("");
    lines.push(`Full calendar: ${siteUrl}/calendar`);
    lines.push("---");
    lines.push("");
  }

  if (sermons.length > 0) {
    lines.push(sermons.length === 1 ? "LATEST SERMON" : "RECENT SERMONS");
    lines.push("");
    for (const s of sermons) {
      lines.push(`${s.title}`);
      lines.push(`${s.speaker} · ${formatShortDate(s.date)}${s.scripture ? ` · ${s.scripture}` : ""}`);
      lines.push(`${siteUrl}/watch/${s.id}`);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  lines.push(settings.footerText);
  lines.push("");
  lines.push(`Manage preferences: ${siteUrl}/preferences?token=${subscriber.unsubscribeToken}`);
  lines.push(`Unsubscribe: ${siteUrl}/api/devotionals/unsubscribe?token=${subscriber.unsubscribeToken}`);

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const emailBody: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
};

const emailContainer: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: 600,
  margin: "32px auto",
  borderRadius: 8,
  overflow: "hidden",
};

const headerSection: React.CSSProperties = {
  padding: "32px 40px",
  textAlign: "center" as const,
};

const headerChurchName: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: "#ffffff",
  margin: "0 0 12px",
};

const headerWeekLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  color: "rgba(255,255,255,0.85)",
  margin: "0 0 4px",
};

const headerWeekRange: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(255,255,255,0.95)",
  margin: 0,
};

const introSection: React.CSSProperties = {
  padding: "24px 40px 8px",
};

const introStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#52525b",
  lineHeight: 1.7,
};

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  margin: "0 0 12px",
};

const noteSection: React.CSSProperties = {
  padding: "28px 40px 8px",
};

const noteBody: React.CSSProperties = {
  fontSize: 15,
  color: "#3f3f46",
  lineHeight: 1.7,
};

const noteSignature: React.CSSProperties = {
  fontSize: 13,
  fontStyle: "italic",
  color: "#71717a",
  margin: "8px 0 0",
};

const announcementsSection: React.CSSProperties = {
  padding: "24px 40px",
  backgroundColor: "#fafafa",
  borderTop: "1px solid #e4e4e7",
  borderBottom: "1px solid #e4e4e7",
};

function announcementCard(isLast: boolean): React.CSSProperties {
  return {
    paddingBottom: isLast ? 0 : 20,
    marginBottom: isLast ? 0 : 20,
    borderBottom: isLast ? "none" : "1px solid #e4e4e7",
  };
}

const announcementTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: "#18181b",
  margin: "0 0 4px",
};

const announcementMeta: React.CSSProperties = {
  fontSize: 11,
  color: "#a1a1aa",
  margin: "0 0 8px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const announcementBody: React.CSSProperties = {
  fontSize: 14,
  color: "#52525b",
  lineHeight: 1.6,
  margin: "0 0 8px",
};

const announcementLink: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  textDecoration: "none",
};

const eventsSection: React.CSSProperties = {
  padding: "24px 40px",
};

const eventRow: React.CSSProperties = {
  padding: "10px 0",
  borderBottom: "1px solid #f4f4f5",
};

const eventDate: React.CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#a1a1aa",
  margin: "0 0 2px",
};

const eventTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: "#18181b",
  margin: "0 0 2px",
};

const eventLocation: React.CSSProperties = {
  fontSize: 13,
  color: "#71717a",
  margin: 0,
};

const sermonsSection: React.CSSProperties = {
  padding: "24px 40px",
  backgroundColor: "#fafafa",
  borderTop: "1px solid #e4e4e7",
};

const sermonCard: React.CSSProperties = {
  paddingBottom: 8,
};

const sermonThumb: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
  height: "auto",
  borderRadius: 6,
  marginBottom: 12,
  display: "block",
};

const sermonTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: "#18181b",
  margin: "0 0 4px",
};

const sermonMeta: React.CSSProperties = {
  fontSize: 12,
  color: "#71717a",
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

const footerLinksRow: React.CSSProperties = {
  fontSize: 11,
  color: "#a1a1aa",
  padding: "8px 40px 32px",
  margin: 0,
};

const footerLink: React.CSSProperties = {
  color: "#a1a1aa",
};

export default DigestEmail;
