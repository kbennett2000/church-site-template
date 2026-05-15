---
type: how-to
audience: editors
---

# Managing Reading Plans

Reading plans are sequences of dated Bible passages delivered to subscribers each morning by email. Plans are created in the CMS and appear on the `/devotionals` page of your site.

**Before you start:** Ask your tech volunteer to enable the devotionals feature in Site Settings → Feature Flags → Daily Devotionals. Until that's on, the `/devotionals` pages return a 404.

---

## Quick orientation

- **One plan = one markdown file** in the CMS under "Reading Plans."
- **Entries** are the individual daily readings within a plan. Each entry has a date, a scripture reference, and an optional title and leader note.
- **Style** controls how the email and the website entry page are structured (SOAP, Simple, or Lectio Divina — explained below).
- **Active flag** controls whether the email scheduler sends today's entry to subscribers. Set it to `false` while building; flip to `true` when the plan is ready.
- **Scripture text is never stored in the plan.** The system fetches verse text from a Bible API at display time using the reference you provide (e.g., "Psalm 23"). This keeps plans small and lets you change translations without re-entering content.

---

## Creating a plan

1. Open the CMS at `/admin` and click **Reading Plans** in the left sidebar.
2. Click **New Reading Plan**.
3. Fill in the plan metadata:
   - **Title** — shown on the site. Example: *Psalms in 30 Days*.
   - **Slug** — the URL path. Use lowercase letters, numbers, and hyphens only. Example: `psalms-in-30-days`.
   - **Style** — pick one (see below).
   - **Bible Translation** — pick `WEB` or `KJV` if you don't have an API key set up. They're public domain and work immediately.
   - **Start Date / End Date** — the first and last day of the plan.
   - **Active?** — leave unchecked until you've reviewed the entries.
4. Write a short **Plan Description** (two or three sentences explaining what the plan covers and who it's for).
5. Add entries (see below).
6. Click **Save**. The plan appears on `/devotionals` as an upcoming plan.

---

## Adding entries

Click **Add Item** under "Daily Readings" for each day of the plan.

Each entry has four fields:

| Field | Required | Notes |
|---|---|---|
| Date | Yes | Must be unique within the plan and fall between start and end dates. |
| Scripture Reference | Yes | Standard Bible reference: `Psalm 23`, `John 3:16-21`, `Romans 8`. No verse text — the system fetches it. |
| Day Title | No | Optional short name, e.g. *The Lord Is My Shepherd*. Shown in the email subject if `{{title}}` is in the template. |
| Leader Notes | No | Optional note from the pastor. Appears below the scripture on the site and in the email. Markdown is supported. |

### Scripture references — format guide

The system passes whatever you type directly to the Bible API, so use standard formats:

| You type | What's fetched |
|---|---|
| `Psalm 23` | All of Psalm 23 |
| `John 3:16-21` | John 3, verses 16–21 |
| `Romans 8:1-17` | Romans 8, verses 1–17 |
| `Matthew 5` | All of Matthew 5 |
| `Genesis 1:1` | Genesis 1, verse 1 only |

If the API can't find a reference, the entry page shows a fallback message asking readers to open their Bible to that passage. Double-check unusual references before activating the plan.

### Importing entries from a spreadsheet or CSV

For long plans (30+ entries), typing each entry in the CMS is slow. A faster approach:

1. Build your plan in a spreadsheet with columns: `date`, `scriptureReference`, `title`, `leaderNotes`.
2. Export as CSV.
3. Ask your tech volunteer to convert the CSV to YAML frontmatter and paste it into the markdown file directly (bypassing the CMS UI for the initial load). See `/content/reading-plans/_examples/` for the exact YAML format.

---

## Plan styles

### Simple (Verse of the Day)

The scripture block appears with no extra prompts. Good for:
- Broad audiences unfamiliar with journaling methods.
- Advent or Lent calendars where the focus is the passage itself.
- Plans you want to feel light and accessible.

The email for a Simple plan shows: greeting → scripture → leader note (if any) → closing.

### SOAP (Scripture / Observation / Application / Prayer)

After the scripture block, the website entry page shows four journaling sections with guiding questions. The email for a SOAP plan includes a brief explanation of each step.

Good for:
- Churches that already teach SOAP in small groups or sermons.
- Plans aimed at personal Bible study growth.
- Any plan where you want subscribers to go deeper than just reading.

**What each letter means:**

- **S — Scripture:** Read the passage slowly, once or twice.
- **O — Observation:** What do you notice? What word or phrase stands out?
- **A — Application:** How does this apply to your life today? Be specific.
- **P — Prayer:** Respond to God in your own words.

### Lectio Divina

An ancient Christian reading practice that moves through four movements: Read (*Lectio*), Meditate (*Meditatio*), Pray (*Oratio*), and Contemplate (*Contemplatio*). The website guides the reader through each movement after displaying the passage.

Good for:
- Contemplative church cultures or small groups already practicing Lectio.
- Advent or Holy Week plans where stillness matters more than output.

---

## Activating a plan

When you're ready for email delivery to begin:

1. Open the plan in the CMS.
2. Check **Active — send emails to subscribers?**
3. Click **Save**.

The email scheduler (set up separately by your tech volunteer) will start including this plan in its daily run. It picks up the entry matching today's date.

**Before activating, verify:**
- Every entry has a valid scripture reference.
- Start and end dates are correct.
- The email settings (Devotional Email Settings in the sidebar) have your sender name, sender email, and footer text filled in.
- At least one subscriber has tested the email and confirmed it looks right.

---

## Managing an active plan

- **Editing entries mid-plan** — changes take effect the next time the scheduler runs. Editing a past entry changes it on the website but doesn't re-send to subscribers.
- **Pausing a plan** — uncheck "Active" in the CMS. The scheduler skips the plan. Re-check to resume. Subscribers who missed days can catch up on the website.
- **Ending a plan early** — set the end date to today and uncheck Active. The plan remains visible on the site with all past entries readable.

---

## Email settings

All plans share a single set of email settings, edited under **Devotional Email Settings** in the CMS sidebar.

| Field | What it does |
|---|---|
| Sender Name | The "From:" name in subscribers' inboxes. Usually your church name. |
| Sender Email | Must be a verified sender in your Resend account. |
| Subject Template | The email subject line. Use `{{reference}}`, `{{date}}`, `{{title}}`, `{{planTitle}}` as variables. |
| Intro | Short HTML greeting shown above the scripture. |
| Outro | Closing HTML shown below the scripture and leader notes. |
| Brand Color | Hex color for the email header and button. |
| Logo | Optional logo image at the top of each email. |
| Footer Text | Required by law (CAN-SPAM). Must include your church mailing address. |

**Per-style overrides:** The SOAP, Simple, and Lectio Divina override sections let you use different intro/outro text for different plan styles. If left empty, the shared intro/outro is used for all plans.

---

## What subscribers will see

Before activating a plan and sending it to subscribers, you can preview the email at:

- `/admin/devotionals/preview/simple` — Simple style (verse + reflection prompt)
- `/admin/devotionals/preview/soap` — SOAP style (four journaling sections)
- `/admin/devotionals/preview/lectio_divina` — Lectio Divina style (four movements)

The preview renders a sample Psalm 23 entry using your real church name, brand color, and email settings — so it accurately reflects how emails will look in your subscribers' inboxes.

For an exact rendering with real scripture from your plan, use **Admin → Devotionals → Send test email**, which sends a live email to any address you specify.

---

## Testing before activating a plan

Follow this checklist before setting `isActive: true`:

1. **Preview the email template** at `/admin/devotionals/preview/[style]`. Check that your church name, brand color, and footer text look correct.
2. **Send a test email** via Admin → Devotionals → Send test email. Choose the plan slug and today's date.
3. **Check it in multiple email clients.** Gmail and Apple Mail are the two most important. Outlook is optional — the template degrades gracefully.
4. **Check spam folder.** If it lands in spam, ask your tech volunteer to review [email-deliverability.md](../for-tech-volunteers/email-deliverability.md).
5. **Subscribe yourself** at `/devotionals`, verify your email, and confirm you appear as "active" in `/admin/devotionals`.
6. **Wait for the cron** (fires at the top of every hour) and confirm the email arrives. Or ask your tech volunteer to trigger it manually.
7. **Set `isActive: true`** in the CMS once everything looks good.

---

## What happens when you edit a plan that has active subscribers

- **Changing the title** — subscribers get the new title in the subject line on the next send. Already-sent emails are not retroactively updated.
- **Changing the style** — the new style takes effect for the next send. Subscribers who got a SOAP email yesterday will get a Simple email tomorrow if you switch.
- **Changing the translation** — takes effect on the next send. The system re-fetches scripture fresh each day.
- **Editing a future entry's scripture reference** — fine; it hasn't been sent yet.
- **Editing a past entry's scripture reference** — the change appears on the web entry page immediately, but won't re-send to subscribers (they already got that day's email).
- **Setting `isActive: false`** — the email scheduler stops sending. Subscribers remain subscribed; they'll resume receiving emails if you flip it back to `true`. Use this to pause a plan during a church break.
- **Deleting a plan** — see below.

---

## Common questions

**The scripture text isn't showing on the entry page.**
The system couldn't reach the Bible API, or the reference format isn't recognized. Check the reference spelling (e.g., `Psalm` not `Ps`, `John` not `Jn`). If the problem persists, ask your tech volunteer to check the server logs.

**I want to use the ESV translation.**
ESV requires an API key from api.esv.org. Ask your tech volunteer to add `NEXT_PUBLIC_ESV_API_KEY` to the server environment. Until then, the system falls back to WEB automatically.

**Can I have multiple plans active at the same time?**
Yes. Each plan has its own subscriber list and is sent independently. Subscribers choose which plans to follow.

**How do I delete a plan?**
Open it in the CMS and click the delete button. This removes the file and the plan from the site. Past entries are no longer accessible. Subscribers aren't automatically notified — send a manual note if the plan had active subscribers.
