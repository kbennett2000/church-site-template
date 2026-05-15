import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { isEmailAdmin } from "@/content/admin-access";

// =============================================================================
// NEXTAUTH (AUTH.JS v5) CONFIG
// =============================================================================
// Only loaded when site.adminAuth.provider === "google". The Basic Auth
// path doesn't touch any of this.
//
// Strategy: JWT — no database session table. Keeps Postgres clean and means
// middleware can validate the session without a DB round-trip per request,
// which matters because middleware runs on every request to a protected
// route in the Edge runtime.
//
// Authorization model:
//   - signIn callback: allows ALL successful Google logins to proceed. We
//     don't block here so we can show a friendly access-denied page that
//     actually names the email the user signed in with.
//   - jwt callback: stamps `isAdmin` onto the token based on the allowlist
//     (CMS + ADMIN_ALLOWLIST env). Re-evaluated on each sign-in.
//   - session callback: exposes `session.user.isAdmin` to middleware and
//     server components.
//
// Middleware uses `session.user.isAdmin` to decide between "let them through",
// "redirect to sign-in", and "redirect to access-denied".
// =============================================================================

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}

type ExtendedJwt = {
  isAdmin?: boolean;
  email?: unknown;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  pages: {
    signIn: "/admin/sign-in",
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user }) {
      // On first sign-in `user` is defined; on subsequent requests only `token` is.
      // Refresh isAdmin on first sign-in so allowlist changes apply when the user
      // signs out and back in. (We could refresh on every request, but the
      // allowlist is bundled at build time anyway — see content/admin-access.ts.)
      const t = token as ExtendedJwt;
      if (user?.email) {
        t.isAdmin = isEmailAdmin(user.email);
      } else if (t.isAdmin === undefined && typeof t.email === "string") {
        t.isAdmin = isEmailAdmin(t.email);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.isAdmin = Boolean((token as ExtendedJwt).isAdmin);
      return session;
    },
  },
});
