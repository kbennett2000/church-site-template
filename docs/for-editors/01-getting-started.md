---
type: tutorial
audience: editor
time: 10 minutes
---

# Getting started with the church website editor

Your church adopted a website template, and this guide shows you how to keep it updated.

The good news: you'll do everything in your browser. You won't write code, you won't run terminals, you can't break the site. Every change goes through a quick review before it goes live, so typos get caught before they reach Sunday visitors. By the end of this guide you'll be able to add a sermon, edit a staff bio, change service times, post an announcement, and update the calendar — all in 5–10 clicks each.

**Who this is for:** Church staff who need to update the website — pastors, secretaries, ministry leaders. No coding required.
**What you'll accomplish:** Log into the website editor for the first time and learn what each section is for.
**You'll need first:**
- A free GitHub account (you'll create one in step 2 if you don't have one).
- A tech volunteer to invite you to the church's GitHub (the website's filing cabinet, explained below).
- The web address of your church's site, with `/admin/` on the end. For example, `https://yourchurch.org/admin/`.

> **Important:** Before your first login will work, the tech volunteer at your church has to add your GitHub username to the website. If you skip this, you'll see "Not authorized" when you try to log in. See **Common Mistakes** at the bottom.

## What is this thing I'm logging into?

You're about to use the **CMS** (Content Management System — a fancy term for "the website's editing screen"). Everything you change here ends up on the public website after a tech volunteer reviews it. You'll never see code, type any commands, or break anything that can't be undone.

## Steps

### 1. Open the editor in your browser

**Type** your church's web address followed by `/admin/` into your browser's address bar.

For example: `https://yourchurch.org/admin/`

**Press** Enter.

You should now see a screen with your church's logo and a single button labeled **Login with GitHub**.

![CMS login screen](/docs/screenshots/editor/getting-started-login.png)

### 2. Create a GitHub account (skip if you already have one)

GitHub is a free service that stores the website's files. The editor uses your GitHub login so the church doesn't have to manage a separate password for you.

**Open** a new browser tab.

**Go to** [github.com/signup](https://github.com/signup).

**Fill out** the form with your email, a password, and a username. Your username is how other people on the team will recognize you — use something like `jane-smith` or `jsmith-mvc`.

**Write down** your username. You'll send it to your tech volunteer.

> **Tip:** Use your work or personal email — not a shared church inbox. Your GitHub login is yours, not the church's.

### 3. Ask the tech volunteer to invite you

**Email or text** your tech volunteer with your GitHub username (for example, "My GitHub username is `@jane-smith`").

**Wait** for them to confirm they've added you. This usually takes a few minutes.

You'll receive an email from GitHub titled something like "You've been invited to..." — **click** the **View invitation** button in that email, then **click** **Accept invitation** on the GitHub page that opens.

> **Important:** If you skip the invitation email, you can still log in — but Decap (the editor) will say "Not authorized." Always accept GitHub invitations first.

### 4. Click Login with GitHub

**Go back** to the editor tab from step 1 (or reopen `https://yourchurch.org/admin/`).

**Click** the green **Login with GitHub** button.

You should now see GitHub's authorization screen.

![GitHub authorize screen](/docs/screenshots/editor/getting-started-authorize.png)

### 5. Authorize the editor

GitHub is asking your permission to let the website editor read and write the church's files.

**Click** the green **Authorize** button.

You should now be back on the editor and looking at the dashboard.

### 6. Tour the dashboard

The dashboard is the main screen you'll see every time you log in.

![CMS dashboard with collections sidebar](/docs/screenshots/editor/getting-started-dashboard.png)

On the **left sidebar** you'll see a list of **Collections** (categories of things you can edit):

- **Sermons** — every Sunday's message. You'll add a new entry here each week. See [Add a sermon](./02-add-a-sermon.md).
- **Ministries** — the church's ministries (Kids, Youth, Women's, and so on). Each has its own page.
- **Staff** — paid pastors and staff. See [Add a staff member](./04-add-a-staff-member.md).
- **Elders** — the church's elder board.
- **Site Settings** — church-wide information: name, address, phone, service times, social links. See [Update service times](./05-update-service-times.md).
- **What We Believe** — the doctrinal statements that appear on the Beliefs page.
- **Recurring Events** — the weekly and monthly events shown on the calendar. See [Add an event](./06-add-an-event.md).
- **Pages** — the "Our Story" prose on the About page. See [Edit a page](./03-edit-a-page.md).

At the **top right** you'll see a link labeled **Workflow**. That's where drafts and changes waiting for review show up. You'll learn more about this in [Publishing changes](./08-publishing-changes.md).

### 7. Click around (you can't break anything)

**Click** any collection in the left sidebar. **Click** any entry. **Look** at the form. **Click** **Cancel** or your browser's Back button.

Until you click **Save** or **Publish**, nothing leaves your screen. Explore freely.

## Common Mistakes

- **"Not authorized" error after clicking Login with GitHub.** The tech volunteer hasn't added your GitHub username yet, or you haven't accepted the invitation email. Email the volunteer your username, watch for the invitation email, and click **Accept invitation**.
- **You see GitHub but no church files.** You may have logged in with the wrong GitHub account. **Click** your avatar at the top right of GitHub, **sign out**, then sign back in with the account whose username you sent to the tech volunteer.
- **The page at `/admin/` shows "404 Not Found".** Check that you typed the URL correctly — the trailing slash matters (`/admin/` not `/admin`). If still broken, contact your tech volunteer.

## What's next?

- [Add a sermon](./02-add-a-sermon.md) — the most common task you'll do every week.
- [Publishing changes](./08-publishing-changes.md) — understand what happens when you click **Publish**.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Getting%20Started).*
