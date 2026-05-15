import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { markSubscriberBounced, markSubscriberUnsubscribed } from "@/lib/db/queries";

// Resend uses SVIX for webhook delivery.
// Verification follows the SVIX spec:
//   sign_message = "{svix-id}.{svix-timestamp}.{raw-body}"
//   expected_sig = base64( HMAC-SHA256( decoded_secret, sign_message ) )
// The secret comes from the Resend dashboard → Webhooks → Signing Secret.
// It begins with "whsec_" followed by base64-encoded bytes.

const TOLERANCE_SECONDS = 300; // reject webhooks older than 5 minutes

function verifySvixSignature(
  headers: Headers,
  body: string,
  secret: string
): boolean {
  const msgId = headers.get("svix-id") ?? "";
  const msgTimestamp = headers.get("svix-timestamp") ?? "";
  const msgSig = headers.get("svix-signature") ?? "";

  if (!msgId || !msgTimestamp || !msgSig) return false;

  const ts = Number(msgTimestamp);
  if (isNaN(ts) || Math.abs(Date.now() / 1000 - ts) > TOLERANCE_SECONDS) {
    return false;
  }

  const keyBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signMessage = `${msgId}.${msgTimestamp}.${body}`;
  const computed = createHmac("sha256", keyBytes)
    .update(signMessage)
    .digest("base64");

  return msgSig.split(" ").some((token) => {
    const [version, b64] = token.split(",");
    if (version !== "v1" || !b64) return false;
    try {
      return timingSafeEqual(Buffer.from(computed), Buffer.from(b64));
    } catch {
      return false;
    }
  });
}

// ---------------------------------------------------------------------------
// Resend event types we care about
// ---------------------------------------------------------------------------

interface ResendEvent {
  type: string;
  data: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    bounce?: { type?: string };  // "hard" | "soft"
  };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  if (secret && !verifySvixSignature(req.headers, rawBody, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: ResendEvent;
  try {
    event = JSON.parse(rawBody) as ResendEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const recipientEmail = event.data?.to?.[0];

  switch (event.type) {
    case "email.bounced": {
      const bounceType = event.data?.bounce?.type ?? "hard";
      if (bounceType === "hard" && recipientEmail) {
        await markSubscriberBounced(recipientEmail).catch((err: unknown) => {
          console.error("[webhook/resend] Failed to mark bounced:", err);
        });
      }
      break;
    }

    case "email.complained": {
      // Spam complaint — treat as immediate unsubscribe
      if (recipientEmail) {
        await markSubscriberUnsubscribed(recipientEmail).catch((err: unknown) => {
          console.error("[webhook/resend] Failed to mark unsubscribed:", err);
        });
      }
      break;
    }

    case "email.delivered":
      // Optional: future analytics hook
      break;

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
