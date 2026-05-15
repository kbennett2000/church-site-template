import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  churchName: string;
  subscriberName: string | null;
  planTitles: string[];
  manageUrl: string;
  brandColor: string;
  logoUrl: string;
  footerText: string;
  intro: string;
  outro: string;
}

export function WelcomeEmail({
  churchName,
  subscriberName,
  planTitles,
  manageUrl,
  brandColor,
  logoUrl,
  footerText,
  intro,
  outro,
}: WelcomeEmailProps) {
  const greeting = subscriberName ? `Welcome, ${subscriberName}!` : "You're subscribed!";

  return (
    <Html>
      <Head />
      <Preview>Your devotional subscription is confirmed — see you tomorrow morning!</Preview>
      <Body style={body}>
        <Container style={container}>
          {logoUrl ? (
            <Img src={logoUrl} alt={churchName} style={logo} />
          ) : (
            <Text style={{ ...churchNameText, color: brandColor }}>{churchName}</Text>
          )}

          <Heading style={{ ...heading, color: brandColor }}>{greeting}</Heading>

          <Text style={paragraph}>{intro}</Text>

          <Section style={planSection}>
            <Text style={planLabel}>Your subscribed plan{planTitles.length !== 1 ? "s" : ""}:</Text>
            {planTitles.map((title) => (
              <Text key={title} style={planItem}>
                • {title}
              </Text>
            ))}
          </Section>

          <Text style={paragraph}>{outro}</Text>

          <Text style={paragraph}>
            You can update your preferences — including your time zone, delivery
            hour, or which plans you follow — at any time using the link below.
          </Text>

          <Section style={buttonSection}>
            <Button style={{ ...button, backgroundColor: brandColor }} href={manageUrl}>
              Manage my preferences
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>{footerText}</Text>
        </Container>
      </Body>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const body: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "40px",
  borderRadius: "8px",
  maxWidth: "560px",
};

const logo: React.CSSProperties = {
  maxWidth: "160px",
  marginBottom: "24px",
};

const churchNameText: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  marginBottom: "24px",
};

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "16px",
};

const paragraph: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#374151",
  marginBottom: "16px",
};

const planSection: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  borderLeft: "3px solid #e5e7eb",
  padding: "16px 20px",
  margin: "24px 0",
  borderRadius: "0 6px 6px 0",
};

const planLabel: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const planItem: React.CSSProperties = {
  fontSize: "16px",
  color: "#374151",
  margin: "4px 0",
};

const buttonSection: React.CSSProperties = {
  textAlign: "center",
  margin: "32px 0",
};

const button: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "14px 28px",
  borderRadius: "6px",
  display: "inline-block",
};

const hr: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "32px 0 16px",
};

const footer: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  lineHeight: "1.5",
  whiteSpace: "pre-line",
};
