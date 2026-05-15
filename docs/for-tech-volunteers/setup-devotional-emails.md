---
title: "Set Up Daily Devotional Emails"
type: how-to
---

# Set Up Daily Devotional Emails

This guide walks you through connecting a Postgres database, enabling the devotional feature, and verifying that your church's daily email subscription flow works end to end.

**Time required:** 20–30 minutes  
**Prerequisites:** You've already deployed the site to Vercel ([06-deploy-to-vercel.md](06-deploy-to-vercel.md)) and connected a domain.

---

## What gets set up

When you complete this guide, your site will have:

- A **Vercel Postgres database** storing email subscribers
- A **double opt-in sign-up flow** (email + verification link)
- **Manage preferences** and **unsubscribe** pages linked from every devotional email
- A **password-protected admin page** at `/admin/devotionals` showing subscriber stats and a CSV export

The actual daily email send is a separate step (cron job) documented in the devotional architecture guide.

---

## Step 1 — Add a Vercel Postgres database

1. Go to your Vercel project dashboard.
2. Click **Storage** in the top navigation.
3. Click **Create Database** and choose **Postgres**.
4. Give it any name (e.g., `church-site-db`), choose the region closest to your visitors, and click **Create**.
5. Once created, go to the **.env.local** tab. Copy the line that starts with `POSTGRES_URL=`.

---

## Step 2 — Set environment variables

In Vercel → your project → **Settings** → **Environment Variables**, add:

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | Your Postgres connection string | Paste the `POSTGRES_URL` value here — we use `DATABASE_URL` as the canonical name |
| `ADMIN_PASSWORD` | A strong password | Protects `/admin/devotionals`. Keep this secret. |

Redeploy after adding variables for them to take effect.

For local development, add the same variables to `.env.local` in the project root.

---

## Step 3 — Apply the database schema

From your project directory, run:

```bash
npm run db:setup
```

This checks that `DATABASE_URL` is set and then runs `drizzle-kit migrate` to apply the SQL migration files from `drizzle/migrations/` to your database. These files are included in the repo, so no generation step is needed on first install — just apply them.

To verify the tables were created:

```bash
npm run db:studio
```

This opens Drizzle Studio in your browser — a visual view of your database.

### Safe schema-change workflow

If you (or a future developer) ever need to change the database schema, **do not use `npm run db:push`** on a production database. `db:push` can DROP and recreate tables when it encounters a change it can't apply non-destructively, which destroys your subscriber data.

The safe workflow is:

```bash
# 1. Edit lib/db/schema.ts with your changes
# 2. Generate a SQL migration file — does NOT touch the database
npm run db:generate

# 3. Review the generated file in drizzle/migrations/
#    Confirm it contains only ALTER TABLE / CREATE INDEX etc., not DROP TABLE.

# 4. Commit the migration file to git

# 5. Apply it to the database
npm run db:migrate
```

`db:generate` creates a dated SQL file (e.g., `0001_add_subscriber_notes.sql`). Review it before running `db:migrate`. If you see `DROP TABLE` or `DROP COLUMN` in the generated SQL, stop — Drizzle detected a destructive change and the migration file will say so explicitly. Rename columns in schema instead of dropping-and-adding if you want to preserve data.

### What if I accidentally ran db:push and lost data?

Neon (the recommended Postgres provider) keeps 7 days of point-in-time recovery on the free tier.

1. Go to your Neon dashboard → your project → **Branches**.
2. Click **Restore** next to your main branch.
3. Choose the timestamp just before the accidental push.
4. Neon creates a new branch at that point in time — verify the data there before restoring.

Full instructions: https://neon.tech/docs/guides/branch-restore

---

## Step 4 — Enable the devotional feature

In the CMS (**Admin → Site Settings → Features**), toggle **Daily devotionals** on.

Or edit `content/site.json` directly:

```json
"features": {
  "devotionals": true
}
```

Commit and push — Vercel will rebuild and the `/devotionals` page will go live.

---

## Step 5 — Configure devotional email settings

In the CMS, go to **Admin → Devotional Email Settings** and fill in:

- **Sender name** — Your church name (e.g., "Grace Community Church")
- **Sender email** — A verified address from your Resend domain (e.g., `devotionals@gracecc.org`).
  **Important:** The `RESEND_FROM_EMAIL` environment variable overrides this CMS field in production.
  Set `RESEND_FROM_EMAIL=devotionals@yourchurch.org` in Vercel → Settings → Environment Variables.
  The CMS field is a human-readable reference only; the env var is what actually controls the sender.
- **Intro** / **Outro** — The opening and closing lines of every devotional email
- **Brand color** — Your primary hex color (used for buttons and headings in emails)
- **Footer text** — Your church name, address, and unsubscribe note

If you use SOAP-style reading plans, also fill in the SOAP-specific **intro** and **outro** overrides.

---

## Step 6 — Verify the subscribe flow

1. Visit `/devotionals` on your live site.
2. Enter your own email and click **Subscribe — it's free**.
3. Check your inbox for the verification email. Click the confirmation link.
4. You should land at `/devotionals/verify?status=success`.
5. Check `/admin/devotionals` (password protected) — your subscriber should appear with status **active**.

If the email doesn't arrive, check:
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are set in Vercel environment variables. (`CHURCH_EMAIL` is *not* required for devotionals — it's only used by the contact/prayer/visit form handlers.)
- The sender email domain is verified in your Resend dashboard.
- Check Resend's **Logs** for a bounce or block.

---

## Step 7 — Test manage and unsubscribe

From the welcome email you received, click **Manage my preferences**. You should be able to change your send time and plan selection.

Click **Unsubscribe** at the bottom of the manage page. You should land at `/devotionals/unsubscribe?status=success` and receive a confirmation email.

---

## Step 8 — Check doctor

```bash
npm run doctor
```

With `features.devotionals: true`, doctor now checks that `DATABASE_URL` is set and that migration files exist in `drizzle/migrations/`. All 12 checks should pass.

---

## Admin page

Visit `/admin/devotionals` (you'll be prompted for the admin password). This page shows:

- Total, active, pending, unsubscribed, and bounced counts
- Active subscribers per reading plan
- The 20 most recent sign-ups
- A **Export CSV** button that downloads all active subscribers

---

## Step 9 — Configure the cron job

The daily send runs via Vercel Cron, which fires the `/api/cron/devotionals` endpoint once per hour. The send function checks each subscriber's local timezone and preferred send hour, so one hourly trigger covers all time zones correctly.

**The cron schedule is already in `vercel.json`** in the repo root — no extra configuration needed in the Vercel dashboard. Vercel reads this file automatically on deploy.

You do need to set `CRON_SECRET` before the cron will actually run:

1. Generate a secret: `openssl rand -hex 32`
2. Add `CRON_SECRET=<generated-value>` in Vercel → Settings → Environment Variables.
3. Redeploy.

To verify the cron is wired up, go to Vercel → your project → **Cron Jobs** tab. You should see `/api/cron/devotionals` listed with an hourly schedule.

---

## Step 10 — Test the full send flow

Before your first subscribers get a real email, verify the send pipeline works end to end:

1. Make sure at least one reading plan is active and has an entry for today's date.
2. Subscribe yourself (see Step 6).
3. Go to **Admin → Devotionals → Send test email** and send a test to your address.
4. Check your inbox — the email should arrive within a minute or two.
5. Check Resend's **Logs** tab to confirm `delivered` status.

If you want to manually trigger the cron for testing:

```bash
curl -X GET https://yourchurch.org/api/cron/devotionals \
  -H "Authorization: Bearer <your-CRON_SECRET>"
```

The response is a JSON summary: `{ "sent": 1, "skipped": 0, "failed": 0, … }`.

---

## Step 11 — Set up the Resend webhook (recommended)

The Resend webhook at `/api/webhooks/resend` automatically:
- Marks subscribers as **bounced** when a hard bounce occurs (permanently invalid email)
- Marks subscribers as **unsubscribed** when they file a spam complaint

To enable:

1. In Resend → **Webhooks** → Add Endpoint: `https://yourchurch.org/api/webhooks/resend`
2. Select events: `email.bounced`, `email.complained`, `email.delivered` (optional)
3. Copy the **Signing Secret** (starts with `whsec_`)
4. Add `RESEND_WEBHOOK_SECRET=<signing-secret>` to Vercel environment variables.
5. Redeploy.

Without the webhook, bounces and complaints are not automatically handled — you'd need to clean your list manually via the CSV export.

---

## Admin page

Visit `/admin/devotionals` (you'll be prompted for the admin password). This page shows:

- Total, active, pending, unsubscribed, and bounced counts
- Active subscribers per reading plan
- The 20 most recent sign-ups
- Recent send run history (date, how many sent/skipped/failed)
- Links to: **Send test email**, **Backfill missed sends**, **Preview email templates**
- A **Export CSV** button that downloads all active subscribers

---

## Environment variables summary

See [environment-variables.md](environment-variables.md) for the full reference. The variables you need for devotionals:

| Variable | Required? |
|---|---|
| `DATABASE_URL` | Yes |
| `ADMIN_PASSWORD` | Yes |
| `CRON_SECRET` | Yes (cron won't run without it) |
| `RESEND_WEBHOOK_SECRET` | Recommended |
| `NEXT_PUBLIC_ESV_API_KEY` | Only if using ESV translation |
| `BIBLIA_API_KEY` | Only if using NIV/NLT/CSB/NKJV/NRSV |
