---
type: how-to
audience: tech-volunteer
---

# Runbook — emails stopped sending

**When to open this:** one or more of:

- A subscriber tells you they're not receiving daily devotionals or weekly digests.
- The Resend dashboard shows no recent send activity for the type of email you'd expect.
- A new subscriber completes sign-up but no confirmation email arrives.
- A test send from `/admin/devotionals` or `/admin/digest/preview` doesn't land in your own inbox.

---

## Before you panic

Most "I didn't get the email" reports trace back to one mailbox, not a system outage.

1. **Spam folder** is the #1 culprit. Ask the reporter to check it before doing anything else.
2. **Wrong email on the record** is #2. Search the subscriber database for what they think their address is — typos are common.
3. **One person reporting** vs. **multiple people reporting** is the divide between a per-subscriber issue (Check 1) and a system issue (Check 2 onward).

Open the [Resend dashboard](https://resend.com) in another tab — you'll need it for several checks.

---

## Known gotcha (read this first)

If your `RESEND_FROM_EMAIL` is set to `onboarding@resend.dev` (Resend's default sandbox sender), **Resend only delivers to the email address that owns your Resend account.** Every other recipient is silently dropped. The send shows as "delivered" in Resend's logs but never reaches the actual subscriber.

If that describes your setup, this is almost certainly your problem. The fix is to verify your own domain in Resend and update `RESEND_FROM_EMAIL` to use that domain — see [email-deliverability.md](./email-deliverability.md).

If your sender is already on a verified custom domain, continue with the checks.

---

## Check 1 — Is it just one specific person?

If exactly one subscriber is reporting nothing-received, treat it as a per-record problem first.

1. **Open** Vercel → Storage → your Postgres database → **Browse**, **OR** run `npm run db:studio` locally and connect.
2. **Find** the `subscribers` row for the reporter's email address.
3. **Check the `status` field:**

| Status | Meaning | Action |
|---|---|---|
| `active` | Verified and receiving. | Continue — the system thinks they're getting mail. Check their tags and recent send activity below. |
| `pending_verification` | They never clicked the confirmation link. | Ask them to subscribe again and click the verification email this time. |
| `unsubscribed` | They opted out. | Re-subscribe them only if they explicitly ask. |
| `bounced` | Resend rejected their address as undeliverable. | Their email address is invalid or their inbox is full. They need to provide a different address or fix theirs. |

4. **Check the `tags` field** — does it include the right tag for what they expected? Devotional emails go to subscribers with the `devotionals` tag; weekly digest goes to subscribers with the `digest` tag. Missing tag = no email.
5. **Check `subscriber_plans.last_sent_date`** for devotional subscribers — that's the date of the last successful send to that subscriber on each reading plan. If it's recent (yesterday or today), the system *thinks* it sent successfully — the problem is downstream of Resend (spam folder, mailbox full, address typo).

If status is `active`, tags are right, but no recent send activity in Resend logs for that address → continue to Check 2.

---

## Check 2 — Are the cron jobs running at all?

Devotional and digest emails are triggered by Vercel cron jobs that fire every hour. If the cron isn't firing, nothing sends.

1. **Open** Vercel → your project → **Settings** → **Cron Jobs** (the exact navigation label may be **Crons** or **Cron Jobs** depending on Vercel's current UI).
2. **Confirm both crons appear:**
   - `/api/cron/devotionals` — schedule `0 * * * *` (hourly)
   - `/api/cron/digest` — schedule `0 * * * *` (hourly)

| What you see | What it means | Fix |
|---|---|---|
| Both listed, "Last invocation" within the last hour | Crons are firing. Go to Check 3. | — |
| Both listed, "Last invocation" is hours or days old | Crons stopped firing. | Force a fresh deploy: Deployments → latest → **⋯** → **Redeploy** without build cache. |
| Only one listed, or neither | `vercel.json` is missing or got corrupted. | Check the repo — `vercel.json` should contain both cron entries. Restore it, commit, redeploy. |
| Listed but every invocation is "Failed" | The cron route is erroring. Continue to Check 3 for the cause. | — |

To see what each cron actually did, **open** Vercel → **Logs**, filter to `/api/cron/devotionals` or `/api/cron/digest`, and look at the response bodies. Both routes return JSON summaries — useful diagnostic strings include:

- `"reason": "feature_disabled"` → the feature flag is off in CMS. Toggle it on.
- `"reason": "not_send_day"` or `"not_send_hour"` (digest only) → cron fired but it's not yet the configured send window. Normal; just means today/this hour isn't when the digest is scheduled.
- `"reason": "already_sent"` → digest already went out for this week. Normal.
- Plain `401 Unauthorized` → continue to Check 3.

---

## Check 3 — Is `CRON_SECRET` correct?

Cron jobs are protected by a shared secret. If the value Vercel sends doesn't match the value the route checks, every cron returns 401 and nothing sends.

Symptom: in Vercel Logs, every `/api/cron/*` request returns `401`.

1. **Open** Vercel → Settings → **Environment Variables**.
2. **Confirm** `CRON_SECRET` exists and is set for all three environments (Production, Preview, Development).
3. **If it's missing**, generate one: `openssl rand -hex 32`. Add it. Redeploy.
4. **If it's present but cron logs still 401**, the value in `vercel.json` is out of sync with the env var. Check `vercel.json` in the repo — Vercel's cron uses the env var via standard auth headers, so the file itself doesn't need to contain the secret, but redeploy after any change.

---

## Check 4 — Is Resend itself healthy?

If crons fire and reach the send code, the next stop is Resend.

1. **Open** [resend.com](https://resend.com) → **Logs**.
2. **Filter** to the last 24 hours.

Interpret what you see:

| What logs show | What it means | Fix |
|---|---|---|
| Successful `delivered` entries within the past few hours | Resend is sending; the problem is downstream (spam filter on recipient end, mailbox full). | Ask the recipient to check spam, allowlist your sender domain. |
| Entries marked `bounced` or `failed` | Resend tried but couldn't deliver. | Click into one to see the error. Common: address doesn't exist, recipient's mail server rejected it. |
| Entries marked `failed` with "domain not verified" | Your sender domain lost verification status. | Re-verify in Resend → Domains. See [email-deliverability.md](./email-deliverability.md). |
| Entries marked `failed` with "rate limit" | You hit Resend's plan limit. | Resend's free tier has a daily/monthly cap; check your plan limits in Resend's dashboard. Wait for the limit to reset or upgrade. |
| **Zero send attempts** despite cron firing | The code reached the cron route but never called Resend. | Continue to Check 5. |

---

## Check 5 — Is `RESEND_API_KEY` valid?

If crons fire successfully but Resend shows no attempts, the code is bailing before reaching Resend — usually because the API key is wrong or revoked.

1. **Open** Resend → **API Keys**.
2. **Check** your API keys list. If the key Vercel is using has been deleted from Resend, that's the cause — Resend rejects requests with deleted keys (typically with `401`).
3. **Generate** a fresh key: **Create API Key**, name it `vercel-prod-YYYY-MM-DD` so you remember when. Copy the value immediately (shown only once).
4. **Update** Vercel: Settings → Environment Variables → `RESEND_API_KEY` → Edit → paste new value → Save.
5. **Redeploy.**
6. **Verify** by sending a test through `/admin/devotionals` (devotional test) or `/admin/digest/preview` (digest test).

If you suspect the key was leaked rather than just deleted, follow [runbook-rotate-secret.md](./runbook-rotate-secret.md) — same actions, but with a leak-response checklist.

---

## Check 6 — Is `RESEND_FROM_EMAIL` still on a verified domain?

If you changed sender domains recently — or your DNS records changed for an unrelated reason — Resend may have un-verified your sending domain.

1. **Check the current value** of `RESEND_FROM_EMAIL` in Vercel. Note the domain portion (e.g., `devotionals@yourchurch.org` → `yourchurch.org`).
2. **Open** Resend → **Domains**.
3. **Find** that domain in the list. Status must be **Verified**.

| Status | Action |
|---|---|
| Verified | Skip ahead — this isn't the cause. |
| Pending | DNS records aren't yet propagated, or were never added. Click into the domain to see the records Resend expects. Compare against your DNS registrar. |
| Failed | Records were added but are wrong. Re-check the values Resend shows against what's in your DNS. |

Recovery steps are in [email-deliverability.md](./email-deliverability.md).

---

## Check 7 — Is the database reachable?

Cron jobs read subscriber lists from Postgres. If the database is unreachable, the cron logs an error and no emails go out.

Symptom: Vercel runtime logs show errors like `connection refused`, `ETIMEDOUT`, or `[db] DATABASE_URL is not set`.

1. **Open** [Neon's status page](https://neonstatus.com) (or your Postgres provider's status page).
2. **If the provider is down**, wait for them.
3. **If the provider is up but your project can't connect:**
   - **Open** Vercel → Settings → Environment Variables → verify `DATABASE_URL` (and `POSTGRES_URL` if set) match the current connection string from your Neon/Vercel Postgres dashboard.
   - **Open** Neon dashboard → your project → check the database isn't suspended (Neon free tier auto-suspends after inactivity; usually wakes within seconds on first request).
4. **Verify by querying:** run `npm run db:studio` locally and open one of the tables. If Studio connects, the connection string is fine.

If the database is reachable but cron still fails, check Vercel runtime logs for the actual error message — it will name what's wrong.

---

## Still stuck?

Capture before asking for help:

1. **Screenshot** of Resend → Logs for the past 24 hours (filter to relevant email type).
2. **Vercel runtime log excerpt** from one recent cron invocation — copy the full JSON response and any error stack trace.
3. **The subscriber's database row** (just the relevant fields: id, email, status, tags, last_sent_date) — redact the email if you're sharing publicly.

Then:

- Open an issue at [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues) with the three items above.
- Most "emails stopped" diagnoses are visible in those three pieces of data combined.

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Runbook%20Emails%20Stopped).*
