---
title: "Set up the Weekly Digest"
type: how-to
---

# Set up the Weekly Digest

The Weekly Digest is an optional email feature. It sends one email per week to everyone subscribed via the `/digest` page. The content is composed automatically from the CMS — announcements, upcoming events, recent sermons, and an optional pastor's note.

**Prerequisites:**

- Devotional subscriber infrastructure must already be set up. The digest reuses the same database, Resend account, and unsubscribe/preferences flow. If `/admin/devotionals` works, you're good.
- Resend domain verified (so emails don't bounce).
- `CRON_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_PASSWORD`, and `DATABASE_URL` already set in Vercel.

---

## 1. Enable the feature flag

In TinaCMS → **Site Settings** → **Feature Flags** → toggle **Weekly digest** on.

This flips `features.digest` in `content/site.json`. Once on:

- `/digest`, `/digest/subscribe`, and `/digest/archive` become accessible.
- A "Weekly Digest" link appears under the **Connect** menu in the site nav.
- The cron's hourly check will start considering whether to fire (the next time conditions match).

While the flag is off, the public pages return 404 and the cron logs `feature_disabled`.

---

## 2. Configure the digest settings

In TinaCMS → **Digest Email Settings**. The fields:

| Field | What it does |
|---|---|
| **Enable Weekly Digest** | Pauses sends without disabling the feature. Use during holiday weeks. |
| **Sender Name** | The "From:" name in the inbox. Usually your church name. |
| **Sender Email** | The "From:" address. Must be on a Resend-verified domain. The `RESEND_FROM_EMAIL` env var overrides this if set. |
| **Subject Line Template** | Supports `{{churchName}}`, `{{weekStart}}`, `{{weekEnd}}`. |
| **Send Day / Send Hour / Church Timezone** | When the auto-send fires. Hour is local to the configured timezone. |
| **Events Lookahead (days)** | How far ahead to pull events. Default 10. |
| **Recent Sermons to Include** | How many recent sermons to feature. Default 1. |
| **Brand Color** | Hex code used for headers, buttons, accents. |
| **Logo** | Optional. If left blank, the sender name displays as text. |
| **Footer / Unsubscribe Text** | Required for CAN-SPAM compliance — must include church name and physical address. |
| **Intro (optional)** | Short greeting block above the digest content. |

Once saved, you can preview the digest at `/admin/digest/preview`.

---

## 3. Verify everything is wired

Visit `/admin/digest`. You should see:

- **Status:** Enabled
- **Subscribers:** 0 (you haven't subscribed anyone yet)
- **Send day** + **Send time** matching what you configured

Click **Preview this week →** to see the rendered email. The sidebar tells you what content is in each section.

Send yourself a test:

1. On the preview page, find the **Send a test to yourself** form in the sidebar.
2. Enter your email and click **Send test**.
3. Check your inbox. The subject line is prefixed with `[TEST]`.

The test does **not** record a send-log entry, so you can re-send tests freely.

---

## 4. The first scheduled send

The cron at `/api/cron/digest` fires every hour. It checks:

1. Is `features.digest` enabled? (no → skip)
2. Is the digest enabled in `digest-settings.json`? (no → skip)
3. Does today's local day-of-week in the church's timezone match `sendDay`? (no → skip)
4. Does the current local hour match `sendHour`? (no → skip)
5. Has this week's digest already been sent? (yes → skip)

When all five pass, it calls `sendWeeklyDigest`. The first time those conditions all line up, the send fires automatically.

**Important:** before that first scheduled send, `digest_send_log` is empty. That's fine — the cron uses `weekStart` as the unique key, so the first row is created when the first send happens. No setup is needed.

---

## 5. Manually trigger a send

For sending out-of-cycle (e.g., a major announcement day):

```bash
curl -X POST \
  -u "admin:$ADMIN_PASSWORD" \
  https://your-church.org/api/admin/digest/send-now
```

That fires the same `sendWeeklyDigest` logic, but bypasses the day/hour gate. Idempotency still applies — if this week was already sent, the request returns `{ skipped: true, skipReason: "already_sent" }`.

To force a re-send for the current week (rare — use when you've corrected a content issue and need to re-send):

```bash
curl -X POST \
  -u "admin:$ADMIN_PASSWORD" \
  "https://your-church.org/api/admin/digest/send-now?force=true"
```

This deletes the prior send-log row and writes a new one after the re-send completes.

---

## 6. Monitor sends

`/admin/digest` shows the most recent sends with `attempted`, `sent`, `failed` counts.

Each digest email also carries Resend tags:

- `type=digest`
- `week=2026-W20` (approximate ISO week label)

In the Resend dashboard, filter by `type:digest` to see all digest sends across all weeks, or by `week:2026-W20` to drill into one week's batch.

---

## 7. Handling bounces

The digest send job uses the existing Resend webhook handler at `/api/webhooks/resend`. On a **hard bounce** of a digest email, the `digest` tag is removed from that subscriber's row — they stop receiving the digest but continue to receive any other emails they subscribed to (e.g., devotionals).

This is stricter than the devotional code path, which marks the whole subscriber as `bounced`. The digest treats bounces per-tag so a single bad mailbox doesn't take a subscriber out of every email type.

---

## Troubleshooting

**`features.digest` is on but the link doesn't appear in the nav.**
The nav injection runs at module-load time. Restart the dev server or wait for the next prod build.

**Cron logs `not_send_day` or `not_send_hour` forever.**
Double-check `sendTimezone` — if the configured timezone is far from your server's clock, the local hour you expect might be different from what the cron evaluates. Examples: a church in `America/Denver` setting `sendHour=14` will see the cron fire at 2 PM Denver time, which is 4 PM Eastern. Vercel's cron runs UTC, but the code converts to the configured timezone before comparing.

**`/admin/digest/preview` shows blank sections even though there's content.**
Each section has its own data source — check the actual files:

- Announcements: `content/announcements/*.md` with a `date` within the past 7 days
- Events: `content/events.json` (recurring) and `content/events/*.md` (one-off) — must fall in the next 10 days
- Sermons: `content/sermons/*.md` — the most recent N by date
- Note: `content/digest-notes/*.md` with `status: ready` and `weekOf` inside the current week

**The cron isn't firing at all.**
Check Vercel → Crons. The `/api/cron/digest` entry should show recent invocations. If empty, `vercel.json` may not have been redeployed. If the invocations all 401, `CRON_SECRET` isn't set as a Vercel env var (or the value in `vercel.json` is stale).
