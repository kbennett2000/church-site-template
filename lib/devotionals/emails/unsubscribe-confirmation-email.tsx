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

interface UnsubscribeConfirmationEmailProps {
  churchName: string;
  subscriberName: string | null;
  resubscribeUrl: string;
  brandColor: string;
  logoUrl: string;
  footerText: string;
}

export function UnsubscribeConfirmationEmail({
  churchName,
  subscriberName,
  resubscribeUrl,
  brandColor,
  logoUrl,
  footerText,
}: UnsubscribeConfirmationEmailProps) {
  const greeting = subscriberName ? `Hi ${subscriberName},` : "Hi there,";

  return (
    <Html>
      <Head />
      <Preview>You&apos;ve been unsubscribed from {churchName} devotionals</Preview>
      <Body style={body}>
        <Container style={container}>
          {logoUrl ? (
            <Img src={logoUrl} alt={churchName} width="160" style={logo} />
          ) : (
            <Text style={{ ...churchNameText, color: brandColor }}>{churchName}</Text>
          )}

          <Heading style={{ ...heading, color: brandColor }}>
            You&apos;ve been unsubscribed
          </Heading>

          <Text style={paragraph}>{greeting}</Text>
          <Text style={paragraph}>
            You&apos;ve been successfully unsubscribed from daily devotional
            emails from {churchName}. You won&apos;t receive any more emails from
            us unless you choose to re-subscribe.
          </Text>

          <Text style={paragraph}>
            If you unsubscribed by mistake, you can sign up again below — your
            previous plan preferences won&apos;t be remembered, but you&apos;re
            always welcome back.
          </Text>

          <Section style={buttonSection}>
            <Button
              style={{ ...button, backgroundColor: "#6b7280" }}
              href={resubscribeUrl}
            >
              Re-subscribe
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
