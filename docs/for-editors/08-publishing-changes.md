---
type: explanation
audience: editor
time: 5 minutes
---

# What happens when you click Save

**Who this is for:** Every editor on the team. Read this once and you'll understand the whole publishing flow.
**What you'll accomplish:** Understand exactly what the **Save** button does and what to do when "I saved but nothing changed on the site."
**You'll need first:** Nothing — this is a good doc to read before you publish for the first time.

## The big picture

Here's the entire journey of a change, from you clicking **Save** to it appearing on the public site:

1. **You** click **Save** in the editor.
2. **The editor** sends your change directly to the website's files on GitHub.
3. **The website** detects the change and automatically rebuilds itself.
4. **The new version** goes live for everyone to see.

The whole process usually takes 2-3 minutes from start to finish.

```
You click Save        GitHub updated        Site rebuilds        Live!
      │                      │                    │                │
      ▼                      ▼                    ▼                ▼
  (instant)             (a few seconds)        (2 min)        (immediate)
```

## No approval step needed

Unlike some website tools, this CMS publishes changes **directly** without a tech volunteer having to approve each one. When you click **Save**:

- Your change is committed to the website immediately.
- Vercel (the hosting service) detects the change and rebuilds the site.
- The updated page is live within about 2 minutes.

This is by design. The tech volunteer set up the system — they don't need to babysit every update.

> **Tip:** If your change is to something sensitive (like the service time), double-check your work before saving. Changes go live quickly and automatically.

## What you'll see right after clicking Save

A brief confirmation appears near the **Save** button — it's small and disappears after a moment. After saving, **the screen stays on the same form you were editing**. That's expected and correct: TinaCMS doesn't bounce you back to a list view or "done" screen. Nothing is wrong; your change has already been sent.

When you're ready to edit something else, **use the menu on the left** to move to another section. Avoid the browser's **back** button while in the editor — it doesn't always land somewhere useful, and the left-side menu is the reliable way to move around.

## Removing one entry from a list

Some screens hold a list of entries — for example, **Site Settings → Services** has one entry per service time, and a ministry's **Meeting Times** holds one entry per meeting. Each entry in those lists shows a descriptive label (for example, `Sunday • 10:00 AM • Sunday Worship` rather than a generic `Services Item`) so you can tell them apart without opening them.

To remove a single entry:

1. **Read the label first** to confirm you're about to remove the right one. This is the main safety check — the labels exist specifically so you can recognize an entry before deleting it.
2. **Click** the entry to expand it.
3. **Click** the small remove/delete control on that entry (usually a trash icon or "Remove" button at the corner of the expanded item).
4. **Click** **Save** at the top of the form.

If the label doesn't match what you intended to remove, pause and double-check before deleting.

## How long does it take?

| Step | Typical time |
| --- | --- |
| You click Save | Instant |
| Editor commits to GitHub | A few seconds |
| Vercel detects the change | ~30 seconds |
| Site rebuilds | 1-2 minutes |
| Live on the public site | Immediately after rebuild |

**Total: about 2-3 minutes** from save to live.

## "I clicked Save but nothing changed on the site"

This is the most common confusion. Here are the possible causes:

### 1. The site is still rebuilding

Wait a full 2-3 minutes. Rebuilds take time — the site is regenerating all its pages from scratch.

### 2. Your browser is showing a cached (old) version

Browsers remember old pages to load them faster. To force a fresh load:

- **Windows:** Press Ctrl+Shift+R.
- **Mac:** Press Cmd+Shift+R.

### 3. You navigated away before the save completed

If you closed the tab or navigated away immediately after clicking **Save**, the save may not have finished. Open the entry again and check whether your change is there. If not, re-enter it and save again — wait for the confirmation message before navigating away.

### 4. You edited a field but didn't click Save

The **Save** button must be clicked explicitly — editing a field alone doesn't save. Look for the blue **Save** button at the top of the form.

### 5. The build failed

Very rare, but if the site has a problem, the rebuild won't finish. If the site looks completely unchanged after 5 minutes, contact your tech volunteer. They can check the build logs and fix the underlying issue.

## "Can I undo a save?"

Yes, but the easy path depends on how quickly you catch it.

**Easiest:** Open the entry you just saved, make the correction, and save again. The updated version is live within a couple of minutes. The "undo" is just publishing a corrected version.

**If it's more complex** (like "everything I did today was a mistake — restore yesterday's version"): ask your tech volunteer. They can revert to any previous state using GitHub's history. Nothing is ever truly deleted.

## What's next?

- [Add a sermon](./02-add-a-sermon.md) — practice the save flow with the most common task.
- [Glossary](./glossary.md) — definitions of words like "commit" and "rebuild."

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Publishing%20Changes).*
