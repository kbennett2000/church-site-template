---
title: "Environment Variables Reference"
type: reference
---

# Environment Variables Reference

All environment variables are set in two places:

- **Local development:** `.env.local` in the project root (gitignored)
- **Production (Vercel):** Project → Settings → Environment Variables

After adding or changing variables in Vercel, trigger a redeploy for them to take effect.

---

## Required for any deployment

| Variable | Description | Where to get it |
|---|---|---|
| `RESEND_API_KEY` | Resend API key for sending transactional emails | Resend dashboard → API Keys |
| `RESEND_FROM_EMAIL` | Default "From" address for contact/visit/prayer forms | A verified domain in your Resend account |
| `CHURCH_EMAIL` | Where form submissions are delivered | Your staff inbox |

---

## Required when devotionals are enabled

Set `features.devotionals: true` in `content/site.json` or via the CMS first, then add these:

| Variable | Description | Where to get it |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | Vercel → Storage → your database → .env.local tab |
| `ADMIN_PASSWORD` | Password for `/admin/devotionals` (HTTP Basic Auth) | Choose a strong password; share only with staff |
| `CRON_SECRET` | Bearer token that authenticates the hourly cron job | Generate with: `openssl rand -hex 32` |

**`POSTGRES_URL`** — Vercel auto-sets this when you create a Postgres database. The code also accepts `DATABASE_URL`, which takes precedence. Either name works; `DATABASE_URL` is the canonical name in this project.

---

## Optional — licensed Bible translations

The default scripture provider (bible-api.com) serves KJV, ASV, WEB, and BBE without any key. If you want a licensed translation, add the appropriate key:

| Variable | Translation | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_ESV_API_KEY` | ESV | [api.esv.org](https://api.esv.org/) — free for non-commercial use |
| `BIBLIA_API_KEY` | NIV, NLT, CSB, NKJV, NRSV | [biblia.com/api](https://biblia.com/api) — licensing varies by translation |

---

## Optional — enhanced webhook security

| Variable | Description | Where to get it |
|---|---|---|
| `RESEND_WEBHOOK_SECRET` | Signs Resend webhook payloads so you can verify them | Resend dashboard → Webhooks → Signing Secret |

Without this variable, the webhook handler at `/api/webhooks/resend` accepts all payloads (fine for development; set it in production). With it, any payload with an invalid signature is rejected.

---

## Build-time only

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_TINA_CLIENT_ID` | TinaCMS client ID — required for `npm run build` (full build with CMS) |
| `TINA_TOKEN` | TinaCMS token — required for `npm run build` |

`npx next build` (Next.js only, no TinaCMS step) works without these. Use it for local verification.

---

## `.env.local` template

Copy this into `.env.local` and fill in the values:

```bash
# Email (required for all form submissions)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@yourchurch.org
CHURCH_EMAIL=staff@yourchurch.org

# Database (required if features.devotionals = true)
DATABASE_URL=postgres://...

# Devotional admin and cron
ADMIN_PASSWORD=choose-a-strong-password
CRON_SECRET=generate-with-openssl-rand-hex-32

# Optional: licensed Bible translations
# NEXT_PUBLIC_ESV_API_KEY=your-esv-key
# BIBLIA_API_KEY=your-biblia-key

# Optional: Resend webhook security
# RESEND_WEBHOOK_SECRET=whsec_...

# TinaCMS (required for npm run build, not for npx next build)
# NEXT_PUBLIC_TINA_CLIENT_ID=your-tina-client-id
# TINA_TOKEN=your-tina-token
```

---

## Verifying your configuration

```bash
npm run doctor
```

Doctor checks:
1. Whether `DATABASE_URL` is set (only required when `features.devotionals` is true)
2. All npm scripts are present
3. Content directories exist

To verify email delivery, use the test-send feature at `/admin/devotionals/test` after deploying.
