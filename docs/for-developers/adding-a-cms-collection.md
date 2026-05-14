---
type: tutorial
audience: developer
time: 25 minutes
---

# Adding a CMS collection

**Who this is for:** Developers adding a new editable content type (e.g. "Blog posts") that editors will manage through TinaCMS.
**What you'll accomplish:** A new collection in the CMS sidebar, backed by Markdown files in `/content/`, with a TypeScript loader that pages can consume.
**You'll need first:**
- Project running locally (`npm run cms`).
- Familiarity with the content model. See [content-model.md](./content-model.md).

We'll walk through adding a **Blog posts** collection.

---

## The four-step pattern

For every new collection:

1. **Decide the schema** — what fields does each entry have?
2. **Create** the content folder + a seed file.
3. **Define** the TypeScript type in `lib/<type>.ts` and the loader in `content/<type>.ts`.
4. **Add** the collection to `tina/config.ts`.

Then restart `npm run cms` to pick up the schema change and test in the CMS.

> **Important:** Loaders go in `content/`, not `lib/`. `lib/` holds only the type definition. The split exists so dev-mode hot-reload works correctly — see [architecture.md](./architecture.md#loader-pattern). Always export loaders as **functions** (`getBlogPosts()`), never top-level `const`.

---

## Steps

### 1. Decide the schema

Write down the fields and which are required. For a blog post:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | Yes | Post headline |
| `date` | datetime | Yes | Publish date |
| `author` | string | Yes | Author name |
| `excerpt` | string | No | Short summary for cards |
| `body` | rich-text | Yes | Markdown body (`isBody: true`) |

### 2. Create the content folder and seed file

```bash
mkdir content/blog
```

Create `content/blog/2026-01-15-first-post.md`:

```markdown
---
title: "Our First Blog Post"
date: "2026-01-15"
author: "Pastor Alex Morgan"
excerpt: "Welcome to the church blog."
---

This is the body of the blog post. Write as much as you'd like here.
```

> **Tip:** The filename becomes the slug on the public site. Use `YYYY-MM-DD-title.md` for chronological sorting.

### 3. Write the TypeScript type and loader

Create `lib/blog.ts` (type only):

```ts
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  body: string;
}
```

Create `content/blog.ts` (loader):

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPost } from "@/lib/blog";

const DIR = path.join(process.cwd(), "content", "blog");

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(DIR)) return [];

  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: filename.replace(/\.md$/, ""),
        title: String(data.title ?? ""),
        date: String(data.date ?? ""),
        author: String(data.author ?? ""),
        excerpt: String(data.excerpt ?? ""),
        body: content.trim(),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}
```

> **Tip:** Compare with `content/sermons.ts` — the pattern is identical. Copy it and rename the fields.

### 4. Add the collection to tina/config.ts

Open `tina/config.ts` and add the new collection to the `collections` array. Place it after the last existing collection:

```ts
{
  name: "blog",
  label: "Blog",
  label_singular: "Post",
  path: "content/blog",
  format: "md",
  ui: {
    filename: {
      slugify: (values) => {
        const date = values?.date
          ? new Date(values.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10);
        const title = (values?.title ?? "post")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        return `${date}-${title}`;
      },
    },
  },
  fields: [
    { type: "string", name: "title", label: "Title", isTitle: true, required: true },
    {
      type: "datetime",
      name: "date",
      label: "Date",
      ui: { dateFormat: "YYYY-MM-DD" },
    },
    { type: "string", name: "author", label: "Author" },
    {
      type: "string",
      name: "excerpt",
      label: "Excerpt",
      ui: { component: "textarea" },
    },
    { type: "rich-text", name: "body", label: "Content", isBody: true },
  ],
},
```

### 5. Restart the dev server

Stop `npm run cms` and restart it:

```bash
npm run cms
```

TinaCMS re-reads `tina/config.ts` on startup. After 10-15 seconds, open [http://localhost:3000/admin](http://localhost:3000/admin) — the **Blog** collection should appear in the sidebar.

### 6. Test in the CMS

**Click** **Blog** in the sidebar.

You should see the seed file (`First Blog Post`).

**Click** **New Post** — fill in the title, date, author, and body.

**Click** **Save**.

**Check** that a new `.md` file appeared in `content/blog/`.

### 7. Build the page

Follow [adding-a-page.md](./adding-a-page.md) — the CMS collection is now wired. You just need the route that reads from the loader and renders the content.

---

## TinaCMS field type reference

| Field type | What it renders | When to use |
| --- | --- | --- |
| `string` | Text input | Short text fields |
| `string` + `ui: { component: "textarea" }` | Multi-line text | Descriptions, excerpts |
| `datetime` | Date picker | Publish dates, event dates |
| `image` | Image picker (uploads to `/images/uploads/`) | Photos, thumbnails |
| `boolean` | Checkbox | Flags like "pinned" or "primary" |
| `number` | Number input | Display order, duration |
| `rich-text` + `isBody: true` | Markdown editor | Main body content |
| `object` | Nested group of fields | Address, leader info |
| `object` + `list: true` | Repeating group | Meeting times, gallery items |
| `string` + `list: true` | Repeating text | Bullet list items |
| `string` + `options: [...]` | Dropdown | Fixed choices (day of week, life stage) |

> **Tip:** For dropdown fields, pass `options` as an array of strings (simple labels) or `{ value, label }` objects.

---

## Common Mistakes

- **Collection appears in CMS sidebar but saving throws a schema error.** A required field is missing from the seed file frontmatter. Add it and save again.
- **Changes in `tina/config.ts` don't appear in the CMS after restart.** Clear your browser cache and hard-refresh (`Ctrl+Shift+R`). TinaCMS caches the schema client-side.
- **TypeScript errors after adding a field.** The TypeScript type in `lib/<type>.ts` and the loader in `content/<type>.ts` must both be updated to include the new field.
- **`isBody: true` field shows blank content.** Make sure the content is in the Markdown body (below the frontmatter `---`) not in a frontmatter key named `body`.

---

## What's next?

- [Adding a page](./adding-a-page.md) — wire the loader to a new route.
- [Content model](./content-model.md) — reference for all existing collections.

## Stuck?

- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Adding%20a%20CMS%20Collection).*
