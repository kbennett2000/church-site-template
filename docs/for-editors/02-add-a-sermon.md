---
type: how-to
audience: editor
time: 10 minutes
---

# Add a sermon

**Who this is for:** Whoever is responsible for posting the Sunday sermon to the website each week.
**What you'll accomplish:** Add a complete sermon entry — title, speaker, video, and description — and publish it.
**You'll need first:**
- Logged in to the editor at `/admin/`. See [Getting started](./01-getting-started.md).
- The sermon's YouTube link (if you've uploaded the video).
- The sermon's title, speaker name, date, and Scripture reference.
- (Optional) The MP3 audio file URL, the pastor's sermon notes or outline (to type or paste in), and a thumbnail image.

## Steps

### 1. Open the Sermons collection

**Click** **Sermons** in the left sidebar.

You should now see a list of all past sermons. By default the list is sorted alphabetically by title — if you'd rather see the newest sermon at the top (most people do), see [Seeing your newest sermons first](#seeing-your-newest-sermons-first) below. You only need to set that once per browser.

![Sermons collection list](/docs/screenshots/editor/add-a-sermon-list.png)

### 2. Click New Sermon

**Click** the **New Sermon** button in the top right of the sermon list.

You should now see a blank sermon form with empty fields.

![New sermon form](/docs/screenshots/editor/add-a-sermon-new-form.png)

### 3. Fill in Sermon Title

**Type** the title the pastor gave the sermon. For example: `The Weight of a Quiet Faithfulness`.

This is the headline visitors see on the sermon card and on the "latest sermon" section of the homepage.

### 4. Pick Date Preached

**Click** the calendar icon next to **Date Preached**.

**Select** the Sunday this sermon was preached.

> **Warning:** Don't type the date by hand. Always use the date picker — it stores the date in the format the website needs.

### 5. Fill in Speaker

**Type** the speaker's full name. For example: `Pastor Alex Morgan`.

For guest speakers, use whatever name they'd want printed.

### 6. Fill in Series (optional)

**Type** the sermon series name if this sermon is part of one. For example: `Walking Through Ruth` or `2026: The Year of Hope`.

**If this sermon isn't part of a series, leave the field blank.** The sermon still appears in the sermon archive at `/watch` exactly like any other sermon — nothing is hidden for lacking a series. The only difference is it won't be grouped on the Browse by Series page.

**How series grouping works:** filling in a series name puts every sermon with that same name onto a "Browse by Series" page at `/watch/series`. Visitors can click a series to see all its sermons in order. The page only appears when at least one sermon has a series name; churches that don't use series simply won't see the link.

**Consistency matters when you do use it:**
- ✅ **Small casing or whitespace differences are forgiven.** `Easter 2026`, `easter 2026`, and ` Easter 2026 ` all group together. The display name uses the most-recent sermon's casing, so cleaning up casing later improves what visitors see.
- ❌ **Different words or punctuation make separate groups.** `Walking Through Ruth` and `Walking in Ruth` are two different series. So are `Hope!` and `Hope?` (different punctuation = different series).

If you don't know whether a sermon is part of a series, leave it blank — you (or another editor) can always fill it in later.

### 7. Fill in Scripture Reference

**Type** the passage. For example: `Ruth 2:1-23` or `Matthew 5:1-12`.

Use a hyphen for the verse range. Use a colon between chapter and verse.

### 8. Fill in Book of the Bible

**Type** just the book name. For example: `Ruth` or `Matthew` or `Psalms`.

> **Tip:** Visitors can filter sermons by book on the watch page, so spelling matters. Use the standard Bible book name (not abbreviations like "Mt" or "Matt").

### 9. Find and paste the YouTube Video ID

This is the part most people get stuck on, so go slowly.

**Open** the sermon's YouTube video in a new tab.

**Look** at the address bar. The URL looks like one of these:

- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://youtu.be/dQw4w9WgXcQ`
- `https://www.youtube.com/live/dQw4w9WgXcQ?feature=share`

The **Video ID** is the 11-character code after `v=` (or after `youtu.be/`, or after `/live/`).

In all three examples above, the ID is `dQw4w9WgXcQ`.

**Copy** just that ID (not the whole URL).

**Paste** it into the **YouTube Video ID** field in the editor.

![YouTube URL with ID highlighted](/docs/screenshots/editor/add-a-sermon-youtube-id.png)

> **Common Mistake:** People paste the full URL (`https://www.youtube.com/watch?v=dQw4w9WgXcQ`) instead of just the ID. If the embedded video doesn't appear on the published page, this is almost always why. Edit the sermon and paste just the 11-character ID.

If the video hasn't been uploaded yet, **leave** this field blank. You can come back and fill it in later.

### 10. Fill in Audio File URL (optional)

If you have a direct link to an MP3 of the sermon, **paste** it into **Audio File URL**.

If you don't, **leave** the default `#` in the field. The audio player will be hidden on the sermon page until a real URL is added.

### 11. Fill in Sermon Notes / Outline (optional)

If the pastor has notes or an outline for the sermon, you can put them directly on the sermon page — no separate PDF, no external link.

**Find** the **Sermon Notes / Outline** field. It's a rich-text editor — like a small word processor with buttons for headings, bold, italics, and bulleted/numbered lists.

You have two ways to fill it in:

- **Type the notes in directly**, using the toolbar buttons to format headings, bold key points, or build a list.
- **Paste from Google Docs or Word.** Copy the notes from the original document, then paste into the field. Most basic formatting — headings, bold, italics, lists — carries over correctly.

> **Tip:** Heavy formatting (tables, footnotes, custom fonts, colored text, embedded images) may not transfer cleanly. After you paste, scroll through the field and check that headings still look like headings, lists still look like lists, and nothing looks broken. If anything is off, retype that part by hand.

If there are no notes for this sermon, **leave** the field blank. The sermon page will simply omit the notes section — no empty heading shown.

> **Where this appears:** Notes show up inline on the individual sermon page (below the video and description), inside a "Sermon notes" section. They are not downloadable — visitors read them right on the site.

### 12. Upload a Thumbnail Image (optional)

A thumbnail is a picture that shows up on the sermon card. If you skip this, the site uses a default sanctuary photo.

**Click** the **Choose an image** button next to **Thumbnail Image**.

**Click** **Upload**.

**Pick** a wide photo (about twice as wide as it is tall — for example, 1600 by 900 pixels). See [Upload photos](./07-upload-photos.md) for what makes a good image.

**Click** **Choose Selected**.

### 13. Fill in Description

**Type** one or two sentences that describe what the sermon is about. This shows up underneath the title on the sermon card.

For example: *"Boaz steps onto the page as a picture of faithful, quiet kindness — and a glimpse of the Redeemer to come."*

### 14. Save

**Click** the **Save** button at the top of the form.

You should now see a confirmation that the change was saved. TinaCMS commits (saves a snapshot of) the change directly to the website — no tech volunteer approval needed.

Wait about 2-3 minutes, then open the public site. The sermon will appear on the watch page and update the "latest sermon" section on the homepage.

> **Tip:** If it doesn't appear after 3 minutes, try a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac) in case your browser is showing a cached version.

## Seeing your newest sermons first

When you open **Sermons**, the list is sorted alphabetically by title — so `A New Hope` shows up before `Walking in Faith, Part 6`, even if the new-hope sermon was preached two years ago. For weekly upkeep, you'll almost always want the newest sermon at the top instead.

To switch the list to newest-first:

1. **Click** **Sermons** in the left sidebar to open the list.
2. **Look** for the sort control at the top of the list (it lets you pick which field to sort by).
3. **Choose** the **Date** field, and set the order to **descending** (newest at the top).

That's it. **Your browser remembers this choice**, so you only need to set it once on each computer or browser you use. The next time you open Sermons, it'll already be sorted newest-first.

A small caveat, in case it ever surprises you: this is a *per-browser* preference, not a setting that lives on the site. If you sign in on a different computer, switch to a different browser (Chrome at home, Edge at the office), or open the editor in a private/incognito window, the list will start back at alphabetical-by-title until you set the sort there too. Setting it again takes about five seconds.

## Common Mistakes

- **The embedded video doesn't show up after publishing.** You pasted the whole URL instead of just the 11-character ID. Edit the sermon, fix the **YouTube Video ID** field, and publish the fix.
- **The date is wrong on the published page.** You typed the date instead of using the date picker. Edit and re-pick the date using the calendar.
- **The sermon doesn't appear under the right series.** Series names group together when they match after ignoring casing and extra spaces — so `Easter 2026` and `easter 2026` are the same series. But different words or punctuation create separate groups: `Walking Through Ruth` and `Walking in Ruth` are two different series, and so are `Hope!` and `Hope?`. If sermons are landing in unexpected groups, edit the older sermons to match the spelling and punctuation of the newest one.
- **A sermon I left blank doesn't show on the Browse by Series page.** That's expected — sermons without a series aren't grouped anywhere. They still appear normally in the main sermon archive at `/watch`.
- **The sermon doesn't appear after saving.** The site takes 2-3 minutes to rebuild. If it still isn't showing after 5 minutes, try a hard refresh (Ctrl+Shift+R / Cmd+Shift+R).

## What's next?

- [Upload photos](./07-upload-photos.md) — how to make sermon thumbnails look good.
- [Publishing changes](./08-publishing-changes.md) — what actually happens after you click **Publish**.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Add%20a%20Sermon).*
