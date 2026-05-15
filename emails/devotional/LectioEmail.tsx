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
  ScriptureBlock,
  emailBody,
  emailContainer,
} from "./shared";

export function LectioEmail({
  subscriber,
  plan,
  entry,
  scriptureHtml,
  scriptureText: _scriptureText,
  scriptureAttribution,
  settings,
}: DevotionalEmailProps) {
  const greeting = subscriber.name ? `Good morning, ${subscriber.name}.` : "Good morning.";
  const intro = settings.lectioOverride?.intro ?? settings.intro;
  const outro = settings.lectioOverride?.outro ?? settings.outro;

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
          ? `Lectio Divina: ${entry.scriptureReference} — ${entry.title}`
          : `Lectio Divina: ${entry.scriptureReference}`}
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

            {/* Lectio — first reading */}
            <Section style={{ padding: "0 40px 8px" }}>
              <MovementLabel step="1" label="Read (Lectio)" color={settings.brandColor} />
              <Text style={movementGuide}>
                Read the passage below slowly, aloud if possible. Notice which word or
                phrase draws your attention.
              </Text>
            </Section>

            {/* Scripture passage */}
            <ScriptureBlock
              reference={entry.scriptureReference}
              html={scriptureHtml}
              attribution={scriptureAttribution}
              brandColor={settings.brandColor}
            />

            {/* Meditatio */}
            <Section style={movementSection}>
              <MovementLabel step="2" label="Meditate (Meditatio)" color={settings.brandColor} />
              <Text style={movementGuide}>
                Read the passage again silently. Rest on the word or phrase that caught
                your attention. Don&apos;t analyze it — simply let it settle. What is it
                stirring in you?
              </Text>
              <div style={journalSpace} />
            </Section>

            {/* Oratio */}
            <Section style={movementSection}>
              <MovementLabel step="3" label="Pray (Oratio)" color={settings.brandColor} />
              <Text style={movementGuide}>
                Respond to God from what you&apos;ve heard. This might be gratitude,
                confession, a question, or simply &quot;yes.&quot; Speak or write what
                comes naturally.
              </Text>
              <div style={journalSpace} />
            </Section>

            {/* Contemplatio */}
            <Section style={movementSection}>
              <MovementLabel step="4" label="Rest (Contemplatio)" color={settings.brandColor} />
              <Text style={movementGuide}>
                Set aside words. Simply rest in God&apos;s presence for a few quiet
                moments. There is nothing to do — only to be.
              </Text>
              <div style={{ ...journalSpace, height: 32 }} />
            </Section>

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
// Local sub-component
// ---------------------------------------------------------------------------

function MovementLabel({
  step,
  label,
  color,
}: {
  step: string;
  label: string;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: color,
          color: "#ffffff",
          fontSize: 12,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          // Outlook fallback: inline-block with line-height
          lineHeight: "24px",
          textAlign: "center",
        }}
      >
        {step}
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color,
        }}
      >
        {label}
      </span>
    </div>
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

const movementSection: React.CSSProperties = {
  padding: "20px 40px 0",
};

const movementGuide: React.CSSProperties = {
  fontSize: 14,
  color: "#71717a",
  lineHeight: 1.65,
  fontStyle: "italic",
  margin: "0 0 8px",
};

const journalSpace: React.CSSProperties = {
  height: 48,
  borderBottom: "1px dashed #e4e4e7",
  marginTop: 8,
};

export default LectioEmail;
