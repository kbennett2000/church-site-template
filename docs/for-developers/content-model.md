---
type: reference
audience: developer
time: 10 minutes
---

# Content model

**Who this is for:** Developers who need to know exactly what shape each content type has on disk, in TypeScript, and in the CMS config.
**What you'll accomplish:** Understand the data model end-to-end so you can extend it without breaking sync between TinaCMS and TypeScript.
**You'll need first:**
- Familiarity with the project layout. See [architecture.md](./architecture.md).

---

## The three-way coupling

For each content type, three places must stay in sync:

1. **TinaCMS schema** — `tina/config.ts` declares the fields editors fill in.
2. **TypeScript type** — `lib/<type>.ts` defines the runtime shape (type-only file).
3. **Loader function** — `content/<type>.ts`, reads files from `content/<type>/` (or imports the matching `.json`).

If you add a field in `tina/config.ts`, you must also add it to the TypeScript type and (if relevant) handle it in the loader. The CMS will happily write a field that the loader ignores — but downstream components won't see it.

> **Note:** The TypeScript signatures below are illustrative — they describe the shape but may simplify field optionality. The canonical source of truth is the `lib/<type>.ts` file; verify against it when extending.

---

## Sermon

**On disk:** `/content/sermons/*.md`

Each file is Markdown with YAML frontmatter:

```markdown
---
title: "The Weight of a Quiet Faithfulness"
date: "2026-01-12"
speaker: "Pastor John Smith"
series: "Walking Through Ruth"
scripture: "Ruth 2:1-23"
book: "Ruth"
youtubeId: "dQw4w9WgXcQ"
audioUrl: "#"
thumbnail: "/images/uploads/sermon-ruth-2.jpg"
notes: |
  ## Outline

  - Setting: harvest season in Bethlehem
  - Boaz as a foreshadow of the redeemer
  - One quiet act, one decisive turn

  Discussion questions are at the welcome desk.
---

Boaz steps onto the page as a picture of faithful, quiet kindness.
```

The `notes` frontmatter field is a TinaCMS rich-text field stored as a YAML multi-line markdown string. It is **not** `isBody: true` (the description body is). The loader reads it as a plain string via `gray-matter` and the sermon detail page (`app/watch/[id]/page.tsx`) parses it with `marked.parse()` and renders inside `prose prose-stone`, matching the convention used for `story.md` and custom pages. Omit the key entirely if there are no notes for a sermon — the page conditionally hides the section.

**TypeScript type** — `lib/sermons.ts` (type only):

```ts
export type Sermon = {
  id: string;            // derived from filename
  title: string;
  date: string;          // ISO date string, "YYYY-MM-DD"
  speaker: string;
  series: string;
  scripture: string;
  book: string;
  youtubeId: string;
  audioUrl: string;
  notes: string;         // markdown rich-text from the `notes` frontmatter field
  thumbnail: string;
  description: string;   // the markdown body after frontmatter
};
```

**Loader** — `content/sermons.ts` exports `getAllSermons()`, `getLatestSermon()`, `getSermon(id)`. Function exports (not top-level `const`) so CMS edits hot-reload in dev — see [architecture.md](./architecture.md#loader-pattern) for the rationale.

**TinaCMS schema** — `tina/config.ts`, collection `sermons`.

**Where consumed:**
- `app/watch/page.tsx` — sermon archive grid.
- `app/watch/[id]/page.tsx` — single sermon view with embedded video and prev/next navigation.
- `components/sections/latest-sermon.tsx` — featured most-recent sermon on the homepage.

**ID:** TinaCMS generates filenames using the `slugify` function defined in `tina/config.ts` (date + title slug). The loader uses the filename (minus `.md`) as `id`, and the dynamic route is `app/watch/[id]/page.tsx`.

---

## Ministry

**On disk:** `/content/ministries/*.md`

```markdown
---
title: "Kids Ministry"
slug: "kids"
tagline: "A safe, fun place for kids to learn about Jesus."
description: "Children's ministry on Sunday mornings during service."
image: "/images/ministries/kids.jpg"
whoFor: "Newborn through 5th grade"
meetings:
  - day: "Sundays"
    time: "10:00 AM"
    location: "Kids Wing"
    note: "During service"
whatToExpect:
  - "Bible-based teaching"
  - "Snack and play time"
leader:
  name: "Pat Taylor"
  role: "Kids Ministry Director"
  email: "pat@example.church"
  photo: "/images/staff/pat-taylor.jpg"
gallery:
  - "/images/uploads/kids-1.jpg"
  - "/images/uploads/kids-2.jpg"
---

Optional long-form description in markdown.
```

**TypeScript type** — `lib/ministries.ts`:

```ts
export interface Meeting {
  day: string;
  time: string;
  location: string;
  note?: string;
}

export interface MinistryLeader {
  name?: string;
  role?: string;
  email?: string;
  photo?: string;
}

export interface Ministry {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  whoFor?: string;
  meetings?: Meeting[];
  whatToExpect?: string[];
  leader?: MinistryLeader;
  gallery?: string[];
  body?: string;
}
```

**TinaCMS schema** — `tina/config.ts`, collection `ministries`.

**Where consumed:**
- `app/ministries/page.tsx` — index of all ministries.
- `app/ministries/[slug]/page.tsx` — individual ministry pages, generated via `generateStaticParams`.
- `components/sections/ministries-grid.tsx` — homepage grid.

**Slug:** Set explicitly via the `slug` field. The filename also matches but the field is what gets used for routing.

---

## Staff member

**On disk:** `/content/staff/*.md`

```markdown
---
name: "Pastor Alex Morgan"
role: "Lead Pastor"
email: "alex@example.church"
photo: "/images/staff/alex-morgan.jpg"
order: 1
---

Alex has served as Lead Pastor since 2018.
```

**TypeScript type** — `lib/staff.ts`:

```ts
export interface StaffMember {
  slug: string;
  name: string;
  role: string;
  email?: string;
  photo: string;
  order: number;
  body: string;
}
```

**Where consumed:**
- `app/about/page.tsx` — staff portraits section.
- `app/connect/contact/page.tsx` — contact directory.

**Sort:** By `order` ascending. Use unique integers; ties are non-deterministic.

---

## Elder

**On disk:** `/content/elders/*.md`

```markdown
---
name: "Bill Andersen"
occupation: "Cattle rancher"
photo: "/images/uploads/bill-a.jpg"
order: 1
---

Bill and his wife Lisa have been part of the church since 1995...
```

**TypeScript type** — `lib/elders.ts`:

```ts
export interface Elder {
  slug: string;
  name: string;
  occupation?: string;
  photo: string;
  order: number;
  body: string;
}
```

**Where consumed:**
- `app/about/page.tsx` — elders section.

---

## Belief (doctrinal statement)

**On disk:** `/content/beliefs.json`

```json
{
  "beliefs": [
    {
      "title": "The Bible",
      "statement": "We believe the Bible is the inspired Word of God (2 Timothy 3:16)."
    },
    {
      "title": "Salvation",
      "statement": "..."
    }
  ]
}
```

**TypeScript type** — `lib/beliefs.ts`:

```ts
export interface Belief {
  title: string;
  statement: string;
}

export interface BeliefsData {
  beliefs: Belief[];
}
```

**Where consumed:**
- `app/beliefs/page.tsx` — full doctrinal statement page.
- `components/sections/beliefs-teaser.tsx` — homepage preview.

**Order:** Array order in the JSON file. Editors can reorder entries in TinaCMS.

---

## Recurring event

**On disk:** `/content/events.json`

```json
{
  "events": [
    {
      "id": "sunday-service",
      "title": "Sunday Service",
      "time": "9:00 AM",
      "durationMinutes": 75,
      "location": "Sanctuary",
      "description": "Weekly worship service.",
      "rule": {
        "kind": "weekly",
        "dayOfWeek": 0
      },
      "needsRsvp": false
    },
    {
      "id": "mens-breakfast",
      "title": "Men's Breakfast",
      "time": "8:00 AM",
      "durationMinutes": 90,
      "location": "Fellowship Hall",
      "description": "...",
      "rule": {
        "kind": "nth-of-month",
        "dayOfWeek": 6,
        "n": 2
      },
      "needsRsvp": true
    }
  ]
}
```

**TypeScript type** — `lib/events.ts`:

```ts
export type RecurrenceRule =
  | { kind: "weekly"; dayOfWeek: number }
  | { kind: "nth-of-month"; dayOfWeek: number; n: number }
  | { kind: "last-of-month"; dayOfWeek: number };

export interface RecurringEvent {
  id: string;
  title: string;
  time: string;            // "9:00 AM" formatted
  durationMinutes: number;
  location: string;
  description: string;
  rule: RecurrenceRule;
  needsRsvp?: boolean;
}
```

**Where consumed:**
- `app/calendar/page.tsx` — month grid.
- `lib/calendar-data.ts` — expands recurrence rules into concrete dates.
- `components/event-modal.tsx` — event details modal.

**`dayOfWeek`:** 0 = Sunday, 6 = Saturday (matches JavaScript's `Date.prototype.getDay()`).

---

## Church info (site settings)

**On disk:** `/content/site.json`

```json
{
  "church": {
    "name": "Grace Community Church",
    "shortName": "GCC",
    "tagline": "A welcoming church in [Your Town]",
    "address": {
      "street": "123 Main Street",
      "city": "Your Town",
      "state": "ST",
      "zip": "12345"
    },
    "phone": "(555) 123-4567",
    "email": "hello@example.church",
    "services": [
      {
        "name": "",
        "day": "Sunday",
        "time": "10:00 AM",
        "note": "Coffee & fellowship before and after the service",
        "primary": true
      }
    ],
    "officeHours": "Mon-Thu, 9:00 AM - 4:00 PM",
    "social": {
      "facebook": "",
      "youtube": ""
    }
  },
  "home": {
    "hero": {
      "headline": "A welcoming community where you belong."
    }
  },
  "about": {
    "hero": {
      "headline": "Following Jesus together — open to everyone."
    }
  }
}
```

> **Heads-up:** the schema above shows `services` as an **array** (the current shape), not the older single-object `service` form. The site supports multiple weekend services — see [Site Settings → Services in the CMS](../for-editors/05-update-service-times.md) for how editors manage this.

**TypeScript type** — `lib/church-info.ts`:

```ts
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Service {
  day: string;
  time: string;
  after: string;
}

export interface ChurchInfo {
  name: string;
  shortName: string;
  tagline: string;
  address: Address;
  phone: string;
  email: string;
  service: Service;
  officeHours: string;
  social: {
    facebook?: string;
    youtube?: string;
  };
  // Derived (computed in lib/church-info.ts):
  mapsUrl: string;        // Google Maps link
  phoneHref: string;      // tel: URL
}
```

**Where consumed:** Everywhere. `lib/church-info.ts` exports a singleton `churchInfo` consumed by header, footer, hero, visit page, contact page, etc.

---

## "Our Story" page

**On disk:** `/content/story.md`

```markdown
---
title: "Our Story"
---

# Our Story

We began as a handful of families gathering in a living room in 1968...

## Where we are today

...
```

**TypeScript type:**

```ts
export interface StoryPage {
  title: string;
  body: string;    // raw markdown body
}
```

A markdown-rendering loader for this file is on the roadmap. Currently the about page has its own JSX prose alongside this markdown source; both exist for editors who prefer the CMS Pages collection, with migration to a single rendered source pending.

---

## Adding a new field to an existing type

The cookbook in three steps:

1. **Edit** `tina/config.ts` — add the field to the appropriate collection's `fields` array. Include a `type`, `name`, and `label`.
2. **Edit** `lib/<type>.ts` — add the field to the TypeScript interface. Make it optional (`?:`) if existing content files won't have it yet.
3. **Update** the loader if any transformation is needed (often nothing — `gray-matter` exposes frontmatter as a plain object).
4. **Consume** the new field in a page or component.

Test locally with `npm run build` to catch type errors before pushing.

---

## What's next?

- [Adding a CMS collection](./adding-a-cms-collection.md) — tutorial for a brand-new content type.
- [Architecture](./architecture.md) — how data flows from content to rendered HTML.

## Stuck?

- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Content%20Model).*
