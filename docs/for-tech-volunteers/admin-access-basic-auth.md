---
type: how-to
audience: tech-volunteer
---

# Admin access — shared password (Basic Auth)

This is the simplest way to protect the custom admin pages
(`/admin/devotionals`, `/admin/digest`, and the admin API routes). One
shared password, one environment variable, no third-party setup. Pick
this when:

- You have one or two people who need admin access and they're fine sharing a password.
- You don't want to set up a Google Cloud project.
- You want to be done with auth in ten minutes.

If you'd rather give each person their own Google sign-in, see
[Admin access — Google sign-in](./admin-access-google-oauth.md).

> **Note on TinaCMS:** This setup does **not** protect the TinaCMS editor
> at `/admin/`. The CMS has its own login, configured by adding people as
> collaborators in your TinaCloud project at <https://app.tina.io>. The
> page you're reading covers only the *custom* admin pages.

---

## 1. Make sure the provider is set to "basic"

Open `content/site.json` and confirm:

```json
"adminAuth": {
  "provider": "basic"
}
```

This is the default for new installs, so usually there's nothing to change.
You can also set it from the CMS at **Site Settings → Admin Authentication
→ Sign-in method → Shared password (HTTP Basic Auth)**.

## 2. Pick a strong password

Use a long, random string. On macOS/Linux:

```bash
openssl rand -base64 32
```

On Windows (PowerShell):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Min 0 -Max 256 }))
```

Save it in your password manager.

## 3. Set the env var locally

In `.env.local`:

```
ADMIN_PASSWORD=paste-the-string-here
```

Restart the dev server (`npm run cms` or `npm run dev`).

## 4. Set the env var in production

In Vercel → your project → **Settings → Environment Variables**:

| Name | Value | Environments |
|------|-------|--------------|
| `ADMIN_PASSWORD` | the same string | Production, Preview, Development |

Redeploy after saving.

## 5. Verify it works

Visit `https://your-domain/admin/devotionals`. Your browser should show a
basic auth dialog. The **username can be anything** (the middleware only
checks the password) — leave it blank or type "admin". Paste your
password.

Run the diagnostic to confirm the env var is detected:

```bash
npm run doctor
```

You should see `Admin authentication configured ✓ basic (ADMIN_PASSWORD set)`.

---

## How it works

`middleware.ts` matches `/admin/devotionals/*`, `/admin/digest/*`, and
`/api/admin/*`. When `adminAuth.provider === "basic"`, it:

1. Reads `ADMIN_PASSWORD` from the environment.
2. Looks for an `Authorization: Basic …` request header.
3. Decodes the base64 username:password pair (we only check the password).
4. Compares it to `ADMIN_PASSWORD` using a constant-time comparison so an attacker can't measure response times to guess characters.
5. Returns `WWW-Authenticate: Basic` if anything is missing or wrong, which is what triggers the browser's password prompt.

There's also a small in-memory rate limiter: after 10 failed attempts from
the same IP within 10 minutes, the route returns `429 Too Many Requests`
for a cooling-off period. This only protects against simple brute-force
attempts from a single source; for production-grade protection across
multiple Vercel instances, see "Hardening for production" below.

---

## Trade-offs

- **One shared credential.** Everyone with admin access uses the same password. If a volunteer leaves, you have to rotate the password and tell everyone else the new one.
- **Browser-cached.** Once a browser has signed in, it caches the credentials until you close it. There's no "sign out" button — you close the tab.
- **No audit trail.** You can't tell who did what; only that *somebody* with the password did it.
- **Sufficient for many small churches.** If the only admin tasks are "send the weekly digest" and "occasionally export the subscriber list," the operational simplicity is usually worth more than these trade-offs.

When the trade-offs start to bite, switch to
[Google sign-in](./admin-access-google-oauth.md).

---

## Rotating the password

1. Generate a new password (`openssl rand -base64 32`).
2. Update `ADMIN_PASSWORD` in Vercel and `.env.local`.
3. Redeploy.
4. Share the new password through your password manager (1Password, Bitwarden, etc.) — not Slack/email.
5. Close any browsers that have the old password cached.

---

## Hardening for production

The defaults are reasonable for a small church, but if you want to do more:

- **Add a real rate limiter.** The in-memory one resets when a Vercel instance cold-starts and doesn't share state across regions. Swap in `@upstash/ratelimit` with an Upstash Redis URL if you have one available. The current implementation in `middleware.ts` is gated by IP and intentionally simple.
- **Restrict by IP.** If your admin work happens from one office, you can add an IP allowlist check in middleware before the password check.
- **Switch to Google sign-in.** Per-person accounts solve all of the above by design.

---

## Troubleshooting

**"Admin access is not configured"** (HTTP 503). The site was deployed
without `ADMIN_PASSWORD`. Set it and redeploy.

**Browser keeps re-prompting.** You're typing the wrong password (the
username doesn't matter). After enough wrong tries you'll see `429 Too
Many Requests`; wait ten minutes.

**Want to revoke a specific user.** You can't with Basic Auth — you have
to rotate the password and re-share it to everyone else. This is the
single biggest reason to use Google sign-in instead.
