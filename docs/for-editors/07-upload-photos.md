---
type: reference
audience: editor
time: 6 minutes
---

# Upload photos

**Who this is for:** Anyone adding a photo to the website — staff portraits, ministry gallery photos, sermon thumbnails, or hero images.
**What you'll accomplish:** Understand which photo size belongs where, what makes a photo look good, and how to upload one through the editor.
**You'll need first:**
- Logged in to the editor at `/admin/`. See [Getting started](./01-getting-started.md).
- The photo on your computer or phone.

## What makes a good photo for this site

The website looks best when photos are:

- **Sharp and well-lit** — no blurry phone shots or photos taken in the dark.
- **Roughly the right shape** for where they'll appear (see the table below).
- **Big enough** — at least 1200 pixels wide on the long edge, so they don't look fuzzy on large screens.
- **Not too big** — under 2 megabytes (MB). Huge files make the site slow.
- **People-focused for ministry photos** — show faces, hands, kids, community. Avoid empty rooms.

## Recommended sizes by photo type

| Where it appears | Best size | Shape | Notes |
| --- | --- | --- | --- |
| Homepage hero (big top photo) | 1920 × 1080 pixels | Wide rectangle (16:9) | Should look good with text overlaid. |
| Ministry hero image | 1920 × 1080 pixels | Wide rectangle (16:9) | Same as homepage hero. |
| Staff or elder portrait | 800 × 800 pixels | Square (1:1) | Cropped to a circle on the site. Center the face. |
| Ministry leader photo | 800 × 800 pixels | Square (1:1) | Same as staff portrait. |
| Ministry gallery photo | 1200 × 900 pixels | Slight rectangle (4:3) | Variety is good — close-ups, wide shots, action shots. |
| Sermon thumbnail | 1600 × 900 pixels | Wide rectangle (16:9) | Often a still from the sermon video. |

> **Tip:** You don't need to match these sizes exactly. Aim for the shape, and the site handles the rest.

## JPG vs PNG: which to use

- **JPG** (also called JPEG) — for photographs of people, places, events. Smaller files, faster pages.
- **PNG** — for logos, screenshots, or anything with sharp edges or transparent backgrounds.

For 99% of what you upload, **JPG** is the right answer.

## How to resize a photo before uploading

If your photo is over 2 MB or much bigger than the recommended size, you can shrink it.

### Easiest tool: your computer's built-in photo editor

- **Mac:** Open the photo in **Preview**, choose **Tools → Adjust Size**, change the width to one of the values in the table above, save.
- **Windows:** Open the photo in **Paint** or **Photos**, choose **Resize**, change the width, save.

### Free online options

- [squoosh.app](https://squoosh.app/) — drag a photo in, drag the slider to shrink it, download the smaller version. Great for shrinking huge phone photos.
- [tinypng.com](https://tinypng.com/) — drag photos in to shrink them without changing the size.

## How to upload through the editor

The upload process is the same for every kind of photo on the site.

### 1. Find the photo field

Open the entry you're editing (sermon, staff member, ministry, etc.).

**Find** the photo field — it has a placeholder image or a button labeled **Choose an image**.

### 2. Open the picker

**Click** the **Choose an image** button.

A picker window opens showing all the photos already uploaded to the site, with an **Upload** button at the top.

![Media picker](/docs/screenshots/editor/upload-photos-picker.png)

### 3. Upload a new photo

**Click** the **Upload** button.

**Select** the photo file from your computer.

The new photo appears at the top of the picker window with a check mark on it.

You should now see the photo highlighted in the picker.

### 4. Choose it

**Click** the **Choose Selected** button at the bottom right of the picker.

The picker closes and you should now see a preview of the photo next to the field.

### 5. Save

**Click** **Save** at the top.

TinaCMS commits the change directly to the site. Within 2-3 minutes, the photo will appear on the site.

## Where the files go

Every photo you upload is stored in the website's `images/uploads/` folder. You don't need to worry about this — but if a tech volunteer asks "where is the file?", that's where.

## Common Mistakes

- **Photo looks blurry on the published site.** The original was too small. Re-upload using a photo at least 1200 pixels wide.
- **Staff portrait shows mostly forehead or chin.** The photo isn't square. Crop it to a square before uploading, with the face centered.
- **Photo upload takes forever or fails.** The file is too big (over 5 MB). Shrink it with one of the tools listed above.
- **The same photo shows up twice in the picker.** That's fine — the CMS won't overwrite a file with the same name. The newest upload appears first.
- **The wrong photo shows up on the published page.** Open the entry, click the photo field, pick the right one from the picker, and re-publish.

## What's next?

- [Add a sermon](./02-add-a-sermon.md) — using a sermon thumbnail.
- [Add a staff member](./04-add-a-staff-member.md) — using a portrait photo.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Upload%20Photos).*
