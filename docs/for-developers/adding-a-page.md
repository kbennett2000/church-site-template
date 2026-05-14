---
type: tutorial
audience: developer
time: 30 minutes
---

# Adding a new top-level page

**Who this is for:** Developers adding a new route like `/podcasts`, `/missions`, or `/blog`.
**What you'll accomplish:** Add a new page to the site complete with a route, a nav entry, and (optionally) a CMS-managed content source.
**You'll need first:**
- The project running locally (`npm run start`).
- Familiarity with the layout. See [architecture.md](./architecture.md).

We'll walk through adding a `/podcasts` page. Two flavors:

- **Flavor A:** Static page (one-off prose). Quick — 5 minutes.
- **Flavor B:** Content-driven page (editable through the CMS). Longer — 30 minutes.

---

## Flavor A: A static, hardcoded page

Use this when the page is small and unlikely to change often — a generic "About our podcast" page.

### 1. Create the route file

Make a new file at `app/podcasts/page.tsx`:

```tsx
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Podcasts | Our Church",
  description: "Sermons, devotionals, and conversations from our pastors.",
};

export default function PodcastsPage() {
  return (
    <main>
      <PageHeader title="Podcasts" subtitle="Sermons, devotionals, and conversations." />

      <section className="container mx-auto px-4 py-12">
        <p className="text-lg leading-relaxed text-foreground">
          Subscribe wherever you listen to podcasts...
        </p>
      </section>
    </main>
  );
}
```

> **Tip:** Match the layout structure of an existing page like `app/visit/page.tsx` for consistency.

### 2. Verify the route works

**Open** [http://localhost:3000/podcasts](http://localhost:3000/podcasts).

You should now see your new page rendered with the header and prose.

### 3. Add to the nav

The nav lives in `lib/church-info.ts` in the `nav` array. Open it:

```ts
export const nav = [
  { label: "About", href: "/about" },
  { label: "Watch", href: "/watch" },
  // ... existing entries
];
```

Add an entry:

```ts
export const nav = [
  { label: "About", href: "/about" },
  { label: "Watch", href: "/watch" },
  { label: "Podcasts", href: "/podcasts" },    // new
  // ...
];
```

**Save** and refresh the browser — the new link appears in the header.

For a dropdown entry (a parent with children), match the pattern of `Connect` in the same file:

```ts
{
  label: "Connect",
  href: "/connect",
  children: [
    { label: "Prayer", href: "/connect/pray" },
    // ...
  ],
}
```

### 4. (Optional) Add to the footer

If the page should show in the footer's secondary links, edit `components/site-footer.tsx` — there's a `secondaryLinks` array. Add an entry the same way.

### 5. Test the build

```
npm run build
```

The build output should list `/podcasts` as `○ (Static)`. If it shows `λ (Dynamic)`, you accidentally introduced a runtime dependency (probably calling `cookies()` or `headers()` somewhere). Investigate.

---

## Flavor B: A content-driven page (CMS-managed)

Use this when the page's content will be edited regularly — a "podcast episodes" page where staff add new episodes weekly.

We'll set up:
- A `/content/podcasts/` folder where each episode is a Markdown file.
- A TinaCMS collection so editors can manage episodes through the CMS.
- A TypeScript type and loader in `lib/podcasts.ts`.
- Routes at `/podcasts` (index) and `/podcasts/[slug]` (single episode).

### 1. Define the content shape

Decide the fields each podcast episode needs. For this example:

- `title` — episode title
- `date` — published date
- `host` — name(s) of host(s)
- `description` — short summary
- `audioUrl` — URL to the MP3
- `transcript` — optional Markdown body

### 2. Create the content folder

```
mkdir content/podcasts
```

Add a seed file `content/podcasts/2026-01-15-faithful-fathering.md`:

```markdown
---
title: "Faithful Fathering"
date: "2026-01-15"
host: "Pastor John Smith"
description: "A conversation about raising kids in the faith."
audioUrl: "https://example.com/episodes/001.mp3"
---

In this episode we talk about...
```

### 3. Write the TypeScript type and loader

Create `lib/podcasts.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface PodcastEpisode {
  slug: string;
  title: string;
  date: string;
  host: string;
  description: string;
  audioUrl: string;
  body: string;
}

const PODCASTS_DIR = path.join(process.cwd(), "content", "podcasts");

export function getPodcasts(): PodcastEpisode[] {
  if (!fs.existsSync(PODCASTS_DIR)) return [];

  const files = fs
    .readdirSync(PODCASTS_DIR)
    .filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(PODCASTS_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title,
        date: data.date,
        host: data.host,
        description: data.description,
        audioUrl: data.audioUrl,
        body: content,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPodcast(slug: string): PodcastEpisode | undefined {
  return getPodcasts().find((p) => p.slug === slug);
}
```

> **Tip:** Look at `lib/sermons.ts` for a working pattern that's identical in structure. Copy it and rename fields.

### 4. Add the TinaCMS collection

Open `tina/config.ts`. Inside the `collections` array (after the last existing entry), add:

```ts
{
  name: "podcasts",
  label: "Podcasts",
  label_singular: "Episode",
  path: "content/podcasts",
  format: "md",
  ui: {
    filename: {
      slugify: (values) => {
        const date = values?.date
          ? new Date(values.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10);
        const title = (values?.title ?? "episode")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        return `${date}-${title}`;
      },
    },
  },
  fields: [
    { type: "string", name: "title", label: "Episode Title", isTitle: true, required: true },
    {
      type: "datetime",
      name: "date",
      label: "Date Published",
      ui: { dateFormat: "YYYY-MM-DD" },
    },
    { type: "string", name: "host", label: "Host(s)" },
    { type: "string", name: "description", label: "Short Description", ui: { component: "textarea" } },
    { type: "string", name: "audioUrl", label: "Audio URL" },
    { type: "rich-text", name: "body", label: "Transcript or Show Notes", isBody: true },
  ],
},
```

Then **restart** `npm run cms` to pick up the schema change. See [adding-a-cms-collection.md](./adding-a-cms-collection.md) for the full pattern.

### 5. Build the index page

Replace `app/podcasts/page.tsx` from Flavor A with:

```tsx
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getPodcasts } from "@/lib/podcasts";

export const metadata = {
  title: "Podcasts | Our Church",
  description: "Sermons, devotionals, and conversations from our pastors.",
};

export default function PodcastsPage() {
  const episodes = getPodcasts();

  return (
    <main>
      <PageHeader title="Podcasts" subtitle="Sermons, devotionals, and conversations." />

      <section className="container mx-auto px-4 py-12">
        <ul className="space-y-6">
          {episodes.map((ep) => (
            <li key={ep.slug} className="rounded-xl border border-border bg-card p-6">
              <Link href={`/podcasts/${ep.slug}`}>
                <h2 className="font-serif text-2xl">{ep.title}</h2>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {ep.date} • {ep.host}
              </p>
              <p className="mt-3 text-foreground">{ep.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
```

### 6. Build the single-episode page

Create `app/podcasts/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { getPodcast, getPodcasts } from "@/lib/podcasts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPodcasts().map((ep) => ({ slug: ep.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const episode = getPodcast(slug);
  if (!episode) return { title: "Not found" };
  return { title: `${episode.title} | Podcasts` };
}

export default async function PodcastEpisodePage({ params }: Props) {
  const { slug } = await params;
  const episode = getPodcast(slug);
  if (!episode) notFound();

  return (
    <main>
      <PageHeader title={episode.title} subtitle={`${episode.date} • ${episode.host}`} />

      <section className="container mx-auto px-4 py-12">
        <audio controls className="w-full" src={episode.audioUrl} />
        <p className="mt-6 text-lg text-foreground">{episode.description}</p>
        {episode.body && (
          <article className="prose mt-8 max-w-prose">{/* render markdown */}</article>
        )}
      </section>
    </main>
  );
}
```

> **Tip:** Rendering Markdown to HTML requires a renderer. For simple cases use `react-markdown`. For richer cases use `next-mdx-remote`. The template currently doesn't render markdown on any page — prose is inline JSX. Adding a markdown renderer is on the roadmap.

### 7. Verify

```
npm run build
```

The build output should show:

```
○ /podcasts                                       Static
● /podcasts/[slug]                                Static
   ├ /podcasts/2026-01-15-faithful-fathering
```

The `●` indicates a static route generated from `generateStaticParams`. Each known slug gets its own pre-rendered page.

### 8. Test the CMS path

After deploying:

- **Open** `/admin/`.
- **Click** the new **Podcasts** collection in the sidebar.
- **Add** a new episode.
- **Verify** the resulting PR contains a new file in `content/podcasts/`.

---

## Common Mistakes

- **Build fails with "Cannot find module '@/lib/podcasts'".** Check the import path — Next.js's `@/` alias maps to the project root. Make sure `tsconfig.json` has it configured (it does by default).
- **The route shows a 404 even though the page file exists.** You may have an extra `/` or typo in the file path. The file MUST be `app/podcasts/page.tsx` exactly.
- **CMS doesn't show the new collection.** Hard-refresh the browser at `/admin/` after restarting `npm run cms` — TinaCMS caches the schema client-side.
- **`generateStaticParams` is called but pages aren't generated at build time.** Make sure the function is exported. Async exports are allowed but the return value must be an array (not a promise of array, in Next.js 16+).
- **The CMS publishes a new file but the site doesn't show it.** Vercel only rebuilds on `main` branch pushes. Check that the commit landed on `main`.

---

## What's next?

- [Adding a CMS collection](./adding-a-cms-collection.md) — deeper dive on the TinaCMS schema.
- [Styling and theming](./styling-and-theming.md) — Tailwind tokens for the new page.

## Stuck?

- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Adding%20a%20Page).*
