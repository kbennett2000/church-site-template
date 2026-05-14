---
type: explanation
audience: developer
time: 15 minutes
---

# Architecture

**Who this is for:** Developers customizing the template heavily, or maintaining a church's adopted instance.
**What you'll accomplish:** Understand the system end-to-end: tech choices, folder layout, data flow, the build pipeline, and the relationship between this template repo and the church instances downstream of it.
**You'll need first:** Working knowledge of React, TypeScript, and Next.js basics.

---

## Template vs. Instance

This codebase plays two roles depending on whose copy you're looking at.

**The template repo** (`kbennett2000/church-site-template`):
- Lives at github.com/kbennett2000/church-site-template.
- Marked as a GitHub template repository (you'll see the green "Use this template" button on the repo page).
- Holds the canonical source, generic seed data, and all documentation.
- Receives pull requests from contributors. Releases happen here.
- Has no church specifically deployed from it — it's a starter.

**A church instance** (e.g. `firstbaptist/firstbaptist-site`):
- Created by clicking "Use this template" on the template repo page.
- An **independent repository** with its own history — *not a GitHub fork*. There's no automatic upstream link.
- One repo per adopting church. Each church owns and deploys their own copy.
- Customized: real church name, real photos, real content. The placeholder seed data has all been replaced.
- Deployed independently — usually to Vercel under the church's domain.

### What flows from template to instance

When a church clicks "Use this template," they get a snapshot of the template at that moment. After that, the two repos are unconnected by Git.

If we ship an improvement to the template later (a bug fix, a new feature, a security patch), it does **not** automatically reach church instances. That's by design — adopting churches don't want surprise breaking changes pushed at them.

Church instances can pull in template improvements three ways:

1. **Manual cherry-pick** — read the template's [changelog or commits](https://github.com/kbennett2000/church-site-template/commits/main), find the change they want, copy the diff into their own repo. Works for any change but is hands-on.
2. **`git-template-sync` or similar tool** — adds the template as an "upstream" remote and uses scripts to identify and pull non-conflicting changes. Less manual, but assumes some familiarity with Git.
3. **Don't sync at all** — most churches will fall here. The template they started from is "good enough"; their site keeps running; they re-cross the bridge only if a real security issue forces it.

Whichever path: it's a deliberate developer action, not automatic. See [contributing.md](./contributing.md#keeping-a-church-instance-in-sync-with-the-template) for the mechanical details.

### What flows from instance back to template

Instances are downstream consumers, not upstream contributors. Church-instance changes that are too specific to that church (their staff, their ministries, their photos) stay there.

But if a developer working on a church instance discovers a **generic** improvement — a bug fix, a better default, a doc clarification — they can contribute it back to the template by:

1. Opening the template repo separately (not their church repo).
2. Forking *the template* (not their church instance).
3. Sending a pull request from their fork.

In other words: church instances and template contributions live in different repos. A developer wears one hat at a time.

### Why this matters for code reviewers

When reading this codebase, ask: "Would this make sense for any small church, or is it specific to one church?" The template should answer "any." Hardcoded names, addresses, photos, or doctrinal claims belong in `/content/` (where they can be replaced) or in a downstream church instance — never in component code.

The full design rationale is in [decision-log.md → ADR-009](./decision-log.md#adr-009-github-template-not-fork-for-church-adoption).

---

## Tech stack at a glance

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16, App Router | RSC + static export, free hosting on Vercel |
| UI library | React 19 | Server components by default |
| Styling | Tailwind CSS 3.4 | Theme tokens, no CSS-in-JS runtime |
| Type system | TypeScript 5.6 (strict) | Compile-time safety, zero runtime |
| CMS | TinaCMS + TinaCloud | No database, Google/email auth, direct git commits |
| Email | Resend | Form submissions delivered to church inbox |
| Content | JSON + Markdown (frontmatter) | Plain text, diffable, git-native |
| Markdown parsing | `gray-matter` | Lightweight frontmatter parser |
| Hosting | Vercel (free tier) | First-class Next.js support, auto-deploys on push |
| Icons | `lucide-react` | Tree-shakeable, consistent style |
| Fonts | `next/font/google` (Inter, Fraunces) | Self-hosted, no CLS |

The decisions behind each are documented in [decision-log.md](./decision-log.md).

---

## Folder layout

```
/app                      Next.js App Router pages (routes)
  layout.tsx              Root layout — fonts, providers
  page.tsx                Homepage
  globals.css             CSS variables (theme tokens) + Tailwind layers
  about/page.tsx
  beliefs/page.tsx
  calendar/page.tsx
  connect/                Nested routes (groups, prayer, serve, contact)
  give/page.tsx
  ministries/             [slug]/page.tsx for dynamic ministry pages
  visit/page.tsx
  watch/page.tsx

/components               Reusable UI
  ui/                     Primitive components (button, card, etc.)
  sections/               Homepage sections (hero, beliefs-teaser, etc.)
  site-header.tsx         Top nav
  site-footer.tsx         Footer
  event-modal.tsx         Calendar event details + RSVP

/lib                      Type definitions + non-content helpers
  church-info.ts          Loads content/site.json + derives mapsUrl, phoneHref,
                          emailHref; exports the nav structure (site IA)
  sermons.ts              Sermon TYPE only
  ministries.ts           Ministry TYPE only
  staff.ts                StaffMember TYPE only
  elders.ts               Elder TYPE only
  beliefs.ts              Belief TYPE only
  calendar-data.ts        Types + month-expansion helpers (eventsForMonth,
                          upcomingEventsAfter, parse12hMinutes)
  prayer-wall.ts          Sample data (still inline; flagged for /content/)
  groups.ts, serve-roles.ts (still inline; flagged for /content/)
  utils.ts                cn() helper (Tailwind class merge)

/content                  All editable data — types come from /lib, loaders live here
  site.json               Church info + cross-cutting copy (CMS singleton)
  site.ts                 Loader: re-exports site.json + computes siteContent
  beliefs.json            Doctrinal statements
  beliefs.ts              Loader: imports beliefs.json, types as Belief[]
  events.json             Recurring events
  events.ts               Loader: imports events.json, types as RecurringEvent[]
  story.md                "Our Story" prose (CMS Pages collection)
  staff/*.md              One file per staff member (CMS folder)
  staff.ts                fs+gray-matter loader → StaffMember[]
  elders/*.md             One file per elder (CMS folder)
  elders.ts               fs+gray-matter loader → Elder[]
  ministries/*.md         One file per ministry (CMS folder)
  ministries.ts           fs+gray-matter loader → Ministry[], plus getMinistry()
  sermons/*.md            One file per sermon (CMS folder)
  sermons.ts              fs+gray-matter loader → Sermon[], plus latestSermon

/tina                     TinaCMS
  config.ts               Schema for all 14 content collections (replaces config.yml)
  __generated__/          Auto-generated by `npm run cms` or `npm run build` (gitignored)

/public                   Static assets
  admin/                  TinaCMS admin UI — generated by build (gitignored; see tina/config.ts)
  images/
    uploads/              Editor uploads (from CMS)
    imported/             Original prototype images
  logo.svg                Generated by setup script

/scripts                  Node CLI scripts (setup, dev, deploy, doctor)

/docs                     This documentation
  for-editors/
  for-tech-volunteers/
  for-developers/

/.devcontainer            Codespaces config
```

---

## Why Next.js App Router

The App Router (introduced in Next.js 13, default since 14) gives us three things this project needs:

1. **React Server Components (RSC).** Pages that render at build time on the server with no JavaScript shipped to the browser by default. We pull all content from disk in server components — no API routes needed.
2. **File-based routing.** Each `app/<route>/page.tsx` is a route. No router config.
3. **Static generation by default.** With no `dynamic = 'force-dynamic'` and no `cookies()`/`headers()` calls, every page in this project renders to static HTML. The build output shows every route as `○ (Static)`.

We don't use:
- **API routes** — no dynamic server logic needed.
- **Middleware** — no auth at the edge.
- **Server Actions** — there are no forms that mutate server state (form posts go to third-party services like Formspree or get stored as PR submissions).

---

## Loader pattern

Markdown-based content (`/content/sermons/`, `/content/staff/`, `/content/elders/`, `/content/ministries/`) is loaded by `content/<type>.ts` modules using `fs.readdirSync` + `gray-matter`. Each loader **exports functions, not top-level `const`**:

```ts
// content/sermons.ts
export function getAllSermons(): Sermon[] { return loadAll(); }
export function getLatestSermon() { return loadAll()[0]; }
export function getSermon(id: string) { return loadAll().find(s => s.id === id); }
```

**Why functions instead of `const`:** Next.js's file watcher tracks JS/TS/JSON files that are imported, but not files read via `fs` at module-load time. If we cached the array at the top level (`export const allSermons = loadAll()`), CMS edits to `.md` files would only show up after a full dev-server restart. Function exports re-read on each call. In dev, server components re-execute per request, so editors see edits after a browser refresh; at build time, every route is prerendered with fresh data anyway.

Consumer pattern:

```tsx
import { getAllSermons } from "@/content/sermons";

export default function WatchPage() {
  const allSermons = getAllSermons();
  // ...
}
```

JSON-based content (`content/site.json`, `content/beliefs.json`, `content/events.json`) doesn't need this treatment — `import data from "./foo.json"` is a real module import that Next.js tracks. Those loaders use top-level `const`.

---

## Why static generation everywhere

Every page is pre-rendered at build time into HTML. Benefits:

- **Free hosting** on Vercel's static plan (no serverless invocations).
- **Sub-100ms TTFB** anywhere in the world (Vercel's CDN serves the HTML directly).
- **Survives Vercel outages** if mirrored to GitHub Pages, S3, etc.
- **Predictable builds** — deterministic output means the admin CMS and the public site always agree on content.

The trade-off: any content change requires a rebuild (typically 1-3 minutes on Vercel). For a small church site with maybe weekly content updates, this is fine. For high-frequency content, you'd switch to ISR (Incremental Static Regeneration) — supported by Next.js, just not enabled here.

---

## How `/content/` maps to pages

Each piece of editor-managed content has three points of contact:

1. **Storage** in `/content/` — JSON file or Markdown file with frontmatter.
2. **A loader** in `/lib/*.ts` that reads from `/content/` at build time using `fs` + `gray-matter`.
3. **Consumption** in a page (`app/<route>/page.tsx`) or component.

Example: a sermon

```
content/sermons/2026-01-12-the-weight.md
       ↓ (read by gray-matter)
lib/sermons.ts   getSermons()
       ↓ (imported as server component)
app/watch/page.tsx   renders sermon cards
```

The TinaCMS schema in `tina/config.ts` declares the same fields the TypeScript loader expects. **The two are coupled.** If you add a field to one, add it to the other (and to the TypeScript type).

See [content-model.md](./content-model.md) for every content type's schema.

---

## Server vs client components

By default, every component in this project is a **server component** — they render at build time on the server and ship zero JavaScript.

A few interactive components opt into client mode with `"use client";` at the top:

- `components/event-modal.tsx` — needs state for the open/closed modal.
- `components/sections/newsletter.tsx` — needs state for form submission.
- Any component using `useState`, `useEffect`, event handlers, or browser-only APIs.

**Rule of thumb:** start every new component as a server component. Add `"use client"` only when you hit "Error: useState only works in client components."

---

## The role of `/lib/`

`/lib/` is the *data access layer*. Each `lib/*.ts` file:

- Exports **TypeScript types** for the entity (e.g. `interface Sermon`).
- Exports a **loader function** (e.g. `getSermons()`) that reads from `/content/`.
- (Sometimes) exports **helpers** for transforming or filtering.

`/lib/` files don't render anything. They never import React. They only ever talk to:

- The filesystem (via `node:fs`).
- `gray-matter` for parsing Markdown frontmatter.
- Each other (e.g. `calendar-data.ts` composes `events.ts` and `sermons.ts`).

The boundary is intentional: pages and components consume `/lib/` exports; nothing flows the other way.

---

## The role of `/components/`

`/components/` is the *UI layer*. Each component:

- Receives data as **props** (often typed via `/lib/` types).
- Renders JSX.
- Uses Tailwind classes for styling.

Components live in three places:

- `components/ui/` — primitives (Button, Card, Input). Pure presentation.
- `components/sections/` — page sections (Hero, BeliefsTeaser). Sometimes assemble data via `/lib/`.
- `components/*.tsx` — top-level layout pieces (SiteHeader, SiteFooter).

---

## The role of `/app/`

`/app/` is the *routing and composition layer*. Each `page.tsx`:

- Calls `/lib/` loaders to fetch its data.
- Imports components and arranges them.
- Exports a default React component.

Pages are almost always thin. Most of the substance lives in components and lib.

---

## Build pipeline

When you run `npm run build`:

1. **Next.js** compiles TypeScript and JSX with SWC.
2. **Tailwind** scans every file for class names and produces the CSS.
3. For each page, Next.js calls the page's component (and any RSC fetchers), capturing the rendered HTML.
4. The result is a `.next/` directory containing static HTML, JS chunks, and a manifest.
5. The build output prints every route with its rendering mode — every page in this project shows as `○ (Static)`.

Vercel runs this same `next build` on every push. It then serves the static output through its global CDN.

---

## How the CMS fits in

The CMS app at `/admin/` is a single-page React app built from `tina/config.ts` by `tinacms build` and served as a static bundle. It runs entirely in the browser. When an editor publishes:

1. TinaCMS sends the change to TinaCloud (via the editor's session token — Google/email auth).
2. TinaCloud commits the file change directly to the `main` branch of the GitHub repository.
3. GitHub fires a webhook to Vercel.
4. Vercel runs `npm run build` and deploys.
5. The new content is live.

The CMS schema is defined in `tina/config.ts`. Fields declared there must match the TypeScript loaders in `/content/*.ts`. When adding a new collection, update both.

---

## What's next?

- [Content model](./content-model.md) — every content type's schema and where it's consumed.
- [Adding a page](./adding-a-page.md) — tutorial for adding a new route.
- [Decision log](./decision-log.md) — why we chose each piece of the stack.

## Stuck?

- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Architecture).*
