import data from "./admin-access.json";

// =============================================================================
// ADMIN ACCESS ALLOWLIST
// =============================================================================
// Combines two sources of permitted admin emails:
//   1. /content/admin-access.json — CMS-editable, committed to the repo so
//      changes show up in git history.
//   2. ADMIN_ALLOWLIST env var — comma-separated emails. Bootstrap fallback
//      used when the CMS list is still empty (you can't add yourself to the
//      CMS allowlist if you can't sign in to the CMS — chicken-and-egg).
//
// Compared case-insensitively because Google sometimes normalizes the
// "local part" of an address differently than the user typed it.
//
// Only consumed when site.adminAuth.provider === "google". The Basic Auth
// path doesn't use this file at all.
// =============================================================================

export type AdminAccessEntry = {
  email: string;
  role: "admin";
  addedAt?: string;
  addedBy?: string;
};

type RawData = {
  admins?: Array<{
    email?: string;
    role?: string;
    addedAt?: string;
    addedBy?: string;
  }>;
};

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

export function getAdminAllowlistFromCms(): AdminAccessEntry[] {
  const raw = (data as RawData).admins ?? [];
  return raw
    .filter((entry) => typeof entry.email === "string" && entry.email.trim() !== "")
    .map((entry) => ({
      email: normalize(entry.email!),
      role: "admin" as const,
      addedAt: entry.addedAt,
      addedBy: entry.addedBy,
    }));
}

export function getAdminAllowlistFromEnv(): string[] {
  const raw = process.env.ADMIN_ALLOWLIST ?? "";
  return raw
    .split(",")
    .map((s) => normalize(s))
    .filter((s) => s.length > 0);
}

export function getCombinedAdminAllowlist(): Set<string> {
  const cms = getAdminAllowlistFromCms().map((e) => e.email);
  const env = getAdminAllowlistFromEnv();
  return new Set([...cms, ...env]);
}

export function isEmailAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return getCombinedAdminAllowlist().has(normalize(email));
}

export function isAdminAllowlistEmpty(): boolean {
  return getCombinedAdminAllowlist().size === 0;
}
