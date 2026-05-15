import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/content/site";
import { auth as nextAuth } from "@/auth";

// =============================================================================
// ADMIN AUTH MIDDLEWARE
// =============================================================================
// Protects /admin/devotionals, /admin/digest, and /api/admin/*.
// Intentionally does NOT match /admin/ or /admin/index.html — those are
// served by TinaCMS and have their own authentication.
//
// Branches on site.adminAuth.provider:
//   - "basic"  → HTTP Basic Auth with ADMIN_PASSWORD (timing-safe compare,
//                in-memory IP rate limiting on failures).
//   - "google" → NextAuth (Auth.js) session check, additionally requiring
//                session.user.isAdmin which the jwt callback sets from the
//                allowlist.
//
// Sign-in/access-denied paths are explicitly excluded from the matcher so
// the user can reach them while unauthenticated.
//
// Runs in the Edge runtime — no Node built-ins (no Buffer, no crypto.*
// from node:crypto), no filesystem.
// =============================================================================

export const config = {
  matcher: [
    "/admin/devotionals/:path*",
    "/admin/digest/:path*",
    "/api/admin/:path*",
  ],
};

// In-memory rate limiter for the Basic Auth failure path.
// Lives in module scope, so it survives across requests within a single
// edge instance but resets on cold-starts and doesn't share across
// instances. Good enough as a per-instance speed bump against brute-force.
// For production-grade rate limiting, swap in @upstash/ratelimit gated on
// a REDIS / KV URL — see the security follow-ups in the auth docs.
const BASIC_AUTH_WINDOW_MS = 10 * 60 * 1000; // 10 min
const BASIC_AUTH_MAX_FAILURES = 10;
const failureLog: Map<string, number[]> = new Map();

function getClientKey(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function recordFailure(key: string): number {
  const now = Date.now();
  const window = now - BASIC_AUTH_WINDOW_MS;
  const previous = (failureLog.get(key) ?? []).filter((ts) => ts > window);
  previous.push(now);
  failureLog.set(key, previous);
  return previous.length;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const window = now - BASIC_AUTH_WINDOW_MS;
  const previous = (failureLog.get(key) ?? []).filter((ts) => ts > window);
  if (previous.length !== (failureLog.get(key)?.length ?? 0)) {
    failureLog.set(key, previous);
  }
  return previous.length >= BASIC_AUTH_MAX_FAILURES;
}

// Constant-time string comparison. crypto.timingSafeEqual isn't available
// in the Edge runtime, so we roll a small constant-time compare here.
// Always iterates over the larger of the two lengths to avoid leaking
// length differences via timing.
function timingSafeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function unauthorizedBasic(reason = "Unauthorized"): NextResponse {
  return new NextResponse(reason, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Church Admin"',
    },
  });
}

function handleBasicAuth(req: NextRequest): NextResponse {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return new NextResponse(
      "Admin access is not configured. Set ADMIN_PASSWORD in your environment, or switch Site Settings → Admin Authentication to Google sign-in.",
      { status: 503 }
    );
  }

  const key = getClientKey(req);
  if (isRateLimited(key)) {
    return new NextResponse(
      "Too many failed sign-in attempts. Try again in a few minutes.",
      { status: 429, headers: { "Retry-After": "600" } }
    );
  }

  const authHeader = req.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Basic ")) {
    try {
      const decoded = atob(authHeader.slice(6));
      const colonIdx = decoded.indexOf(":");
      if (colonIdx !== -1) {
        const suppliedPassword = decoded.slice(colonIdx + 1);
        if (timingSafeEqual(suppliedPassword, password)) {
          return NextResponse.next();
        }
      }
    } catch {
      // malformed base64 — fall through to challenge + failure count
    }
    recordFailure(key);
  }

  return unauthorizedBasic();
}

async function handleGoogleAuth(req: NextRequest): Promise<NextResponse> {
  const session = await nextAuth();
  const isApiRoute = req.nextUrl.pathname.startsWith("/api/");

  if (!session?.user) {
    if (isApiRoute) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const url = new URL("/admin/sign-in", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (!session.user.isAdmin) {
    if (isApiRoute) {
      return new NextResponse("Forbidden — not on admin allowlist", { status: 403 });
    }
    return NextResponse.redirect(new URL("/admin/access-denied", req.url));
  }

  return NextResponse.next();
}

export async function middleware(req: NextRequest) {
  if (adminAuth.provider === "google") {
    return handleGoogleAuth(req);
  }
  return handleBasicAuth(req);
}
