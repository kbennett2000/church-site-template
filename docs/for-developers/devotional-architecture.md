---
type: explanation
audience: developers
---

# Devotional System Architecture

The daily devotionals feature has four major parts built across multiple implementation phases:

1. **Plans + scripture API** (this phase) — reading plans as git content, scripture fetched from a Bible API.
2. **Subscriber database** (next phase) — opt-in/opt-out, per-plan subscriptions.
3. **Email rendering** (third phase) — HTML emails with inline styles, per-style templates.
4. **Cron scheduling** (fourth phase) — daily send job, error handling, send logs.

This document covers the design rationale for the full system, with current implementation status noted per section.

---

## Plans vs. subscribers: why the separation?

Reading plans are **content** — they're authored by pastors, should be version-controlled, and need a CMS UI. They belong in git alongside sermons and ministries.

Subscriber lists are **operational data** — they grow in real time, have PII concerns, and need per-record mutable state (opted-in, opted-out, bounced). They don't belong in git.

The separation means:
- A pastor can create and edit a plan without touching code or a database.
- The subscriber system can be added, replaced, or migrated independently.
- Plans are portable — copy the markdown file to any church's instance.

---

## Why scripture lives in an API, not the plan

Storing verse text in the plan would mean:
- **Copyright exposure.** Most modern translations are under copyright. Storing the full text creates a copy — even in a private database. Fetching on demand is an API call covered by the translation's terms of service.
- **Maintenance burden.** If the church changes translations, every plan entry would need to be re-populated.
- **Size.** A 90-day plan in WEB translation would be ~200 KB of verse text in frontmatter. That's a lot of YAML for editors to scroll past.

The plan stores only the reference ("John 3:16-21"). The API fetch is fast (~200ms), cached in memory during a server process, and can be swapped to a different translation without touching content files.

---

## Scripture provider architecture

```
fetchScripture(reference, translation)
        │
        ├─ BibleApiProvider   (KJV, ASV, WEB, BBE — no key needed)
        │    └─ https://bible-api.com/{ref}?translation={t}
        │
        ├─ EsvProvider        (ESV — requires NEXT_PUBLIC_ESV_API_KEY)
        │    └─ https://api.esv.org/v3/passage/text/
        │
        └─ BibliaProvider     (NIV, NLT, CSB, NKJV, NRSV — requires BIBLIA_API_KEY)
             └─ https://api.biblia.com/v1/bible/content/
```

All providers implement `ScriptureProvider.fetchPassage(reference, translation)` and return `PassageResult { text, html, attribution, translation }`.

**Fallback behavior:** If a licensed translation's API key is missing, the provider logs a warning and falls back to WEB (public domain). This means plans that specify ESV still display something readable without crashing — important for a template that ships without API keys.

**Adding a new provider:** Implement `ScriptureProvider`, return a `PassageResult`, register the provider in `fetchScripture()` in `/lib/devotionals/scripture-api.ts`.

### Caching

**Current:** In-memory `Map<string, PassageResult>` keyed by `{translation}::{reference}`. Survives the lifetime of the Node.js process. Cleared on server restart.

**Implication at build time:** `generateStaticParams` pre-renders all entry pages for all plans. Each page calls `fetchScripture()`. The in-memory cache deduplicates calls within a single build run (e.g., if the same reference appears in two plans). New plans added after the last build aren't pre-rendered until the next build — Vercel handles this via on-demand revalidation when TinaCMS commits content.

**Next phase:** A durable Redis or KV cache (e.g., Vercel KV) keyed by reference+translation+date, with a 24-hour TTL. This prevents the build from hammering the Bible API when a 90-entry plan is first activated.

---

## Adding a new style

Each `DevotionalStyle` value ("soap", "simple", "lectio_divina") affects three things:

1. **The website entry page** (`app/devotionals/[planSlug]/[date]/page.tsx`) — conditionally renders journaling sections based on `plan.style`.
2. **The email template** (third phase) — uses the style to pick the right intro/outro from `EmailTemplateContent.styleOverrides` and to include or omit journaling prompts.
3. **The TinaCMS select field** (`tina/config.ts`, collection `readingPlans`, field `style`) — the dropdown options editors see.

To add a new style (e.g., `"verse_memorization"`):

1. Add it to the `DevotionalStyle` union in `/lib/devotionals/types.ts`.
2. Add the label to `STYLE_LABELS` in the listing and plan pages.
3. Add a conditional block in the entry page for the style's journaling prompts.
4. Add the TinaCMS option to `tina/config.ts`.
5. Wire up email rendering in the email template (third phase).

---

## Content loader (`/content/devotionals.ts`)

Follows the same pattern as `/content/sermons.ts`:

- **Functions, not top-level constants** — avoids caching stale content when TinaCMS edits markdown files during `npm run cms`. Next.js server components re-execute per request in dev, so functions re-read the file system each time.
- **Reads only direct children of `content/reading-plans/`** — the `_examples/` subdirectory is skipped because `readdirSync` entries for directories don't end in `.md`.
- **Entries are sorted ascending by date** at load time so the plan schedule renders in chronological order.
- **No validation** beyond filtering entries with empty date or reference. Future improvement: warn or throw if two entries share a date within the same plan.

---

## Feature flag

`features.devotionals` in `content/site.json` / `content/site.ts` gates every `/devotionals` page with `notFound()`. When false (the default in the template), the pages return 404. The TinaCMS collection still appears in the admin for tech volunteers to pre-populate before launch.

This flag is intentionally a code-level setting (json file, not a database flag) because:
- It's a one-time deployment decision, not a runtime toggle.
- It needs to survive a Vercel deployment without a separate config service.
- Editors shouldn't accidentally disable it mid-flight.

Tech volunteers set it in Site Settings → Feature Flags → Daily Devotionals (visible in the CMS since it's part of the site collection), or by editing `content/site.json` directly.

---

## Email settings singleton

`content/devotional-email-settings.json` holds one configuration that applies to all plans. Rationale for a singleton:

- Most churches send devotionals from one address with one visual identity.
- Per-plan sender names/colors would require N configurations that mostly duplicate each other.
- Per-plan overrides (SOAP intro vs. Simple intro) are handled via `styleOverrides` within the single doc.

If a church needs truly per-plan sender addresses (e.g., men's ministry vs. women's ministry each use different senders), add a `senderEmailOverride` field to the plan schema and fall back to the singleton when absent.

---

## Translation licensing summary

| Translation | Provider | Key env var | Attribution required |
|---|---|---|---|
| WEB | bible-api.com | none | No |
| KJV | bible-api.com | none | No |
| ASV | bible-api.com | none | No |
| BBE | bible-api.com | none | No |
| ESV | api.esv.org | `NEXT_PUBLIC_ESV_API_KEY` | Yes — included in `PassageResult.attribution` |
| NIV | api.biblia.com | `BIBLIA_API_KEY` | Verify at biblia.com/api |
| NLT | api.biblia.com | `BIBLIA_API_KEY` | Verify at biblia.com/api |
| CSB | api.biblia.com | `BIBLIA_API_KEY` | Verify at biblia.com/api |
| NKJV | api.biblia.com | `BIBLIA_API_KEY` | Verify at biblia.com/api |
| NRSV | api.biblia.com | `BIBLIA_API_KEY` | Verify at biblia.com/api |

**Important:** Before enabling a licensed translation for email delivery, verify that the API's terms of service cover your use case (i.e., bulk email to subscribers). Most translation APIs are licensed for display/reference use; mass email may require a separate arrangement with the publisher.

---

## Page architecture

| Route | Rendering | Notes |
|---|---|---|
| `/devotionals` | Server Component, `revalidate: 3600` | "Today's entry" uses `new Date()` server-side. Hourly revalidation keeps it current. |
| `/devotionals/[planSlug]` | Static + `generateStaticParams` | Pre-rendered for every plan. Includes a progress bar calculated from today's date — refreshes on revalidation. |
| `/devotionals/[planSlug]/[date]` | Static + `generateStaticParams` | Pre-rendered for every entry. Scripture is fetched at build time. Future entries show a locked state without hitting the API. |

Future entries are accessible at their URL but return a "not yet" page rather than the scripture content. The `generateStaticParams` pre-renders those pages too — only the rendered content is gated, not the route itself.

---

## File map

```
lib/devotionals/
  types.ts               — ReadingPlan, ReadingPlanEntry, PassageResult, EmailTemplateContent
  scripture-api.ts       — ScriptureProvider interface, BibleApiProvider, EsvProvider, BibliaProvider

content/
  devotionals.ts         — Content loader (getAllReadingPlans, getReadingPlan, getEntryForDate, etc.)
  devotional-email-settings.json  — Singleton email config
  reading-plans/
    .gitkeep             — Holds the directory in git; churches create plan files here
    _examples/
      psalms-in-30-days.md        — 30-day starter (Psalm 1–30)
      gospels-in-90-days.md       — 90-day starter (Matthew–John)

tina/config.ts           — readingPlans collection (collection 16) + devotionalEmailSettings (collection 17)
                           site collection updated with features.devotionals flag

app/devotionals/
  page.tsx               — /devotionals listing page
  [planSlug]/page.tsx    — /devotionals/[slug] plan detail
  [planSlug]/[date]/page.tsx  — /devotionals/[slug]/[date] daily entry

docs/for-editors/managing-reading-plans.md
docs/for-developers/devotional-architecture.md  ← this file
```

---

## What's next (subsequent phases)

**Phase 2 — Subscriber database:**
- Database schema: `subscribers(id, email, name, created_at)`, `plan_subscriptions(subscriber_id, plan_slug, active)`.
- Route handlers: `POST /api/devotionals/subscribe`, `GET /api/devotionals/unsubscribe?token=`.
- Replace the disabled "Subscribe" buttons with a working form.

**Phase 3 — Email rendering:**
- An `EmailTemplate` function that accepts `{ entry, passage, plan, settings }` and returns `{ subject, html, text }`.
- Inline CSS for email client compatibility.
- Per-style template branches (SOAP journal prompts, Lectio movements).
- `PassageResult.attribution` injected into the footer when non-empty.

**Phase 4 — Cron scheduling:**
- A Vercel Cron job at `app/api/cron/devotionals/route.ts` running at 6 AM in the church's local timezone.
- Looks up today's date, finds each active plan's matching entry, renders the email, sends via Resend to all active subscribers for that plan.
- Idempotent: records sends in a log table to prevent double-sending on retry.
- Durable scripture cache (Vercel KV) to avoid repeated API calls on the same day.
