---
type: how-to
audience: editor
time: 5 minutes
---

# Edit the "Our Story" page

**Who this is for:** Anyone updating the long-form prose on the About page — the church's history, mission, or founding story.
**What you'll accomplish:** Edit the "Our Story" content using a word-processor-style editor and publish your changes.
**You'll need first:**
- Logged in to the editor at `/admin/`. See [Getting started](./01-getting-started.md).
- The new or updated story text (a draft in your head or in a document).

## Steps

### 1. Open the Pages collection

**Click** **Pages** in the left sidebar.

You should now see a short list with one entry: **Our Story**.

![Pages collection list](/docs/screenshots/editor/edit-a-page-list.png)

### 2. Click Our Story

**Click** the **Our Story** row.

You should now see the page form with two fields: **Page Title** and **Story**.

### 3. Update the title (rarely needed)

The **Page Title** is the heading at the top of the About page. Usually it stays as "Our Story".

If you want to change it, **click** the field and **type** the new title.

### 4. Edit the story with the toolbar

The **Story** field is a WYSIWYG editor — "What You See Is What You Get." It works like Microsoft Word or Google Docs. You don't have to learn any special codes.

![WYSIWYG editor toolbar](/docs/screenshots/editor/edit-a-page-toolbar.png)

The toolbar across the top lets you:

- **Bold** — select text and click the **B** button (or press Ctrl+B on Windows, Cmd+B on Mac).
- **Italic** — the **I** button (or Ctrl+I / Cmd+I).
- **Heading** — click the **H** dropdown to add a section heading. Use **Heading 2** for the biggest section breaks, **Heading 3** for sub-sections. Don't use **Heading 1** — that's reserved for the page title.
- **Bulleted list** — the three-line button.
- **Numbered list** — the 1-2-3 button.
- **Link** — select some words, click the chain icon, paste a URL.
- **Quote** — click the quotation-mark button to indent a paragraph as a blockquote.

> **Tip:** If you've written the story in Microsoft Word or Google Docs, you can copy it and paste it directly into the editor. Headings, bold, and italics usually come along correctly.

### 5. Add a paragraph

**Click** at the end of a paragraph.

**Press** Enter twice to leave a blank line.

**Type** your new paragraph.

You should now see your new text in the editor, formatted the same way as the rest of the page.

### 6. Add a section heading

**Click** where you want the new section to start.

**Press** Enter to make a new line.

**Click** the **H** dropdown in the toolbar.

**Choose** **Heading 2**.

**Type** the heading text. For example: `Where we are today`.

**Press** Enter to start writing the section's first paragraph.

### 7. Switch to source view (rarely needed)

Beneath the editor, there's a **Toggle Preview** button. **Click** it to see a preview of how the page will look once published.

There's also a small text-mode toggle for editors who want to write in Markdown (a simple text-with-symbols format). Don't worry about this — the toolbar handles everything for you.

### 8. Save

**Click** the **Save** button at the top.

TinaCMS commits (saves a snapshot of) your change directly to the site. Within 2-3 minutes, Vercel rebuilds and the updated About page appears on the public site.

> **Tip:** If it doesn't appear after 3 minutes, press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) to force a fresh load.

## Common Mistakes

- **Paragraphs are all jammed together after publishing.** You didn't leave a blank line between paragraphs in the editor. Press Enter twice between paragraphs (not once).
- **A heading is huge and out of place.** You used **Heading 1** by accident. **Click** anywhere in that heading, then change the dropdown to **Heading 2** or **Heading 3**.
- **Pasting from Word adds weird extra spaces.** Word sometimes adds invisible characters. Try pasting with Ctrl+Shift+V (Windows) or Cmd+Shift+V (Mac) — this pastes as plain text.

## What's next?

- [Upload photos](./07-upload-photos.md) — add images to the page (paste them into the editor like text).
- [Publishing changes](./08-publishing-changes.md) — what happens after you click **Publish**.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Edit%20a%20Page).*
