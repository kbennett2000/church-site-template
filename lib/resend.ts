import { Resend } from "resend";

// Lazy Resend client — instantiated inside request handlers, not at module level,
// so the build succeeds without RESEND_API_KEY set locally.
export function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// The email address that sends notifications. Must be a verified domain in Resend,
// or use "onboarding@resend.dev" for initial testing before domain verification.
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

// The church's inbox that receives form submissions.
// Set CHURCH_EMAIL in Vercel environment variables (matches content/site.json church.email).
export const CHURCH_EMAIL = process.env.CHURCH_EMAIL || "hello@example.church";
