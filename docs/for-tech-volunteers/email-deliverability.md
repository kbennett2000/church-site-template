---
title: "Email Deliverability"
type: how-to
---

# Email Deliverability

This guide explains how to make sure devotional emails (and other site emails) land in recipients' inboxes rather than spam folders.

**Background:** Email deliverability is determined by a combination of DNS records, sender reputation, and email content. Getting these right is a one-time setup step; once done, you rarely need to revisit it.

---

## Step 1 — Verify your sending domain in Resend

When you signed up for Resend and added `RESEND_API_KEY`, you entered an "from" address for site emails (e.g., `noreply@yourchurch.org`). Before Resend can send from that address at scale, you need to verify ownership of that domain.

1. Go to [resend.com](https://resend.com) → **Domains**.
2. Click **Add Domain** and enter your church's domain (e.g., `yourchurch.org`).
3. Resend will give you a set of DNS records to add — typically SPF, DKIM, and DMARC records.
4. Add these records in your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) or wherever you manage DNS.
5. Click **Verify** in Resend. DNS propagation can take a few minutes to a few hours.

Once verified, the domain will show a green checkmark and Resend will begin sending from it.

---

## Step 2 — Add SPF, DKIM, and DMARC records

Resend's setup wizard adds these for you, but it helps to understand what they do:

| Record | Purpose |
|---|---|
| **SPF** | Lists the mail servers allowed to send email on behalf of your domain. |
| **DKIM** | Cryptographically signs emails so recipients can verify they weren't tampered with. |
| **DMARC** | Policy for what to do when SPF or DKIM fails. Protects your domain from being spoofed. |

Without these, many email providers (especially Gmail and Outlook) will either mark your emails as spam or reject them entirely.

**Tip:** After adding the records, use [MXToolbox](https://mxtoolbox.com/SuperTool.aspx) to verify each one is set correctly. Search for `spf:yourchurch.org`, `dkim:yourchurch.org`, and `dmarc:yourchurch.org`.

---

## Step 3 — Use a real sending address

The "From" address in your devotional emails should be one that actually receives email. People hit "Reply" sometimes, even for automated emails. If the address bounces replies, that's a bad signal to spam filters.

- **Good:** `devotionals@yourchurch.org` (forwarded to a staff inbox)
- **Bad:** `noreply@yourchurch.org` (the word "noreply" can increase spam filter suspicion)

Set the sending address in the CMS under **Devotional Email Settings → Sender Email**.

---

## Step 4 — Warm up your sending domain

If you're sending to a large list from a brand-new domain, spam filters are suspicious of sudden volume. "Warming up" means gradually increasing send volume over a few weeks.

For most small churches (under 200 subscribers), this isn't a concern — the volume is too low to trigger spam filters. If you're migrating a large existing list, start by sending to your most engaged subscribers first.

---

## Step 5 — Monitor bounce and spam rates

In **Resend → Logs**, you can see every email sent, whether it delivered, bounced, or was marked as spam.

- **Soft bounce:** Temporary failure (e.g., inbox full). Resend retries automatically.
- **Hard bounce:** Permanent failure (e.g., email address doesn't exist). Stop sending to that address.

High bounce rates (above 2%) will hurt your sender reputation. Clean your list periodically using the CSV export from `/admin/devotionals`.

---

## Step 6 — Content best practices

Email content affects deliverability too:

- **Use a plain text equivalent.** Resend does this automatically from your HTML.
- **Avoid spam trigger words** in subject lines: "free," "winner," "urgent," "click now."
- **Keep image-to-text ratio balanced.** Emails that are mostly images look spammy.
- **Include a physical address** in your footer. CAN-SPAM (US) requires it.
- **Include an unsubscribe link.** The devotional footer already includes one — don't remove it.

---

## Checking deliverability health

Use these free tools to check your sending domain's health:

- **[mail-tester.com](https://mail-tester.com)** — Send a test email and get a spam score (aim for 9+/10)
- **[MXToolbox](https://mxtoolbox.com/SuperTool.aspx)** — Verify SPF, DKIM, DMARC records
- **Resend Logs** — Live view of delivery status for every email

---

## Common issues

**Emails going to spam in Gmail**  
Usually a missing DKIM record or a mismatch between the "From" domain and the verified domain. Check Resend's domain status and re-run DNS verification.

**"Failed to send" in the subscription flow**  
Check that `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and the sender address in Devotional Email Settings match your verified Resend domain.

**Bounced subscribers**  
If a subscriber bounces, update their status to `bounced` in the database (or wait for the cron job to handle it). Don't keep sending to hard-bounced addresses.
