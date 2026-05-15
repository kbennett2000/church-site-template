import * as React from "react";
import {
  Body,
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
  PromptRow,
  ScriptureBlock,
  emailBody,
  emailContainer,
} from "./shared";

export function SoapEmail({
  subscriber,
  plan,
  entry,
  scriptureHtml,
  scriptureText: _scriptureText,
  scriptureAttribution,
  settings,
}: DevotionalEmailProps) {
  const greeting = subscriber.name ? `Good morning, ${subscriber.name}.` : "Good morning.";

  // Allow per-style intro/outro overrides from settings
  const intro = settings.soapOverride?.intro ?? settings.intro;
  const outro = settings.soapOverride?.outro ?? settings.outro;

  return (
    <Html lang="en">
      <Head>
        {/* Dark mode — limited client support; degrades gracefully */}
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
          : `Today's SOAP reading: ${entry.scriptureReference}`}
      </Preview>
      <Tailwind>
        <Body className="email-body" style={emailBody}>
          <Container className="email-card" style={emailContainer}>
            <EmailHeader
              settings={settings}
              planTitle={plan.title}
              date={entry.date}
            />

            {/* Greeting + intro */}
            <Section style={{ padding: "24px 40px 0" }}>
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

            {/* SOAP section header */}
            <Section style={{ padding: "28px 40px 8px" }}>
              <Text style={{ ...soapHeader, borderBottomColor: settings.brandColor }}>
                S · O · A · P
              </Text>
              <Text style={soapSubheader}>
                Work through each section slowly. There&apos;s no right answer — this is
                between you and God.
              </Text>
            </Section>

            {/* S — Scripture */}
            <PromptRow
              label="S — Scripture"
              labelColor={settings.brandColor}
              prompt="Write out a word, verse, or phrase from the passage that stands out to you. Why does it grab your attention?"
            />

            {/* O — Observation */}
            <PromptRow
              label="O — Observation"
              labelColor={settings.brandColor}
              prompt="What do you notice about this passage? Consider the context, the audience, and what the author is trying to communicate."
            />

            {/* A — Application */}
            <PromptRow
              label="A — Application"
              labelColor={settings.brandColor}
              prompt="How does this passage speak to your life today? What is one concrete thing you can do differently because of it?"
            />

            {/* P — Prayer */}
            <PromptRow
              label="P — Prayer"
              labelColor={settings.brandColor}
              prompt="Write a short prayer in response to what you&apos;ve read. Speak honestly — gratitude, confession, request, or simply &apos;yes.&apos;"
            />

            {/* Leader notes */}
            {entry.leaderNotes && <LeaderNotesBlock notes={entry.leaderNotes} />}

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
// Styles local to this template
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

const soapHeader: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: "#18181b",
  borderBottom: "2px solid",
  paddingBottom: 8,
  margin: "0 0 8px",
};

const soapSubheader: React.CSSProperties = {
  fontSize: 13,
  color: "#a1a1aa",
  margin: "0 0 24px",
  lineHeight: 1.5,
};

export default SoapEmail;
