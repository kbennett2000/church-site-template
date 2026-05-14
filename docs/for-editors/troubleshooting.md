---
type: reference
audience: editor
time: as needed
---

# Editor troubleshooting

**Who this is for:** Editors who hit a snag and need a quick fix without calling the tech volunteer.
**What you'll accomplish:** Solve the most common problems editors run into, ordered by what people ask about most.
**You'll need first:** Nothing — this is a reference. Skim until you find your symptom.

> **Tip:** Can't find your problem here? Email your tech volunteer with three things: (1) what you were trying to do, (2) what happened instead, (3) a screenshot if you can. That's enough for them to help.

---

## "I can't log in"

### Symptom: "Not authorized" after signing in

**Cause:** Your email address hasn't been added to the CMS yet, or you signed in with a different email than the one your tech volunteer added.

**Fix:**
1. **Check** which email address you used to sign in.
2. **Contact** your tech volunteer and confirm they added that exact email address.
3. **Try again** — if you used Google to sign in, make sure it's the same Google account linked to that email.

### Symptom: I don't see the invitation email from TinaCloud

**Cause:** It may have landed in spam, or the invitation expired.

**Fix:** Check your spam folder for an email from TinaCloud (tina.io). If you can't find it, ask your tech volunteer to send a fresh invitation.

### Symptom: The sign-in page keeps refreshing with no error message

**Cause:** A cookie or session issue in your browser.

**Fix:** Try opening the editor in a private/incognito window, or clear your browser cookies for the church's site and try again.

---

## "I uploaded a photo and it looks weird"

### Symptom: The photo is blurry on the live site

**Cause:** Original photo was too small (under 1200 pixels wide).

**Fix:** Find a higher-resolution version and re-upload. See [Upload photos](./07-upload-photos.md) for recommended sizes.

### Symptom: A staff member's portrait is cropped weirdly — half their face is gone

**Cause:** The photo isn't square. Staff portraits are cropped to a circle, which only looks right with a roughly square photo.

**Fix:**
1. **Crop** the original photo to a square (focus on the face) using your computer's photo editor.
2. **Re-upload** through the staff entry.

### Symptom: Photo takes forever to upload, or fails

**Cause:** File is too big (over 5 MB).

**Fix:** Shrink the file at [squoosh.app](https://squoosh.app/) and try again.

### Symptom: Wrong photo on the published page

**Cause:** You picked the wrong photo from the media picker (easy to do when filenames look alike).

**Fix:** Open the entry, click the photo field, pick the right one from the picker, save, and republish.

---

## "I clicked Save but my change isn't live"

This is by far the most common question. See the dedicated section in [Publishing changes](./08-publishing-changes.md) — it walks through every possible cause. The short version:

1. **The site is still rebuilding.** Wait 2-3 minutes — Vercel rebuilds automatically after every save.
2. **Your browser is showing a cached version.** Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) to force a fresh load.
3. **You didn't click Save.** There's no separate Publish step — just click **Save** at the top of the entry.

---

## "I deleted something by mistake"

### Symptom: I clicked Delete on a sermon (or staff member, etc.) and it's gone

**Don't panic.** Nothing is ever truly gone in this system.

In TinaCMS, deletions commit immediately — there's no separate approval step. But your tech volunteer can restore any deleted entry from GitHub history with one command. Give them the name and approximate date of what was deleted and they can have it back in minutes.

As a last resort, you can also re-create the entry manually: click **New Sermon** (or whatever collection it was in) and fill in the original fields.

> **Tip:** If you remember the date and title of what you deleted, your tech volunteer can pull the exact original back from GitHub in seconds.

---

## "I got signed out unexpectedly"

### Symptom: I was working fine, then suddenly got an "unauthorized" error

**Cause:** Your session expired after a long browser absence, or cookies were cleared.

**Fix:**
1. **Click** **Log out** (if visible) or close and reopen the `/admin/` page.
2. **Sign in again** with Google or your email.

If that doesn't work, your access may have been removed. Email the tech volunteer.

---

## "The Save button doesn't seem to do anything"

### Symptom: I clicked Save but there's no confirmation or the change doesn't appear

**Cause:** Most likely a required field is empty, or the network request timed out.

**Fix:**
1. **Scroll** through the form and look for a red highlight or error message under any field.
2. **Fill in** any required field (Title is required on most entries).
3. **Click** Save again.

If there's no field error and it's still not saving, try refreshing the page and making the edit again.

---

---

## "I can't find an entry I created"

### Symptom: I added a sermon yesterday, but it's not in the Sermons list

**Cause:** Most likely you didn't click Save after filling out the form, so the entry was never committed.

**Fix:** Check the Sermons list — TinaCMS shows all entries directly in the collection list. If it's not there, the entry wasn't saved. Create it again and make sure to click **Save** at the top before navigating away.

---

## "Service time / phone number / address didn't update on the homepage"

### Symptom: I changed the service time in Site Settings, but the homepage still shows the old time

**Causes (in order of likelihood):**

1. **The site is still rebuilding.** Wait 2-3 minutes after saving.
2. **Your browser is showing the cached version.** Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).
3. **You edited the wrong field.** Some pages have headlines that mention the time as part of a sentence — those are edited separately. Double-check the **Sunday Service** section in Site Settings.

---

## "I get a 'conflict' message when I try to save"

### Symptom: The editor says my changes conflict with someone else's

**Cause:** Someone else edited the same entry while you had it open.

**Fix:**
1. **Click** **Discard** to throw away your changes.
2. **Re-open** the entry — it'll show the other person's latest version.
3. **Re-apply** your edits on top.
4. **Save** and publish.

> **Tip:** For shared content (Site Settings, in particular), it's a good idea to coordinate with other editors so you're not both editing at the same time.

---

## "Something else is broken"

Email or text your tech volunteer. Include:

- What you were trying to do.
- What happened instead.
- A screenshot if you can take one.
- The URL of the editor page you were on.

That's enough for them to help.

## What's next?

- [Getting started](./01-getting-started.md) — refresher on the basics.
- [Publishing changes](./08-publishing-changes.md) — understand the publish flow.
- [Glossary](./glossary.md) — definitions of the technical-sounding words.

## Stuck?

- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Editor%20Troubleshooting).*
