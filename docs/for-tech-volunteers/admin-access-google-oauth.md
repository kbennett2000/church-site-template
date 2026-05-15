---
type: how-to
audience: tech-volunteer
---

# Admin access — Google sign-in

This gives each volunteer their own Google sign-in for the custom admin
pages (`/admin/devotionals`, `/admin/digest`, and the admin API routes).
Pick this when:

- You have more than one or two people who need admin access.
- You want a clean "add/remove this person" workflow when volunteers change.
- You want an audit trail of who's signing in.
- You're already using Google Workspace for the church and would rather not maintain another password.

If a single shared password is fine, the simpler
[shared-password setup](./admin-access-basic-auth.md) takes ten minutes.

> **Note on TinaCMS:** This setup does **not** affect the TinaCMS editor
> at `/admin/`. The CMS has its own login configured at
> <https://app.tina.io>. The page you're reading covers only the *custom*
> admin pages.

> **Note on TinaCloud Google login vs. this one:** TinaCloud also offers
> Google sign-in, but only for editors inside the CMS. The Google sign-in
> on this page is a *separate* mechanism for the custom admin pages. They
> happen to both use Google, but they're independent — adding someone to
> the TinaCloud collaborator list does not give them access to the custom
> admin pages, and vice versa.

---

## Overview of the flow you're about to set up

```
Volunteer goes to /admin/digest
         ↓
Middleware sees no NextAuth session
         ↓
Redirects to /admin/sign-in
         ↓
Volunteer clicks "Sign in with Google"
         ↓
Google asks them to consent, returns to /api/auth/callback/google
         ↓
NextAuth creates a session JWT
         ↓
Middleware reads the JWT → checks isAdmin claim → allows or redirects
         ↓
If on allowlist → /admin/digest renders
If not → /admin/access-denied (friendly page; tells them the email and offers sign-out)
```

The allowlist is the only authorization step. Anyone can *try* to sign
in; only people on the allowlist actually get in.

---

## 1. Create a Google Cloud OAuth client

1. Go to <https://console.cloud.google.com/>.
2. Create a new project (top bar, project picker → "New Project"). Name it something like *"`Church Name` Admin Sign-in"*.
3. Inside the project, open **APIs & Services → OAuth consent screen**.
4. **User type:** "External" (unless your church is on Google Workspace and you only want Workspace users to be able to sign in — then choose "Internal" and skip the publish step).
5. Fill in:
   - App name: your church name.
   - User support email: a church inbox.
   - App logo (optional): your church logo.
   - App domain: your site's URL.
   - Developer contact email: the tech volunteer's email.
6. Scopes: leave defaults; we only need `userinfo.email` and `userinfo.profile`, which are already requested by NextAuth.
7. Test users (only for External, while still in testing): add the volunteers' emails. Until you publish the consent screen, only listed test users can sign in. When you're ready, click **"Publish App"** to take it out of testing — Google requires a verification step only if you request sensitive scopes, which we don't.

Next, create the OAuth client:

1. **APIs & Services → Credentials → + Create Credentials → OAuth client ID**.
2. **Application type:** "Web application".
3. **Authorized JavaScript origins:**
   - `http://localhost:3000` (for local dev)
   - `https://your-production-domain` (the real site URL)
4. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-production-domain/api/auth/callback/google`
5. Click Create. Google shows you a **Client ID** and **Client Secret**. Copy both — you'll need them in step 3.

## 2. Generate a session secret

NextAuth uses this to sign the session JWTs.

```bash
openssl rand -base64 32
```

Save the output — it's the `NEXTAUTH_SECRET`.

## 3. Set environment variables (local)

In `.env.local`:

```
GOOGLE_CLIENT_ID=…from Google Cloud Console…
GOOGLE_CLIENT_SECRET=…from Google Cloud Console…
NEXTAUTH_SECRET=…from openssl rand…
NEXTAUTH_URL=http://localhost:3000

# Bootstrap — see step 6
ADMIN_ALLOWLIST=your-google-email@gmail.com
```

Restart `npm run cms`.

## 4. Set environment variables (Vercel)

In Vercel → your project → **Settings → Environment Variables**:

| Name | Value | Environments |
|------|-------|--------------|
| `GOOGLE_CLIENT_ID` | from Google Cloud | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud | Production, Preview, Development |
| `NEXTAUTH_SECRET` | random 32-byte string | Production, Preview, Development |
| `NEXTAUTH_URL` | your production URL (e.g. `https://yourchurch.org`) | Production |
| `ADMIN_ALLOWLIST` | your email (bootstrap only — see step 6) | Production |

Redeploy after saving.

## 5. Switch the provider to Google

Either:

- **Via the CMS:** Site Settings → Admin Authentication → Sign-in method → "Google sign-in (per-person)".
- **By hand:** Edit `content/site.json` and change `adminAuth.provider` to `"google"`.

The site needs to rebuild for the change to take effect; TinaCMS handles
this automatically when the JSON is committed, or you can redeploy.

## 6. Bootstrap — sign in for the first time

The CMS allowlist starts empty. If you don't bootstrap, NOBODY will be
able to sign in. That's why step 4 includes `ADMIN_ALLOWLIST=your-email`.

1. Visit `https://your-domain/admin/digest` (or any custom admin page).
2. You'll be redirected to `/admin/sign-in`.
3. Click **Sign in with Google**, choose your account, consent.
4. You should land on the admin page.
5. Go to the CMS (`/admin/`) → **Admin Access** → add your own email there.
6. Add any other volunteers who need access.
7. **Remove `ADMIN_ALLOWLIST` from Vercel** and redeploy. The CMS list is now authoritative.

You don't strictly *have* to remove `ADMIN_ALLOWLIST` — both sources are
combined — but leaving it set means changes go through two places, which
is harder to keep straight over time.

## 7. Verify

```bash
npm run doctor
```

You should see `Admin authentication configured ✓ google (N emails on allowlist)`.

Try signing in as a different Google account that *isn't* on the
allowlist. You should land on the friendly access-denied page that shows
the email you signed in as.

---

## Day-to-day administration

### Adding a new admin

1. Go to `/admin/` → **Admin Access**.
2. Add a new entry with the person's exact Google email, role `admin`, and the date.
3. Save. TinaCMS commits the change to git; Vercel redeploys; the new admin can sign in.

### Removing an admin

1. Same place — delete their entry.
2. Save. They'll be redirected to access-denied on their next request. (Existing sessions remain valid until they expire after 30 days; to revoke immediately, also bump `NEXTAUTH_SECRET` — this invalidates ALL existing sessions, so warn other admins first.)

### Switching back to shared password

1. Site Settings → Admin Authentication → "Shared password".
2. Make sure `ADMIN_PASSWORD` is set in Vercel.
3. The Google env vars (`GOOGLE_CLIENT_ID`, etc.) can stay set — they're ignored when provider is `basic`.

---

## Troubleshooting

**"redirect_uri_mismatch" from Google.** The URI Google saw doesn't match
one of the Authorized redirect URIs in your OAuth client config. The URI
will be in the error page Google shows you. Copy it exactly into Google
Cloud Console → Credentials → your OAuth client → Authorized redirect
URIs. (The path is always `/api/auth/callback/google` — the difference is
almost always the protocol or host.)

**"This app isn't verified" Google scary screen.** Expected while your
consent screen is in "Testing" mode. Either click "Advanced → Go to
\<app\> (unsafe)" each time, or publish the consent screen. For the
limited scopes we use (email + profile), Google doesn't require
verification when published — the scary screen is just for Testing mode.

**Friendly access-denied page when you shouldn't be denied.** The email
on the allowlist must match exactly what Google has on file. If you have
multiple Google accounts in the same browser, the chooser sometimes picks
the wrong one. Sign out, sign back in, and watch which email Google says
it's signing in with. Case is normalized, but extra spaces or typos
aren't.

**Sign-in works locally but fails on production.** Most common cause:
`NEXTAUTH_URL` is missing or wrong on Vercel. Set it to the production
URL exactly (no trailing slash). Also confirm the production callback URI
is in Google's "Authorized redirect URIs".

**"Configuration error" from NextAuth.** Usually `NEXTAUTH_SECRET` is
missing. Set it and redeploy.

**You bumped `NEXTAUTH_SECRET` and everyone is signed out.** Expected —
that's how you force-revoke all sessions. Sign in again.

---

## What this protects, and what it doesn't

**Protected:**

- `/admin/devotionals` and any sub-routes
- `/admin/digest` and any sub-routes
- Every API route under `/api/admin/*`

**Not protected by this setup:**

- TinaCMS at `/admin/` itself — its collaborator list at <https://app.tina.io> controls who can edit content.
- The cron endpoints under `/api/cron/*` — those are protected separately by `CRON_SECRET`.
- Public-facing pages.

---

## Known limitation: stale JWT after allowlist change

When you add a new admin to `content/admin-access.json` (via the CMS) or
to `ADMIN_ALLOWLIST`, that admin's `isAdmin` claim is **not re-evaluated
automatically** on subsequent requests. The JWT issued at their previous
sign-in carries `isAdmin: false` until either:

- they sign out and sign back in (forces a fresh JWT), or
- the JWT expires on its 30-day max age.

This bites most often when a new volunteer tries to sign in *before*
their email has been added to the allowlist — they get denied, the JWT
is cached with `isAdmin: false`, and adding them later doesn't unstick
them on its own.

**Why this is the default.** Auth.js v5 in JWT-strategy mode treats the
`jwt` callback as a passthrough on every request after the first; only
the initial sign-in (or a forced re-issue) runs the
"is-this-email-on-the-allowlist" check. This avoids hitting the
allowlist source on every protected request, which would otherwise add
latency to every page load.

**Workaround.** Tell new admins: if you see "Access Denied" after being
added, sign out (button on the access-denied page) and sign back in. The
editor doc [managing-admin-access.md](../for-editors/managing-admin-access.md#common-issue-a-new-admin-still-cant-sign-in)
surfaces this for non-technical users.

**Plans to fix it.** Tracked in
[admin-access-followups.md](../for-developers/admin-access-followups.md).
The intended fix is to re-evaluate `isAdmin` on every JWT callback (the
allowlist read is cheap — a bundled JSON file and one env var).

---

## Security follow-ups for later

These aren't blockers, but worth knowing about for production:

- The in-memory rate limit on the Basic Auth path doesn't apply to the Google sign-in path. Google itself rate-limits the OAuth callback, which is the place an attacker would actually hammer; the local sign-in page is just a form that redirects to Google.
- Session JWTs are signed but not encrypted. Don't store sensitive personal data in the session — we only store `email`, `name`, and the `isAdmin` boolean.
- If you ever add admin actions that should require re-authentication (large-blast-radius operations, e.g. deleting all subscribers), check the session age and force a re-sign-in if it's older than X minutes.
