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

### Draft

Your work-in-progress on an entry — saved, but not visible to the public yet. Drafts are private to you. You can come back tomorrow and pick up where you left off. They never appear on the live site until you publish.

---

### Publish

The button you click when an entry is ready to go to the public site. Clicking **Publish → Publish now** sends your change to a tech volunteer for a quick review. Once they approve, it goes live within a few minutes.

---

### Repository (or "repo")

The church website's **filing cabinet on the internet**. It's stored on a service called GitHub. All the site's files live there — the words, the photos, the page templates. When you publish a change, the new version of the file gets added to the repository.

You don't need to look at the repository directly. The editor handles it for you.

---

### Commit

A **snapshot of one change** to the repository. When you click Publish, the editor creates a commit that says "this is the new version of this sermon." Commits are how the repository remembers history — every change you've ever made is preserved as a commit.

---

### Pull request (or "PR")

A **change ticket**. When you publish an edit, the editor doesn't just slam the change into the live site — it opens a pull request that says "here's a proposed change, please review." A tech volunteer looks at the change, then clicks **Merge** to approve it.

Why "pull request"? It's a GitHub word. Don't worry about it. Just think "change ticket."

---

### Merge

When the tech volunteer approves your pull request, they **merge** it — meaning the change officially joins the main version of the site. This triggers the site to rebuild and go live.

---

### Deploy

To **publish a new version of the website to the internet** so everyone can see it. After your change is merged, the site is automatically deployed — rebuilt and pushed live — within a couple of minutes. You don't deploy manually; it just happens.

---

### Workflow

The link at the top right of the editor that shows all your in-progress and pending changes. **Drafts** (still being worked on) and **In Review** entries (waiting for the tech volunteer to approve) both show up here.

---

### Markdown

A simple way to write formatted text using symbols instead of buttons — for example, `**bold**` for **bold** or `# Heading` for a heading. **You don't need to learn this.** The editor's toolbar handles formatting for you. Markdown is only mentioned in case you see the word in another doc.

---

### GitHub

The free online service that hosts the church's website files (in a repository). You log into the CMS with your GitHub account so the church doesn't have to manage a separate password for you.

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
