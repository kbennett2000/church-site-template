import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import {
  DevotionalEmailProps,
  EmailFooter,
  EmailHeader,
  LeaderNotesBlock,
  ScriptureBlock,
  emailBody,
  emailContainer,
} from "./shared";

export function SimpleEmail({
  subscriber,
  plan,
  entry,
  scriptureHtml,
  scriptureText: _scriptureText,
  scriptureAttribution,
  settings,
}: DevotionalEmailProps) {
  const greeting = subscriber.name ? `Good morning, ${subscriber.name}.` : "Good morning.";
  const intro = settings.simpleOverride?.intro ?? settings.intro;
  const outro = settings.simpleOverride?.outro ?? settings.outro;

  const readOnlineUrl = `${settings.siteUrl}/devotionals/${plan.slug}/${entry.date}`;

  return (
    <Html lang="en">
      <Head>
        <style>{`
          @media (prefers-color-scheme: dark) {
            .email-body { background-color: #18181b !important; }
            .email-card { background-color: #27272a !important; }
            .scripture-bg { background-color: #1c1c1f !important; }
          }
        `}</style>
      </Head>
      <Preview>
        {entry.title
          ? `${entry.scriptureReference} — ${entry.title}`
          : `Your daily reading: ${entry.scriptureReference}`}
      </Preview>
      <Tailwind>
        <Body className="email-body" style={emailBody}>
          <Container className="email-card" style={emailContainer}>
            <EmailHeader
              settings={settings}
              planTitle={plan.title}
              date={entry.date}
            />

            {/* Greeting */}
            <Section style={{ padding: "24px 40px 16px" }}>
              <Text style={bodyText}>{greeting}</Text>
              <Text style={bodyText}>{intro}</Text>
            </Section>

            {/* Entry title */}
            {entry.title && (
              <Section style={{ padding: "0 40px 16px" }}>
                <Text style={entryTitle}>{entry.title}</Text>
              </Section>
            )}

            {/* Scripture passage */}
            <ScriptureBlock
              reference={entry.scriptureReference}
              html={scriptureHtml}
              attribution={scriptureAttribution}
              brandColor={settings.brandColor}
            />

            {/* Thought prompt */}
            <Section style={{ padding: "28px 40px 0" }}>
              <Text style={promptHeading}>For reflection</Text>
              <Text style={promptText}>
                Take a moment to sit quietly with this passage. What is one word or image
                that stands out? Carry it with you through the day.
              </Text>
            </Section>

            {/* Leader notes */}
            {entry.leaderNotes && (
              <Section style={{ padding: "0 0 8px" }}>
                <LeaderNotesBlock notes={entry.leaderNotes} />
              </Section>
            )}

            {/* Read online CTA */}
            <Section style={{ padding: "16px 40px 8px", textAlign: "center" as const }}>
              <Button
                href={readOnlineUrl}
                style={{
                  backgroundColor: settings.brandColor,
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "12px 24px",
                  borderRadius: 6,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Read on the site →
              </Button>
            </Section>

            {/* Footer */}
            <EmailFooter
              outro={outro}
              settings={settings}
              unsubscribeToken={subscriber.unsubscribeToken}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const bodyText: React.CSSProperties = {
  fontSize: 15,
  color: "#3f3f46",
  lineHeight: 1.7,
  margin: "0 0 12px",
};

const entryTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: "#18181b",
  fontFamily: 'Georgia, "Times New Roman", serif',
  margin: 0,
};

const promptHeading: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#a1a1aa",
  margin: "0 0 8px",
};

const promptText: React.CSSProperties = {
  fontSize: 15,
  color: "#52525b",
  lineHeight: 1.7,
  fontStyle: "italic",
  margin: 0,
};

export default SimpleEmail;
