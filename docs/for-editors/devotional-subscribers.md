---
title: "Devotional Subscribers"
type: how-to
---

# Devotional Subscribers

Once your church has the subscriber system set up (see the tech volunteer guide), you can view who's subscribed, export their information, and understand the states a subscriber can be in.

---

## Who can subscribe

Anyone can sign up on `/devotionals`. The sign-up form asks for:

- **Email address** (required)
- **Name** (optional)
- **Delivery time** — what hour of the day they'd like their email (in their local timezone)
- **Reading plan(s)** — which plan or plans to subscribe to

After submitting, they receive a verification email. They must click the link in that email to activate their subscription. This is called a **double opt-in** — it confirms the email address is real and prevents someone from signing up with another person's email.

---

## Subscriber states

| Status | Meaning |
|---|---|
| **Pending** | Signed up but hasn't clicked the verification link yet. Emails are not sent yet. |
| **Active** | Verified. Will receive daily devotional emails. |
| **Unsubscribed** | Clicked unsubscribe. No longer receives emails. |
| **Bounced** | Email delivery failed repeatedly. No longer receives emails. |

---

## Viewing subscriber stats

Go to `/admin/devotionals` on your site. You'll be prompted for the admin password (set up by your tech volunteer).

The admin page shows:

- Total subscribers and how many are in each state
- How many active subscribers are on each reading plan
- The 20 most recent sign-ups

---

## Exporting subscribers

On the admin page, click **Export CSV**. This downloads a spreadsheet of all **active** subscribers with their email, name, timezone, preferred send hour, and sign-up date.

You can open this file in Excel or Google Sheets for your records.

---

## What subscribers can manage themselves

Subscribers can update their own preferences at any time using the **Manage my preferences** link in any devotional email. They can change:

- Their name
- Their preferred delivery time
- Which reading plans they're subscribed to

They can also unsubscribe from the manage page, or click the unsubscribe link directly in the email.

---

## Privacy notes

- Subscriber email addresses are stored only in your Vercel Postgres database.
- The data is not shared with any third parties except your email provider (Resend), which uses it to deliver the emails.
- Subscribers who unsubscribe are marked "unsubscribed" in the database — their data is retained but no further emails are sent.
- If a subscriber asks to have their data deleted, your tech volunteer can do this directly in the database.

---

## Common questions

**Someone says they never received the verification email.**  
Ask them to check their spam folder. The email comes from the address set in Devotional Email Settings. If it's consistently landing in spam, your tech volunteer should review the email deliverability guide.

**Someone says they subscribed but aren't getting emails.**  
Check the admin page — if their status shows "pending," they haven't verified their email. Ask them to look for the verification email.

**Can I manually add a subscriber?**  
Not through the CMS. Your tech volunteer can add one directly to the database if needed. For large lists, the CSV import feature is on the roadmap.

**Can a subscriber be on multiple plans?**  
Yes — the sign-up form lets them select multiple plans. Each plan sends its own daily email.
