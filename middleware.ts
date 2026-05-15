import { NextRequest, NextResponse } from "next/server";

// HTTP Basic Auth for /admin/devotionals and /api/admin/* routes.
// Intentionally does NOT match /admin/ or /admin/index.html — those are
// served by TinaCMS and have their own authentication.
//
// Uses atob() (not Buffer.from) because middleware runs in the Edge Runtime,
// which doesn't have Node.js built-ins like Buffer.

export const config = {
  matcher: ["/admin/devotionals/:path*", "/api/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    // If no password is set, block access rather than exposing unprotected admin.
    return new NextResponse("Admin access is not configured.", { status: 403 });
  }

  const authHeader = req.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Basic ")) {
    try {
      const decoded = atob(authHeader.slice(6));
      const colonIdx = decoded.indexOf(":");
      if (colonIdx !== -1) {
        const suppliedPassword = decoded.slice(colonIdx + 1);
        if (suppliedPassword === password) {
          return NextResponse.next();
        }
      }
    } catch {
      // malformed base64 — fall through to challenge
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Church Admin"',
    },
  });
}
