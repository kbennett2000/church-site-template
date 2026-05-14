---
type: tutorial
audience: developer
time: 25 minutes
---

# Adding a CMS collection

**Who this is for:** Developers adding a new editable content type (e.g. "Blog posts") that editors will manage through Decap CMS.
**What you'll accomplish:** A new collection in the CMS sidebar, backed by Markdown files in `/content/`, with a TypeScript loader that pages can consume.
**You'll need first:**
- Project running locally.
- Familiarity with the content model. See [content-model.md](./content-model.md).

We'll walk through adding a **Blog posts** collection.

---

## The four-step pattern

For every new collection:

1. **Decide the schema** — what fields does each entry have?
2. **Create** the content folder + a seed file.
3. **Define** the TypeScript type in `lib/<type>.ts` and the loader in `content/<type>.ts`.
4. **Add** the collection to `public/admin/config.yml`.

Then test in the CMS and consume on a page.

> **Important:** Loaders go in `content/`, not `lib/`. `lib/` holds only the type definition. The split exists so dev-mode hot-reload works correctly when editors save in the CMS — see [architecture.md](./architecture.md#loader-pattern) for the rationale. Always export loaders as **functions** (`getBlogPosts()`), never top-level `const`.

---

## Steps

### 1. Decide the schema

Write down the fields and which are required. For a blog post:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| title | string | Yes | Headline |
| date | date | Yes | Publish date |
| author | string | Yes | Author's name |
| excerpt | text | Yes | Short summary for the index page |
| cover | image | No | Optional hero image |
| body | markdown | Yes | The post body |

### 2. Create the content folder

```
mkdir content/blog
```

Add a seed file `content/blog/2026-01-20-welcome-to-our-blog.md`:

```markdown
---
title: "Welcome to our blog"
date: "2026-01-20"
author: "Pastor John Smith"
excerpt: "A new way to share what's happening in the life of the church."
cover: "/images/uploads/blog-welcome.jpg"
---

Welcome to our brand new blog! We'll use this space to share...
```

> **Tip:** A seed file matters. Without one, the loader returns an empty array and the page may render confusingly during development.

### 3. Create the TypeScript type and loader

Type in `lib/blog.ts`:

```ts
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  cover?: string;
  body: string;
};
```

Loader in `content/blog.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
import type { BlogPost } from "@/lib/blog";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title,
        date: data.date,
        author: data.author,
        excerpt: data.excerpt,
        cover: data.cover,
        body: content,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}
```

> **Tip:** This is the same template as `content/sermons.ts`, `content/ministries.ts`, etc. Copy from whichever existing loader most resembles the new content shape, then rename fields. Always export functions (not top-level `const`) so CMS edits hot-reload in dev.

### 4. Add the Decap collection

Open `public/admin/config.yml`.

Scroll to the end of the `collections:` array. Add the new collection at the bottom:

```yaml
  # =====================================================================
  # 9. BLOG POSTS
  # =====================================================================
  - name: blog
    label: "Blog Posts"
    label_singular: "Post"
    folder: content/blog
    create: true
    delete: true
    format: frontmatter
    extension: md
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    summary: "{{date | date('YYYY-MM-DD')}} — {{title}}"
    sortable_fields: [date, title, author]
    view_filters:
      - label: This year
        field: date
        pattern: "2026"
    fields:
      - name: title
        label: "Post Title"
        widget: string
        hint: "Shown at the top of the post and on the blog index."
      - name: date
        label: "Date Published"
        widget: datetime
        date_format: "YYYY-MM-DD"
        time_format: false
        picker_utc: false
      - name: author
        label: "Author"
        widget: string
        hint: "Usually a pastor or staff member's name."
      - name: excerpt
        label: "Short Excerpt"
        widget: text
        hint: "1-2 sentences shown on the blog index card."
      - name: cover
        label: "Cover Image"
        widget: image
        required: false
        hint: "Wide hero image at the top of the post. 16:9 ratio works best."
      - name: body
        label: "Post Body"
        widget: markdown
        hint: "Write the post using the formatting toolbar."
```

**Save** the file.

> **Important:** Indentation matters in YAML. Each level is exactly 2 spaces. Use a YAML linter (most code editors have one) to catch syntax errors before committing.

### 5. Pick the right widget for each field

Reference of Decap widgets used in this project:

| Widget | When to use | Example |
| --- | --- | --- |
| `string` | Single-line text | Title, author |
| `text` | Multi-line plain text | Excerpt, bio |
| `markdown` | Rich text with formatting | Post body |
| `datetime` | Dates | Publish date |
| `number` | Numeric input | Display order |
| `boolean` | Yes/no toggle | Featured flag |
| `select` | Dropdown of fixed options | Recurrence type |
| `image` | Image picker (uploads or selects) | Cover, photo |
| `file` | Any file (PDF, etc.) | Sermon notes |
| `list` | Array of nested fields | Meetings, gallery |
| `object` | Grouped fields | Address, leader |
| `relation` | Reference to another collection's entry | Author from staff |

Full reference: [decapcms.org/docs/widgets](https://decapcms.org/docs/widgets/).

### 6. Configure the slug pattern

The `slug:` line controls what the filename looks like:

| Pattern | Result |
| --- | --- |
| `{{slug}}` | The slugified title only (`welcome-to-our-blog.md`) |
| `{{year}}-{{month}}-{{day}}-{{slug}}` | Date-prefixed (`2026-01-20-welcome-to-our-blog.md`) |
| `{{year}}/{{month}}/{{slug}}` | Year/month folders (rarely needed) |

For dated content (sermons, blog posts, events), prefer the date-prefixed pattern — files sort chronologically on disk.

### 7. Use editorial workflow (already configured)

The project's `config.yml` has `publish_mode: editorial_workflow` set at the top. This means every change becomes a PR rather than a direct commit. You don't need to configure this per-collection.

If you want a collection to bypass review (rare — typically only for the doctrine page or similar), you can override at the collection level — but think twice before doing it. The PR workflow is a safety feature.

### 8. Restart the dev server and test

Restart `npm run start` to pick up the config changes. Decap's preview at `/admin/` should show the new collection in the left sidebar.

> **Tip:** Decap loads `config.yml` from the deployed site, not from your local dev server. To test locally, you can run Decap with a local backend — see [decapcms.org/docs/working-with-a-local-git-repository](https://decapcms.org/docs/working-with-a-local-git-repository/).

### 9. Render on a page

Now that the data exists, build a page to render it. See [Adding a page](./adding-a-page.md) for the route side — Flavor B walks through the index + single-entry pattern that fits a blog perfectly.

Quick example for the index:

```tsx
// app/blog/page.tsx
import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export default function BlogIndex() {
  const posts = getBlogPosts();
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl">Blog</h1>
      <ul className="mt-8 space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-border pb-6">
            <Link href={`/blog/${post.slug}`}>
              <h2 className="font-serif text-2xl">{post.title}</h2>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {post.date} • {post.author}
            </p>
            <p className="mt-3 text-foreground">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

### 10. Build to validate

```
npm run build
```

The build output should include the new routes and show no TypeScript errors. If TypeScript complains about a missing field, you forgot to handle an optional field in the loader.

---

## Patterns from existing collections

| Pattern | Used by | Notes |
| --- | --- | --- |
| Singleton file (one entry) | `settings`, `beliefs`, `events`, `pages` | Use `files:` instead of `folder:` |
| Per-entry Markdown files | `sermons`, `ministries`, `staff`, `elders` | Most common |
| List widget with summary | `ministries.meetings`, `events.events` | Use `summary:` for readable list items |
| Conditional fields | (not currently used) | See Decap's `condition` option |
| Date-prefixed slugs | `sermons` | Files sort chronologically |
| Custom view filters | `sermons` | Add `view_filters:` for the collection sidebar |

---

## Common Mistakes

- **Collection doesn't appear in the CMS.** Most likely YAML syntax error. Validate at [yamllint.com](https://yamllint.com/). Look at the browser console for parse errors when Decap loads.
- **Editor publishes but the file doesn't appear.** Check the `folder:` path matches a real folder. Decap may write to a path that doesn't exist if you mistyped.
- **TypeScript build fails after adding a collection.** You added the field in `config.yml` but didn't update the loader/type in `lib/`. Update both sides.
- **Markdown body shows up as a raw string with `---` frontmatter.** You used `format: yaml` instead of `format: frontmatter`. The latter splits the file into frontmatter + body; the former treats the whole thing as YAML.
- **Slug collisions when editors create posts with the same title on the same day.** Add a randomization element to the slug pattern (`{{year}}-{{month}}-{{day}}-{{slug}}-{{fields.author | lower}}`) or accept the rare conflict.

---

## What's next?

- [Adding a page](./adding-a-page.md) — render the new collection on a route.
- [Content model](./content-model.md) — reference for the existing types.

## Stuck?

- [Decap CMS docs](https://decapcms.org/docs/intro/) — canonical reference.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Adding%20a%20CMS%20Collection).*
