---
type: explanation
audience: editor
time: 7 minutes
---

# What happens when you click Publish

**Who this is for:** Every editor on the team. Read this once and you'll understand the whole publishing flow.
**What you'll accomplish:** Understand exactly what the **Publish** button does, why there's a review step, and what to do when "I clicked Publish but nothing happened."
**You'll need first:** Nothing — this is a good doc to read before you publish for the first time.

## The big picture

Here's the entire journey of a change, from you clicking **Publish** to it appearing on the public site:

1. **You** click **Publish** in the editor.
2. **The editor** sends your change to GitHub as a "change ticket" (a pull request).
3. **A tech volunteer** gets an email, looks at the change, and clicks **Merge**.
4. **The website** rebuilds itself with your edits.
5. **The new version** goes live for everyone to see.

The whole process usually takes 2-5 minutes from start to finish.

```
You click Publish        Tech volunteer reviews        Site rebuilds        Live!
       │                          │                          │                │
       ▼                          ▼                          ▼                ▼
   (instant)              (5-30 min later)              (2 min)         (immediate)
```

## Why there's a review step

The website doesn't go live the second you click **Publish**. A tech volunteer at your church has to glance at the change and approve it first. Two reasons:

1. **Mistakes happen.** A typo in the service time, a broken sermon link, or a wrong date on a major event would be embarrassing — and hard to spot once it's live. Two pairs of eyes catch what one misses.
2. **It gives one person a single dashboard** where they can see what's changing on the site. They don't need to micromanage; they just glance at the change and click Merge.

The review step is not a permission check — it's a sanity check. Volunteers don't critique what you write. They check for accidental damage (deleted everything by mistake, pasted a wall of garbled text, etc.).

## What "Publish" actually does

Behind the scenes, here's what happens the moment you click **Publish → Publish now**:

1. The editor saves your changes as a **commit** — a snapshot of what you changed.
2. The editor sends that snapshot to GitHub (the church's online filing cabinet).
3. GitHub opens a **pull request** — think of it as a "please merge this change" ticket.
4. The tech volunteer gets an email notification.

> **Tip:** "Commit," "pull request," "merge" — these are all GitHub words. You don't need to know them. The editor handles all of it for you.

## The four states a change can be in

Look for the **Status** dropdown at the top of any edit form. A change is in exactly one of these states:

- **Draft** — you're still working on it. Nobody else can see it.
- **In Review** — you've marked it Ready for Review and clicked Publish. The tech volunteer can see it but hasn't approved it yet.
- **Ready** — the tech volunteer reviewed and approved it; it's about to go live.
- **Published** — the change is on the live site.

You'll also see all your in-progress changes (Drafts and In Review) under the **Workflow** link at the top right of the editor.

## How long does it take?

| Step | Typical time |
| --- | --- |
| You click Publish | Instant |
| Editor creates the pull request | A few seconds |
| Tech volunteer gets notified | A few seconds (email) |
| Tech volunteer reviews | 5 minutes – 24 hours (depends on the volunteer's availability) |
| Site rebuilds after merge | 1-3 minutes |
| Live on the public site | Immediately after rebuild |

**If your change is urgent** (like fixing a typo in the service time before Sunday morning), **text or call the tech volunteer directly** so they prioritize the review. The email notification works for routine changes but doesn't shout "URGENT."

## "I clicked Publish but nothing changed on the site"

This is the most common confusion. Here are the possible reasons:

### 1. The tech volunteer hasn't approved it yet

Most common. Wait a bit, or text them if it's urgent.

To check: **Click** **Workflow** at the top right. If your change is listed under **In Review**, it's waiting on the volunteer. If it's listed under **Ready**, it should be live within a couple minutes.

### 2. The site is still rebuilding

After the volunteer merges, the site takes 1-3 minutes to rebuild. Refresh the public page after a couple of minutes.

### 3. Your browser is showing a cached (old) version

Browsers remember old pages to load them faster. To force a fresh load:

- **Windows:** Press Ctrl+Shift+R.
- **Mac:** Press Cmd+Shift+R.

### 4. You clicked Save but not Publish

**Click** the **Status** dropdown at the top of the entry. If it says **Draft**, the change is sitting in your drafts. Change it to **Ready for Review** and click **Publish → Publish now**.

### 5. The publish failed silently

Rare, but possible. Check the **Workflow** tab — if your change isn't listed there at all, the publish didn't go through. Try again, or contact the tech volunteer.

## "Can I undo a publish?"

Yes. Two ways:

- **If the change hasn't been merged yet:** Find it in the **Workflow** tab and either edit it again or delete it.
- **If the change is already live:** Open the same entry, fix it, save, mark ready for review, and publish the fix. The old version is preserved in GitHub's history — nothing is ever truly lost — but for the public site, the way to "undo" is "publish a corrected version."

For a true rollback (like "everything I did today was a mistake — restore yesterday's version"), ask your tech volunteer. They can revert to any previous state.

## Why drafts are your friend

You can save a draft at any time — even if it's half-done — and come back later. Drafts:

- Are private to you.
- Don't appear on the public site.
- Don't trigger a review.
- Survive logging out, closing the browser, or going on vacation.

If you're working on a Sunday sermon entry at midnight and you're not sure about the description, save it as a draft. Come back tomorrow. Polish it. Then publish.

## What's next?

- [Add a sermon](./02-add-a-sermon.md) — practice the publish flow with the most common task.
- [Glossary](./glossary.md) — definitions of words like "commit," "pull request," and "draft."

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Publishing%20Changes).*
