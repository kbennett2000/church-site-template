---
type: tutorial
audience: editor
time: 10 minutes
---

# Getting started with the church website editor

Your church adopted a website template, and this guide shows you how to keep it updated.

The good news: you'll do everything in your browser. You won't write code, you won't run terminals, and you can't break the site. Every change goes live automatically after saving — no tech volunteer needs to review it first. By the end of this guide you'll be able to add a sermon, edit a staff bio, change service times, post an announcement, and update the calendar — all in 5–10 clicks each.

**Who this is for:** Church staff who need to update the website — pastors, secretaries, ministry leaders. No coding required.
**What you'll accomplish:** Log into the website editor for the first time and learn what each section is for.
**You'll need first:**
- Your email address (a Google account works best).
- Your tech volunteer to add your email address to the CMS — this takes about 2 minutes and only has to happen once.
- The web address of your church's site, with `/admin/` on the end. For example, `https://yourchurch.org/admin/`.

> **Important:** Before your first login will work, the tech volunteer at your church has to add your email to the CMS. If you skip this step, you'll see "Not authorized." See **Common Mistakes** at the bottom.

## What is this thing I'm logging into?

You're about to use the **CMS** (Content Management System — a fancy term for "the website's editing screen"). Everything you change here saves directly to the website. You'll never see code, type any commands, or break anything that can't be undone.

## Steps

### 1. Ask your tech volunteer to invite you

**Tell** your tech volunteer your email address (the one you'll use to log in — a Gmail address works best).

They'll add you in a tool called TinaCloud. You'll receive an invitation email from TinaCloud.

**Check your inbox** for an email with subject like "You've been invited to edit content."

**Click** the link in that email and follow the steps to create your account. You can use **Continue with Google** if you prefer — no new password needed.

### 2. Open the editor in your browser

**Type** your church's web address followed by `/admin/` into your browser's address bar.

For example: `https://yourchurch.org/admin/`

**Press** Enter.

You should now see a sign-in screen.

![CMS login screen](/docs/screenshots/editor/getting-started-login.png)

### 3. Sign in

**Click** **Continue with Google** (if you use a Gmail account) or enter your email and password.

You should now see the CMS dashboard.

![CMS dashboard](/docs/screenshots/editor/getting-started-dashboard.png)

### 4. Look around the dashboard

The dashboard shows a list of sections on the left. **The menu on the left is the easiest way to move between sections** — click any section name to jump to it. Stay in this menu for navigation rather than your browser's back button; the back button doesn't always land you somewhere useful inside the editor.

Each section is a content type:

| Section | What's in it |
| --- | --- |
| **Site Settings** | Church name, address, phone, logo, service times |
| **Sermons** | One entry per sermon — title, date, speaker, video link |
| **Announcements** | Short posts that appear on the announcements page |
| **Staff** | Staff bios and photos |
| **Elders** | Elder bios and photos |
| **Ministries** | Kids, Youth, Women's, etc. — each gets its own page |
| **Small Groups** | Groups listed on the Connect page |
| **Prayer Requests** | Requests on the prayer wall |
| **Recurring Events** | Events that repeat weekly or monthly |
| **Custom Pages** | One-off pages added to the site |

### 5. Make a test change

**Click** **Announcements** in the left sidebar.

**Click** on an existing announcement.

**Change** a word in the body text.

**Click** the blue **Save** button.

A brief confirmation appears near the **Save** button to let you know the change was sent. The form stays open on the screen you were just editing — that's expected and means everything worked. You don't need to click anything else or navigate away to "finish" the save. When you're ready to edit something else, use the menu on the left.

Wait about 2 minutes, then **open** your church's public website and check the announcements page. You should see your change.

> **Tip:** If the change doesn't appear after 2 minutes, try a hard refresh in your browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac). The site rebuilds automatically after every save.

### 6. Moving around between sections

Use the **menu on the left** any time you want to switch sections — for example, from Announcements to Sermons. Click the section name and you're there.

**Tip:** Avoid your browser's **back** button while you're inside the editor. It doesn't always land you on the screen you expect (sometimes it logs you out, sometimes it drops you on a blank dashboard). The left-side menu is the reliable way to move around.

### 7. Re-sorting a list (your browser remembers)

Several collection screens — Sermons especially — open with the list sorted alphabetically. You can change the sort (for example, sort Sermons by **Date** descending so the newest one is on top) using the sort control at the top of the list, and **your browser remembers your choice** for next time. You only need to set it once on each computer or browser you use. See [Seeing your newest sermons first](./02-add-a-sermon.md#seeing-your-newest-sermons-first) for a worked example.

### 8. Removing one item from a list

Some screens — like **Site Settings → Services** or a ministry's **Meeting Times** — have a list of entries. Each entry in the list now has a descriptive label (for example, `Sunday • 10:00 AM • Sunday Worship` instead of a generic `Services Item`) so you can tell them apart at a glance.

To remove one entry:

1. **Read the label** to confirm you're about to remove the right one.
2. **Click** the entry to expand it.
3. **Click** the small remove/delete control on that entry (usually a trash icon or "Remove" button at the corner of the expanded item).
4. **Click** **Save** at the top.

The descriptive labels are the safety net here — if the label doesn't match what you intended to remove, stop and double-check before deleting.

---

## What's next?

- [Add a sermon](./02-add-a-sermon.md) — the most common content task.
- [Update church info](./03-update-church-info.md) — address, phone, service times.
- [Manage announcements](./05-manage-announcements.md) — add, edit, and expire announcements.

## Common Mistakes

- **"Not authorized" or login screen keeps refreshing.** Your email hasn't been added yet, or you accepted the invite but used a different email address. Contact your tech volunteer and confirm the exact email they added.
- **I don't see the invitation email.** Check your spam folder. The email comes from TinaCloud (tina.io). If it's lost, ask your tech volunteer to re-invite you.
- **I saved a change but the site looks the same.** The site rebuilds automatically but takes 1-3 minutes. Try hard-refreshing the page after waiting a moment.
- **I can see the dashboard but some sections are missing.** Your tech volunteer may have set limited permissions. Ask them what access level you were given.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Getting%20Started).*
