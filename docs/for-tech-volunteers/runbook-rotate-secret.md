---
type: how-to
audience: tech-volunteer
---

# Runbook — rotate a leaked secret

**When to open this:** a secret value (password, API key, token, database URL) has been exposed where unauthorized people could potentially see it. Common ways this happens:

- You committed `.env.local` to GitHub (even briefly).
- You pasted a secret into a chat (Slack, Discord, email).
- A screenshot caught a value you thought was masked.
- A laptop with the value saved was lost or stolen.
- A former volunteer who had access has left under bad circumstances.

The faster you rotate, the smaller the damage.

---

## Before you panic — but rotate fast

Rotating a single secret takes 5–15 minutes. The rotation is reversible if you mess up — the worst case is you redo it.

The worst thing you can do is freeze. Every minute the leaked value remains valid is more risk.

**Two things to know up front:**

1. **If you committed a secret to a public git repo**, assume it's already been scraped and indexed by automated bots within minutes. Deleting the commit doesn't help — the value is permanent in git history and possibly in clones held by people you can't reach. **You must rotate.** Deleting alone is insufficient.

2. **The order of operations matters.** For every secret:
   - **Generate the new value first.**
   - **Add it to Vercel** (or wherever the live system reads it).
   - **Trigger a redeploy.**
   - **Verify the new value works** on the live site.
   - **Only then** revoke or delete the old value.

   Never revoke the old value before the new one is live and proven — that takes the site down for the time between revoke and successful redeploy.

---

## Quick triage — which secret leaked?

| Leaked value | Section to use |
|---|---|
| `RESEND_API_KEY` | [Resend API key](#resend_api_key) |
| `ADMIN_PASSWORD` | [Admin password](#admin_password) |
| `NEXTAUTH_SECRET` (or `AUTH_SECRET`) | [NextAuth secret](#nextauth_secret) |
| `CRON_SECRET` | [Cron secret](#cron_secret) |
| `TINA_TOKEN` | [TinaCloud token](#tina_token) |
| `GOOGLE_CLIENT_SECRET` | [Google OAuth client secret](#google_client_secret) |
| `DATABASE_URL` / `POSTGRES_URL` | [Database connection string](#database_url) |
| Not listed / not sure | Treat it as a secret and rotate the closest match. The cost of a wasted rotation is small; the cost of a real leak is unbounded. |

After rotating, jump to the **[After every rotation](#after-every-rotation)** section at the bottom.

---

## RESEND_API_KEY {#resend_api_key}

**Risk if leaked:** an attacker can send email from your domain (impersonation, phishing) and burn your Resend sending quota.

1. **Open** [resend.com](https://resend.com) → **API Keys**.
2. **Click** **Create API Key**. Name it descriptively — something like `vercel-prod-rotated-YYYY-MM-DD`.
3. **Copy** the new key immediately. Resend shows it only once.
4. **Open** Vercel → your project → Settings → Environment Variables.
5. **Find** `RESEND_API_KEY`, click **Edit**, paste the new value, **Save**. Confirm it's set for all three environments (Production, Preview, Development).
6. **Trigger** a redeploy: Deployments → latest → **⋯** → **Redeploy** (uncheck "Use existing Build Cache").
7. **Wait** for the redeploy to finish (~2–3 minutes).
8. **Verify**: submit a contact form (or run a devotional test send from `/admin/devotionals`). Confirm the email arrives.
9. **Back in Resend** → API Keys, find the **old** key and **delete** it (or click into it and choose to revoke).

---

## ADMIN_PASSWORD {#admin_password}

**Risk if leaked:** anyone with the password can sign in to `/admin/devotionals` and `/admin/digest` and read subscriber lists, send test emails, or trigger admin actions.

1. **Generate** a new strong password: `openssl rand -base64 32` (or your password manager's generator).
2. **Open** Vercel → Settings → Environment Variables.
3. **Edit** `ADMIN_PASSWORD`, paste the new value, **Save**.
4. **Trigger** a redeploy without build cache.
5. **Wait** for redeploy to finish.
6. **Verify**: visit `/admin/devotionals`. The browser will prompt for credentials. Sign in with username `admin` (anything works for the username — the password is what's checked) and the new password. Confirm you land on the admin page.
7. **Notify** every other admin who used the old password and share the new one out-of-band (a secure channel like a password manager share, not the channel that just leaked).

No "delete the old password" step exists — once the env var is replaced and redeployed, the old value simply stops working.

---

## NEXTAUTH_SECRET {#nextauth_secret}

**Risk if leaked:** an attacker can forge admin session tokens and access protected admin pages without signing in.

> ⚠️ **This rotation signs everyone out.** Every admin currently signed in will need to sign in again. Don't do this during a busy time without warning the other admins first.

1. **Generate** a new secret: `openssl rand -base64 32`.
2. **Open** Vercel → Settings → Environment Variables.
3. **Edit** `NEXTAUTH_SECRET` (or `AUTH_SECRET` if that's what your project uses), paste the new value, **Save**.
4. **Trigger** a redeploy without build cache.
5. **Wait** for redeploy to finish.
6. **Verify**: visit `/admin/digest` (or whichever Google-auth-protected admin page you have). You'll be redirected to sign in — that's expected; the old session was invalidated. Sign in with your Google account and confirm you land on the page.
7. **Tell** the other admins they need to sign in again.

No separate "revoke old secret" step — the new secret immediately invalidates every JWT signed with the old one.

---

## CRON_SECRET {#cron_secret}

**Risk if leaked:** an attacker can hit `/api/cron/devotionals` or `/api/cron/digest` repeatedly, triggering unwanted sends or burning your Resend quota.

1. **Generate** a new secret: `openssl rand -hex 32`.
2. **Open** Vercel → Settings → Environment Variables.
3. **Edit** `CRON_SECRET`, paste the new value, **Save**.
4. **Trigger** a redeploy without build cache.
5. **Wait** for redeploy to finish.
6. **Verify**: open Vercel → Cron Jobs (or Crons) and watch for the next hourly fire. The next invocation should succeed (200 response). If you don't want to wait an hour, manually invoke the cron with the new secret:

   ```bash
   curl -X GET \
     -H "Authorization: Bearer <new-CRON_SECRET>" \
     https://yourchurch.org/api/cron/devotionals
   ```

   It should return a JSON summary, not 401.
7. **If you have any external system or script** that hits the cron route manually, update it with the new secret.

Vercel's own cron uses the env var automatically once redeployed — no further action needed on Vercel's side.

---

## TINA_TOKEN {#tina_token}

**Risk if leaked:** an attacker with the read-only token can read your CMS content via TinaCloud's API. (They can't write — the read-only scope prevents that.)

1. **Open** [app.tina.io](https://app.tina.io) → your project → **Tokens** (or **API Keys** depending on TinaCloud's current UI).
2. **Create** a new read-only token. **Don't delete the old one yet.**
3. **Copy** the new value (shown only once).
4. **Open** Vercel → Settings → Environment Variables.
5. **Edit** `TINA_TOKEN`, paste the new value, **Save**.
6. **Trigger** a redeploy without build cache.
7. **Wait** for redeploy to finish.
8. **Verify**: visit `/admin/` on your live site, sign in, confirm the CMS loads and shows content.
9. **Back in TinaCloud** → Tokens, find the **old** token and **delete** it.

---

## GOOGLE_CLIENT_SECRET {#google_client_secret}

**Risk if leaked:** an attacker can complete Google's OAuth handshake on your behalf and potentially impersonate your application during sign-in.

1. **Open** [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services** → **Credentials**.
2. **Click** your OAuth 2.0 Client ID for the church site.
3. **Click** **Reset Secret** (or **Add Secret** if Google's UI offers add-then-revoke; the exact button name varies).
4. **Copy** the new secret immediately.
5. **Open** Vercel → Settings → Environment Variables.
6. **Edit** `GOOGLE_CLIENT_SECRET`, paste the new value, **Save**.
7. **Trigger** a redeploy without build cache.
8. **Wait** for redeploy to finish.
9. **Verify**: sign out of `/admin/` (the Google-auth protected pages, not TinaCloud's `/admin/`), then sign back in. The OAuth flow should complete normally.
10. **Back in Google Cloud Console**, confirm the old secret is now revoked or disabled.

---

## DATABASE_URL {#database_url}

**Risk if leaked:** an attacker has direct read/write access to your Postgres database — every subscriber email address, every send log, everything.

This is the highest-impact rotation. You can't simply "rotate" a database password the way you can an API key; you have to reset the password on the database user itself.

1. **Open** your database provider's dashboard:
   - **Neon:** dashboard → your project → **Roles** (or **Users**) → find the role used in your connection string.
   - **Vercel Postgres:** dashboard → Storage → your database → **.env.local** tab (it'll show how to regenerate credentials).
   - **Other Postgres providers:** find the role/user management section.
2. **Reset the password** for that role. The provider gives you a new connection string with the new password embedded.
3. **Copy** the new connection string.
4. **Open** Vercel → Settings → Environment Variables.
5. **Edit** `DATABASE_URL`, paste the new connection string, **Save**. If you also have `POSTGRES_URL` set (Vercel Postgres auto-sets it), edit that too with the same value.
6. **Trigger** a redeploy without build cache.
7. **Wait** for redeploy to finish.
8. **Verify**: visit `/admin/devotionals`. The subscriber stats should load. If they do, the new connection is working.
9. **Subscribe a test email address** through `/devotionals` (or your test page) to confirm writes work.

The old password is automatically invalidated by the reset on the database side — no separate "revoke old" step.

> **If you have a Neon database**, check whether the reset created a new branch or modified the main one. Neon's branch model means an old branch can still exist with the previous password — review and delete unused branches after rotation.

---

## After every rotation {#after-every-rotation}

Whichever secret you rotated, do these three things after:

### 1. Look for damage

Check audit logs for unauthorized access during the leak window:

- **Vercel Logs:** filter to the relevant API route (e.g., `/api/cron/*` if `CRON_SECRET` leaked, `/api/admin/*` if `ADMIN_PASSWORD` leaked). Look for unusual request patterns — high volume, unfamiliar IPs, requests at odd hours.
- **Resend Logs:** look for sends you didn't trigger, especially to addresses outside your subscriber list.
- **Database (if `DATABASE_URL` leaked):** check the `subscribers` table for rows you didn't create, and the `devotional_send_log` / `digest_send_log` for unexpected entries.

If you find evidence of unauthorized access, you may need to notify affected subscribers (legal requirements vary by jurisdiction — consult someone if you're unsure).

### 2. Find the leak source

A rotation only helps if you also close the hole that exposed the secret in the first place.

- **Committed to git?** Even if you delete the commit, the value is in git history. Confirm the rotation, then `git push --force` after rewriting history (or accept the value is permanent in history and rely solely on the rotation).
- **Pasted in chat?** Delete the message. If it was a public channel, assume bots have indexed it.
- **In a screenshot?** Delete the screenshot from wherever it was shared.
- **Former volunteer?** Audit what else they had access to — Vercel team membership, TinaCloud users, GitHub collaborators, domain registrar accounts. Remove their access from all of them.

### 3. Update your records

If you maintain a password manager entry, an internal handoff doc, or a `.env.local.example` template — update them to reference the new value (or the fact that the secret was rotated on this date).

---

## Cascading rotations

For some high-impact leaks, rotating the leaked secret isn't enough — you should also rotate values that *depend* on the leaked one:

| If this leaked | Also consider rotating | Reason |
|---|---|---|
| `DATABASE_URL` | Nothing additional — the data was the target. But check whether subscriber email addresses were exposed and consider whether subscribers need to be notified. | — |
| `NEXTAUTH_SECRET` | All admin passwords (if any are stored in CMS-managed env vars) | An attacker with this secret could forge any admin session — assume any admin's perspective was potentially compromised. |
| `ADMIN_PASSWORD` | If this was the *only* password admins used (no Google sign-in), and you suspect anyone outside the volunteer pool saw it, also rotate `CRON_SECRET` since admin pages can manually trigger crons. | Defense in depth. |
| `GOOGLE_CLIENT_SECRET` | Nothing additional, but check Google Cloud Console's OAuth consent screen audit log for unfamiliar logins. | — |

---

## When in doubt, rotate

If you can't decide whether a value counts as a secret, treat it as one and rotate. The cost of a wasted rotation is 15 minutes. The cost of a real leak you didn't act on can be:

- A bad actor sending phishing emails from your domain.
- Subscriber data being scraped.
- Your Resend / Vercel account being throttled or blocked.
- Worst case: legal exposure if subscriber PII is leaked and your jurisdiction has notification requirements.

The rotation procedures above are the same whether the leak is real or only suspected. There's no penalty for being cautious.

---

## Still stuck?

If a rotation procedure isn't working — the new value isn't being accepted, the redeploy fails, the verify step still shows the old value:

1. **Confirm** the variable name in Vercel matches *exactly* what the code expects (case-sensitive, no extra spaces).
2. **Confirm** all three environments (Production, Preview, Development) have the new value.
3. **Force** a fresh redeploy with build cache disabled — sometimes Vercel's build cache holds stale env values.
4. **Capture** the Vercel deployment log and any runtime errors.
5. **Open** an issue at [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues) with the deployment log.

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Runbook%20Rotate%20Secret).*
