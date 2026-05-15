---
type: reference
audience: editor
time: 5 minutes
---

# Editor glossary

**Who this is for:** Editors who keep running into words like "commit," "pull request," and "deploy" and want plain-English definitions.
**What you'll accomplish:** Understand the handful of technical-sounding words that show up in the editor and the related docs.
**You'll need first:** Nothing.

---

### CMS

Short for **Content Management System**. The editor screen you log into at `/admin/`. Where you add sermons, edit staff, and change service times — without touching code.

---

### Collection

A category of things you can edit in the CMS. **Sermons**, **Ministries**, **Staff**, **Site Settings** — each one is a collection. They show up in the left sidebar.

---

### Field

One blank to fill in inside an entry. The **Sermon Title** is a field. The **Date Preached** is a field. A long form is just a bunch of fields stacked together.

---

### Save

The button you click when an entry is ready to go live. In TinaCMS, clicking **Save** commits your change directly to the site — there is no separate Publish step and no review queue. Vercel picks up the change and the site rebuilds within 2-3 minutes.

---

### Repository (or "repo")

The church website's **filing cabinet on the internet**. It's stored on a service called GitHub. All the site's files live there — the words, the photos, the page templates. When you publish a change, the new version of the file gets added to the repository.

You don't need to look at the repository directly. The editor handles it for you.

---

### Commit

A **snapshot of one change** to the repository. When you click Publish, the editor creates a commit that says "this is the new version of this sermon." Commits are how the repository remembers history — every change you've ever made is preserved as a commit.

---

### Pull request (or "PR")

A **developer concept** — a proposed code change that gets reviewed before being merged. As an editor, you don't create pull requests. When you click Save in TinaCMS, the change goes directly to the site without any review step. Pull requests are only relevant if a developer is making changes to the site's code.

---

### Deploy

To **publish a new version of the website to the internet** so everyone can see it. After your change is merged, the site is automatically deployed — rebuilt and pushed live — within a couple of minutes. You don't deploy manually; it just happens.

---


### Markdown

A simple way to write formatted text using symbols instead of buttons — for example, `**bold**` for **bold** or `# Heading` for a heading. **You don't need to learn this.** The editor's toolbar handles formatting for you. Markdown is only mentioned in case you see the word in another doc.

---

### GitHub

The free online service that hosts the church's website files (in a repository). **Editors do not need a GitHub account.** You sign in to the CMS through TinaCloud using your Google account or email address. GitHub is where the site's files are stored behind the scenes — you never interact with it directly.

---

### Vercel

The service that runs the actual website on the internet. When you click **Save** in the editor, Vercel notices, rebuilds the site, and publishes the new version — usually within 2-3 minutes. **You never log in to Vercel as an editor.** Your tech volunteer set it up once and you don't need to think about it.

---

### Slug

The short, lowercase, hyphenated version of a name used in a web address. The slug for "Wednesday Bible Study" might be `wednesday-bible-study`. You'll only see this word if you're managing reading plans or custom pages, where slugs become part of the page's URL. The rule of thumb: lowercase letters, numbers, and hyphens only.

---

### Double opt-in

A two-step sign-up process for email subscribers. After someone enters their email, they get a confirmation email with a link they have to click before they're added to the list. This proves the email address is real and that the person actually wants the emails — it's the gold standard for email newsletters and the law in many places.

---

### RSVP

Short for "please respond" (from French). On the church site, **RSVP** means an event has a button visitors can click to say they're coming. Useful for potlucks, breakfasts, and other events where you need a headcount. You turn RSVPs on or off per event when you create it.

---

### Environment variable

A configuration setting (like a password or an API key) that the website uses behind the scenes. Things like `RESEND_API_KEY` or `ADMIN_PASSWORD` are environment variables. **Editors don't touch these** — they live in Vercel and are managed by your tech volunteer. They're mentioned here because you might see the term in another doc and wonder.

---

### Cron

An automated job that runs on a schedule — every hour, every day at 8 AM, every Monday morning, etc. The daily devotional emails are sent by a cron job. The weekly digest is sent by a cron job. You don't set up cron jobs as an editor — your tech volunteer did this during setup. The word just means "scheduled task."

---

### YAML / frontmatter

**Frontmatter** is the block of settings at the top of a content file — for example, a sermon's title, date, and speaker. It's written in **YAML**, a format that's picky about indentation and colons. As an editor working through the CMS, **you don't write YAML directly** — the form fields handle it for you. The terms only show up if a doc is talking about advanced editing or if your tech volunteer mentions them.

---

### Feature Flags

Settings in **Site Settings** that turn major features of the site on or off — like whether the Daily Devotionals page exists, or whether the Weekly Digest email is enabled. If a doc tells you to turn on a feature flag, look for **Site Settings → Features** in the CMS.

---

## What's next?

- [Getting started](./01-getting-started.md) — the first-time login walkthrough.
- [Publishing changes](./08-publishing-changes.md) — what happens between **Publish** and "live on the site."

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Editor%20Glossary).*
