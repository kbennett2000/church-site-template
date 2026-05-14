---
type: how-to
audience: tech-volunteer
time: 30 minutes
---

# Customize deeper: changes that aren't full-developer work but go beyond `npm run setup`

**Who this is for:** Tech volunteers who've gotten through the basic setup and want to make a few specific tweaks that the setup script and CMS don't directly handle.
**What you'll accomplish:** Be able to add a new ministry beyond the default seven, add a new top-level page, and rearrange the navigation order.
**You'll need first:**
- A working site (`npm run start` shows your church homepage at `localhost:3000`).
- Comfort opening files in your code editor and copy-pasting small snippets.
- Familiarity with the CMS dashboard (you've added at least one ministry or sermon).

> **Honesty about this doc:** the changes below sit on the line between "non-technical" and "developer." You won't write new logic, but you will edit TypeScript and JSON files. If anything goes wrong, every change is reversible through Git history. If you get stuck, the [troubleshooting guide](./troubleshooting.md) covers the common errors, or open an issue.

---

## 1. Add a new ministry beyond the default seven

The template ships with seven ministries (Kids, Youth, Young Adults, Women, Men, Recovery, Missions). Adding an 8th — say, a Seniors ministry, a Spanish-language ministry, or a college ministry — takes about 5 minutes.

### Step 1a: Create the markdown file

Make a new file at `/content/ministries/seniors.md` (or whatever slug you want — use lowercase letters and hyphens, no spaces):

```markdown
---
slug: "seniors"
title: "Seniors Ministry"
tagline: "A monthly luncheon, weekly coffee group, and shared mission trips."
description: "A community for adults 65+ — and anyone who wants to learn from them."
image: "/images/placeholders/ministry-missions.svg"
whoFor: "Adults 65 and older. Spouses and adult children welcome."
meetings:
  - day: "First Thursdays"
    time: "11:30 AM"
    location: "Fellowship Hall"
    note: "Monthly luncheon — $5, RSVP appreciated."
  - day: "Tuesdays"
    time: "10:00 AM"
    location: "Library"
    note: "Coffee and conversation, year-round."
whatToExpect:
  - "A monthly luncheon with a guest speaker."
  - "Weekly coffee group — open-ended, no agenda."
  - "Annual day trip and biennial mission trip."
leader:
  name: ""
  role: "Seniors Ministry Coordinator"
  email: ""
  photo: ""
gallery: []
---

A short paragraph or two of body content — describe what the ministry does, who leads it, and what someone new should expect.

This is the second paragraph if you want one.
```

**Tips:**

- The `slug` value at the top is what becomes the URL (e.g. `slug: "seniors"` → `/ministries/seniors`).
- The `image` field can point at one of the existing placeholder SVGs (e.g. `/images/placeholders/ministry-missions.svg`) while you find a real photo. You can replace it later through the CMS or by editing this line.
- Leave `leader.name` empty if there isn't a named leader yet — the page will fall back to the church office contact.

### Step 1b: Add the new slug to the display order

Open [`/content/ministries.ts`](../../content/ministries.ts). Near the top you'll see a `SLUG_ORDER` array:

```ts
const SLUG_ORDER = [
  "kids",
  "youth",
  "young-adults",
  "women",
  "men",
  "recovery",
  "missions",
];
```

Add your new slug in the position you want it to appear:

```ts
const SLUG_ORDER = [
  "kids",
  "youth",
  "young-adults",
  "women",
  "men",
  "recovery",
  "missions",
  "seniors",   // ← added
];
```

If you don't add the slug to this array, it'll still appear — but at the end, sorted alphabetically with any other unlisted slugs. Listing it explicitly lets you control the order.

### Step 1c: Add the new ministry to the nav menu

Open [`/lib/church-info.ts`](../../lib/church-info.ts). Near the bottom you'll see a `nav` array with a Ministries section:

```ts
{
  label: "Ministries",
  href: "/ministries",
  children: [
    { label: "Kids", href: "/ministries/kids" },
    { label: "Youth", href: "/ministries/youth" },
    { label: "Young Adults", href: "/ministries/young-adults" },
    { label: "Women", href: "/ministries/women" },
    { label: "Men", href: "/ministries/men" },
    { label: "Recovery", href: "/ministries/recovery" },
    { label: "Missions", href: "/ministries/missions" },
  ],
},
```

Add a new entry for your ministry, matching the slug from step 1a:

```ts
  children: [
    { label: "Kids", href: "/ministries/kids" },
    { label: "Youth", href: "/ministries/youth" },
    { label: "Young Adults", href: "/ministries/young-adults" },
    { label: "Women", href: "/ministries/women" },
    { label: "Men", href: "/ministries/men" },
    { label: "Recovery", href: "/ministries/recovery" },
    { label: "Missions", href: "/ministries/missions" },
    { label: "Seniors", href: "/ministries/seniors" },   // ← added
  ],
```

### Step 1d: Verify

Run `npm run start`. Visit `http://localhost:3000/ministries/seniors` — your new ministry page should render. Click "Ministries" in the nav; the dropdown should include "Seniors."

If the page doesn't appear, check:
- The `slug` in the markdown frontmatter exactly matches the URL you visited.
- The markdown file is named `seniors.md` (matching the slug, not the title).
- There are no YAML errors in the frontmatter — the colons and quotes have to be exact.

### Step 1e: Add to CMS-managed ministries collection

Nothing to do here — the CMS already picks up any markdown file in `/content/ministries/`. After step 1a, editors can edit your new ministry through the dashboard just like the default seven.

---

## 2. Remove a ministry you don't have

The mirror of step 1. If your church doesn't have, say, a Recovery ministry, you can remove it cleanly:

### Step 2a: Delete the markdown file

```bash
rm content/ministries/recovery.md
```

(Or just drag it to the trash in your file manager.)

### Step 2b: Remove the slug from `SLUG_ORDER`

In `/content/ministries.ts`, delete the line:

```ts
  "recovery",
```

### Step 2c: Remove from the nav

In `/lib/church-info.ts`, delete the corresponding line in the Ministries `children` array:

```ts
    { label: "Recovery", href: "/ministries/recovery" },
```

### Step 2d: Done

The ministry is gone from both the dropdown nav and the `/ministries/` index page. Visiting `/ministries/recovery` will now show a 404, which is correct.

---

## 3. Add a new top-level page

> **Heads-up:** This is the most "developer-adjacent" task in this doc. You'll create a new TypeScript JSX file by copying an existing one and editing the prose. No new logic — just substituting copy. If you don't feel ready for this, a developer can do it in 15 minutes.

Say you want to add a page at `/our-history` that's a longer-form retelling of the church's story (separate from the About page).

### Step 3a: Create the route folder

In your code editor, create a new folder at `/app/our-history/`. Inside it, create a file named `page.tsx`.

### Step 3b: Copy a simple existing page as a starting point

The cleanest starting point is the existing About page or Beliefs page. Open `/app/beliefs/page.tsx`, copy all of its contents, and paste them into your new `/app/our-history/page.tsx`.

### Step 3c: Strip out what you don't need

In your new `our-history/page.tsx`, you'll want to delete or replace the bits that don't apply:

- Update the `metadata` block at the top — change `title:` and `description:` to your new page.
- Replace the body content with your own prose. The simplest way: replace the existing `<ol>...</ol>` and similar content blocks with one or more `<section>` and `<p>` elements containing your text.
- Remove any imports you no longer use (the editor will underline them).

A minimal new-page skeleton:

```tsx
import type { Metadata } from "next";
import { churchInfo } from "@/lib/church-info";

export const metadata: Metadata = {
  title: "Our History",
  description: `The history of ${churchInfo.name}, told in our own words.`,
};

export default function OurHistoryPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Our History
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            How {churchInfo.name} came to be.
          </h1>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <article className="prose prose-lg max-w-3xl">
          <p>
            Your church's history goes here — first paragraph.
          </p>
          <p>
            Second paragraph. As many as you want.
          </p>
        </article>
      </section>
    </>
  );
}
```

### Step 3d: Add the page to the nav

Same `/lib/church-info.ts` `nav` array. Decide where it belongs:

- If it's a top-level item, add it to the outer array.
- If it belongs under About, add it to the About `children` array.

Example, as a top-level nav item:

```ts
{ label: "History", href: "/our-history" },
```

Example, as a child under About:

```ts
{
  label: "About",
  href: "/about",
  children: [
    { label: "Our Story", href: "/about" },
    { label: "Our History", href: "/our-history" },   // ← added
    { label: "What We Believe", href: "/beliefs" },
    { label: "Staff & Elders", href: "/about#staff" },
  ],
},
```

### Step 3e: Verify

Run `npm run start` and visit `http://localhost:3000/our-history`. The new page should render. The nav should include your new link.

### When to ask a developer instead

Some "new page" requests really are developer work. If your new page needs:

- A form (contact form, signup form, donation form)
- Dynamic data (a list of upcoming events with filtering)
- Embedded video, calendar widgets, or external integrations
- A different layout than the existing pages

…ask a developer. The static-prose pattern above only works for content-heavy pages.

---

## 4. Change the navigation order

The navigation order is controlled by the `nav` array in [`/lib/church-info.ts`](../../lib/church-info.ts). To rearrange, just reorder the entries.

For example, to put "Calendar" before "Watch":

**Before:**
```ts
export const nav = [
  { label: "Visit", href: "/visit" },
  { label: "Watch", href: "/watch" },
  // ...
  { label: "Calendar", href: "/calendar" },
  { label: "Give", href: "/give" },
] as const;
```

**After:**
```ts
export const nav = [
  { label: "Visit", href: "/visit" },
  { label: "Calendar", href: "/calendar" },   // ← moved up
  { label: "Watch", href: "/watch" },
  // ...
  { label: "Give", href: "/give" },
] as const;
```

Refresh the browser — the header reflects the new order immediately.

### Tips

- The header dropdown nav (with the "Children" entries) follows the order in the `children` array — change either independently.
- The mobile menu uses the same `nav` data, so changes propagate to both desktop and mobile automatically.
- "Plan a Visit" and "Get Directions" in the header right side aren't part of the `nav` array — they're hardcoded in [`/components/site-header.tsx`](../../components/site-header.tsx). Don't touch those unless you really want to.

---

## 5. Hide a section of the homepage

If the homepage shows a section your church doesn't have (e.g. the "Latest Sermon" section if you don't post sermons yet), you can hide it.

### Step 5a: Open `/app/page.tsx`

Near the bottom you'll see a list of imported sections being rendered:

```tsx
export default function HomePage() {
  return (
    <>
      <Hero />
      <NewHere />
      <ThisWeek />
      <LatestSermon />
      <Announcements />
      <BeliefsTeaser />
      <Newsletter />
    </>
  );
}
```

### Step 5b: Comment out (or delete) sections you don't want

To hide the latest-sermon section, wrap it in JSX comment syntax:

```tsx
      {/* <LatestSermon /> */}
```

Or delete the line entirely. Either works — comments preserve the intent in case you want it back later.

You can also reorder sections by swapping line positions. The page renders top-to-bottom in the order listed.

---

## What's next?

- [Maintenance](./09-maintenance.md) — the routine monthly tasks once your site is live.
- [Troubleshooting](./troubleshooting.md) — when something breaks.
- The [developer guides](../for-developers/) — if you find yourself wanting more.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new).*
