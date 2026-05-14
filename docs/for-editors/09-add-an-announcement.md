---
type: how-to
audience: editor
time: 3 minutes
---

# Add a weekly announcement

**Who this is for:** Whoever writes the weekly bulletin or pulpit announcements.
**What you'll accomplish:** Post a short announcement that appears on the homepage and disappears automatically after the date you choose.
**You'll need first:**
- Logged in to the editor at `/admin/`. See [Getting started](./01-getting-started.md).
- The text of the announcement — usually 1-2 sentences.

---

## When to use this (vs. adding an event)

| Use **Announcements** for... | Use [**Events**](./06-add-an-event.md) for... |
| --- | --- |
| "Don't forget Wednesday supper tonight" | A recurring weekly meeting like Wednesday Supper |
| "Pastor John is on vacation next week" | A specific calendar event with a date and time |
| "Communion this Sunday" | A workshop people can RSVP for |
| Pulpit-style heads-up | Anything that belongs on `/calendar` |

Announcements are short and time-sensitive. Events live on the calendar with proper recurrence rules.

---

## Steps

### 1. Open the Announcements collection

**Click** **Announcements** in the left sidebar.

You should now see a list of past announcements, newest first.

### 2. Click New Announcement

**Click** the **New Announcement** button in the top right.

You should now see a blank form.

### 3. Fill in Title

**Type** a short headline — what someone would say in 5 words.

Examples:
- `Wednesday Supper Tonight`
- `Communion This Sunday`
- `Pastor John on Vacation Next Week`

### 4. Pick Date Posted

**Click** the calendar icon next to **Date Posted**.

**Select** today's date.

This is mostly for sorting and the "Posted May 13" label that appears under the message.

### 5. (Optional) Pick Auto-hide date

**Click** the calendar icon next to **Auto-hide after this date**.

**Pick** the last day this should appear on the site.

After that date, the announcement disappears automatically — no cleanup required. Some examples:

- "Wednesday Supper Tonight" → auto-hide Friday
- "Communion This Sunday" → auto-hide Monday
- "VBS sign-ups open" → auto-hide the day after VBS ends

**Leave blank** if you want the announcement to stay until you delete it manually.

### 6. (Optional) Pin to top

If this is the most important announcement of the week:

**Check** the **Pin to top?** box.

Pinned announcements show first with a small "Pinned" badge. Use sparingly — if everything is pinned, nothing stands out.

### 7. (Optional) Add a link

If there's somewhere people should go for details:

**Type** the URL or path into **Optional link** — e.g. `/calendar` or `https://signup.com/event`.

**Type** what the button should say in **Link button text** — e.g. `See full menu` or `Sign up`. If you leave it blank, the button says "Learn more."

If there's no extra info to link to, leave both fields blank — no button appears.

### 8. Write the Message

**Type** 1-2 sentences into the **Message** field. Keep it short — if it needs more space, write a brief teaser and use the link to point at a longer page.

Examples:
- *"Family meal at 5:15 PM in the Fellowship Hall — free for everyone. Awana starts at 6:10."*
- *"We'll take the Lord's Supper together as part of our regular 9:00 AM service."*

### 9. Save

**Click** **Save** at the top.

That's it. TinaCMS commits the change directly to the site. Within 2-3 minutes, the announcement appears in the **Announcements** section on the homepage. It disappears automatically on the auto-hide date you picked.

## Common Mistakes

- **The announcement isn't showing up.** Check the **Auto-hide** date — it may already be in the past. Also confirm you clicked **Save** after filling in the form — the site takes 2-3 minutes to rebuild.
- **Everything is pinned.** Pinning everything defeats the purpose. Pin at most one announcement at a time.
- **The link goes to a 404.** Internal paths must start with `/` (e.g. `/calendar`, `/visit`, `/ministries/kids`). External URLs need `https://` at the start.
- **The message is a paragraph long.** That's fine for a newsletter but too long here. Break it up — short version on the homepage, longer version on a linked page.

## What's next?

- [Add an event](./06-add-an-event.md) — for recurring calendar items rather than one-off announcements.
- [Publishing changes](./08-publishing-changes.md) — what happens after you click **Publish**.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Add%20an%20Announcement).*
