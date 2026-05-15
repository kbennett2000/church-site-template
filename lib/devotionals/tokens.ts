import { randomBytes } from "crypto";

/** Returns a 64-char lowercase hex token (32 random bytes). */
export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

/** Returns a Date exactly 24 hours from now — used for verification token expiry. */
export function verificationExpiresAt(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}
