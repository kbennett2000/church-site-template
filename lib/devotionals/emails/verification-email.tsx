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

interface VerificationEmailProps {
  churchName: string;
  subscriberName: string | null;
  planTitles: string[];
  verificationUrl: string;
  brandColor: string;
  logoUrl: string;
  footerText: string;
}

export function VerificationEmail({
  churchName,
  subscriberName,
  planTitles,
  verificationUrl,
  brandColor,
  logoUrl,
  footerText,
}: VerificationEmailProps) {
  const greeting = subscriberName ? `Hi ${subscriberName},` : "Hi there,";
  const planList =
    planTitles.length === 1
      ? planTitles[0]
      : planTitles.slice(0, -1).join(", ") + " and " + planTitles.at(-1);

  return (
    <Html>
      <Head />
      <Preview>Confirm your devotional subscription — one click to get started</Preview>
      <Body style={body}>
        <Container style={container}>
          {logoUrl ? (
            <Img src={logoUrl} alt={churchName} width="160" style={logo} />
          ) : (
            <Text style={{ ...churchNameText, color: brandColor }}>{churchName}</Text>
          )}

          <Heading style={{ ...heading, color: brandColor }}>
            Confirm your subscription
          </Heading>

          <Text style={paragraph}>{greeting}</Text>
          <Text style={paragraph}>
            You signed up to receive daily devotional emails for{" "}
            <strong>{planList}</strong> from {churchName}. Click the button below
            to confirm your email address and activate your subscription.
          </Text>

          <Section style={buttonSection}>
            <Button style={{ ...button, backgroundColor: brandColor }} href={verificationUrl}>
              Confirm my subscription
            </Button>
          </Section>

          <Text style={smallText}>
            This link expires in 24 hours. If you didn&apos;t sign up for
            devotional emails, you can safely ignore this message — no account
            will be created.
          </Text>

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
  height: "auto",
  marginBottom: "24px",
  border: 0,
  display: "block",
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

const smallText: React.CSSProperties = {
  fontSize: "13px",
  color: "#6b7280",
  lineHeight: "1.5",
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
