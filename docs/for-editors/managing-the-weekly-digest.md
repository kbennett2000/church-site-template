---
title: "Managing the Weekly Digest"
type: how-to
---

# Managing the Weekly Digest

> **Note:** This guide is a placeholder. It will be filled in once the weekly digest feature is complete.

The weekly digest sends a single email each week to everyone who has subscribed. It automatically pulls in:

- Current announcements from the church website
- Upcoming events from the calendar
- The most recent sermon
- An optional note from the pastor (written in the CMS)

---

## Writing a pastor's note

1. In the CMS, go to **Pastor's Notes (Digest)**.
2. Click **New Note**.
3. Set the **Week Of** date to the Monday of the week you want the note to appear.
4. Write your note in the body field. Keep it 2–4 sentences — warm, personal, brief.
5. Set **Status** to **Ready** when you're done.

The digest send job picks up the most recent note with status `ready` whose week matches the send date. If no note is ready, the pastor's note section is simply omitted — no placeholder message appears.

After the digest sends, mark the note as **Sent** to prevent it from being re-included in a future digest.

---

## Turning the digest on or off

In the CMS, go to **Digest Email Settings** and toggle **Enable Weekly Digest**. This lets you pause sends without disabling the feature entirely — useful during holiday breaks or when you're not ready to send yet.

---

## Coming soon

This page will be expanded with:

- Step-by-step setup instructions for tech volunteers
- Subject line customization
- Send day and time configuration
- Subscriber management

For now, refer to the tech volunteer setup guide at `docs/for-tech-volunteers/setup-devotional-emails.md` for the shared subscriber infrastructure.
