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

This checks that `DATABASE_URL` is set and then runs `drizzle-kit push` to create the `subscribers` and `subscriber_plans` tables. You only need to do this once (or after schema changes).

To verify the tables were created:

```bash
npm run db:studio
```

This opens Drizzle Studio in your browser — a visual view of your database.

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
- **Sender email** — A verified address from your Resend domain (e.g., `devotionals@gracecc.org`)
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
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CHURCH_EMAIL` are set in Vercel environment variables.
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

With `features.devotionals: true`, doctor now checks that `DATABASE_URL` is set. All 11 checks should pass.

---

## Admin page

Visit `/admin/devotionals` (you'll be prompted for the admin password). This page shows:

- Total, active, pending, unsubscribed, and bounced counts
- Active subscribers per reading plan
- The 20 most recent sign-ups
- A **Export CSV** button that downloads all active subscribers

---

## What's not set up yet

The **daily email send** (cron job that delivers today's reading each morning) is not part of this guide. See [devotional-architecture.md](../for-developers/devotional-architecture.md) for the cron architecture and how to wire it up via Vercel Cron Jobs.
