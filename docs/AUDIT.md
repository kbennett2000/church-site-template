---
title: Documentation Audit
date: 2026-05-15
type: reference
---

# Documentation Audit — 2026-05-15

This is a point-in-time read on how well the docs match the code, what's drifted, what's tribal knowledge that should be written down, and what's contradictory. Nothing is fixed yet — this is an action list, not a remediation log.

**Scope reviewed:** all 54 files under `/docs/` plus `CLAUDE.md`, `README.md`, `FAQ.md`, `SEED_DATA.md`. Cross-referenced against `auth.ts`, `middleware.ts`, `app/api/`, `lib/db/`, `lib/devotionals/`, `lib/digest/`, `lib/email/`, `lib/giving.ts`, `lib/admin/`, `tina/config.ts`, `drizzle/migrations/`, `drizzle.config.ts`, `vercel.json`, `package.json`.

**TL;DR:** The doc set is broad and well-organized. The big drift is that `CLAUDE.md` and `docs/for-developers/content-model.md` were not updated as Phase 2–4 features (devotionals, digest, giving providers, reading plans, admin OAuth) shipped — they describe an earlier project. The migration-strategy story is internally contradictory (one doc says `push`, another says `migrate`). A handful of one-session gotchas (stale JWT, Resend sandbox, tag merging) live only in commit messages and chat history.

---

## 1. Doc inventory

### Top-level (`docs/`)

| File | Type | One-liner |
|---|---|---|
| `README.md` | reference | Doc map: editors / tech volunteers / developers / case studies tracks. |
| `design.md` | explanation | Visual rationale; four built-in palettes with hex codes. |
| `SCREENSHOTS_NEEDED.md` | reference | Capture checklist for marketing, editor, tech-vol, case-study screenshots. |

### `case-studies/`

| File | Type | One-liner |
|---|---|---|
| `README.md` | reference | Why case studies exist + submission guidelines. |
| `_TEMPLATE.md` | case-study | Copy-paste template for new case-study submissions. |

> **Gap:** the inaugural MVC case study (`majestic-view-church.md`) is referenced in CLAUDE.md and README but **does not exist on disk**. Confirmed via `find docs/case-studies -type f`.

### `for-developers/`

| File | Type | One-liner |
|---|---|---|
| `architecture.md` | explanation | End-to-end system shape + Template vs. Instance + ADR-009 framing. |
| `content-model.md` | reference | Three-way coupling: Tina schema ↔ TS types ↔ loader. **Stale — covers ~10/20 collections.** |
| `adding-a-page.md` | tutorial | Static-route vs CMS-managed `/pages/[slug]` walkthrough. |
| `adding-a-cms-collection.md` | tutorial | How to add a new Tina collection end-to-end. |
| `adding-a-giving-provider.md` | how-to | Four-file checklist + Kindrid worked example. |
| `admin-access-followups.md` | explanation | Deferred work + the **stale-JWT gotcha** lives only here. |
| `architecture.md` | (see above) | |
| `database-migrations.md` | reference | `generate`/`migrate`/`push`; Drizzle workflow; Neon PITR. |
| `decision-log.md` | explanation | ADRs (1–9). |
| `devotional-architecture.md` | explanation | Four-phase design. **Still describes phases 2–4 as "next" — they shipped.** |
| `styling-and-theming.md` | reference | Semantic tokens + Tailwind config + anti-patterns. |
| `subscriber-data-model.md` | reference | Subscriber schema + tokens. **Says `drizzle-kit push` — wrong; code uses `migrate`.** |
| `subscriber-tags.md` | reference | Tag-based subscriber model; canonical "add a new email type" example. |
| `contributing.md` | explanation | PR flow + cherry-pick from template into an instance. |

### `for-editors/`

| File | Type | One-liner |
|---|---|---|
| `01-getting-started.md` | tutorial | First-time editor login + CMS tour. |
| `02-add-a-sermon.md` | how-to | Add sermon with video/audio/notes/thumbnail. |
| `03-edit-a-page.md` | how-to | Edit Our Story via rich-text. |
| `04-add-a-staff-member.md` | how-to | Add staff with photo/bio/title. |
| `05-update-service-times.md` | how-to | One-place edit of church-wide info. |
| `06-add-an-event.md` | how-to | Three recurrence patterns. |
| `07-upload-photos.md` | reference | Photo size/shape/quality guidelines. |
| `08-publishing-changes.md` | explanation | Save → commit → deploy in ~2 min. |
| `09-add-an-announcement.md` | how-to | Auto-expiring announcements. |
| `devotional-subscribers.md` | how-to | Subscriber states + double-opt-in for editors. |
| `glossary.md` | reference | Plain-English terms. |
| `managing-admin-access.md` | how-to | Granting/revoking Google admin access via CMS. |
| `managing-reading-plans.md` | how-to | Reading-plan creation, dated entries, Scripture API. |
| `managing-the-weekly-digest.md` | how-to | Weekly digest composition + pastor's note. |
| `setup-online-giving.md` | how-to | Seven providers, provider-specific setup. |
| `troubleshooting.md` | reference | Common editor issues. |

### `for-tech-volunteers/`

| File | Type | One-liner |
|---|---|---|
| `01-overview.md` | explanation | 30-min adoption arc. |
| `02-prerequisites.md` | reference | Codespaces vs local install. |
| `03-use-this-template.md` | how-to | The green "Use this template" click. |
| `04-first-time-setup.md` | how-to | `npm run setup` wizard. |
| `04a-customize-with-setup-script.md` | how-to | Prompt-by-prompt walkthrough. |
| `05-customize-branding.md` | how-to | Logo/photos/colors/fonts. |
| `06-deploy-to-vercel.md` | how-to | Vercel deploy. |
| `07-connect-domain.md` | how-to | DNS for custom domain. |
| `08-grant-editor-access.md` | how-to | Invite editors via TinaCloud. |
| `09-maintenance.md` | explanation | Monthly/quarterly/annual tasks. |
| `10-customize-deeper.md` | how-to | Ministries / pages / nav beyond setup. |
| `admin-access-basic-auth.md` | how-to | `ADMIN_PASSWORD` + Basic Auth. |
| `admin-access-google-oauth.md` | how-to | Auth.js v5 Google setup. **Doesn't surface stale-JWT gotcha.** |
| `email-deliverability.md` | how-to | SPF/DKIM/DMARC in Resend. |
| `environment-variables.md` | reference | Env-var catalog. |
| `setup-devotional-emails.md` | how-to | Postgres + devotionals end-to-end. |
| `setup-the-weekly-digest.md` | how-to | Weekly digest setup. |
| `troubleshooting.md` | reference | Common setup problems. |

### `marketing/`

| File | Type | One-liner |
|---|---|---|
| `elevator-pitch.md` | reference | Six pitches for different audiences. |
| `feature-comparison.md` | reference | vs. Wix/Squarespace/WordPress. |
| `one-pager.md` | reference | Single-page board pitch. |

---

## 2. Feature-by-feature audit

### a) Daily devotional email pipeline

**Code reality (verified):**
- Routes: `app/api/devotionals/{subscribe,verify,unsubscribe,manage}/route.ts`, `app/api/preferences/route.ts`, `app/api/cron/devotionals/route.ts`, `app/api/admin/devotionals/{send-test,backfill,export}/route.ts`
- Env vars actually read: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `DATABASE_URL` (or `POSTGRES_URL` fallback), `ADMIN_PASSWORD`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`, optional `NEXT_PUBLIC_ESV_API_KEY` / `BIBLIA_API_KEY`
- Cron: `0 * * * *` (hourly) per [vercel.json:4-5](vercel.json#L4-L5)
- Tables: `subscribers`, `subscriber_plans`, `devotional_send_log` (see [lib/db/schema.ts](lib/db/schema.ts))
- Double opt-in: subscribe → verification email → verify clicks link → status `active` → welcome email (best-effort)

**Docs in place:**
- [docs/for-tech-volunteers/setup-devotional-emails.md](docs/for-tech-volunteers/setup-devotional-emails.md)
- [docs/for-editors/devotional-subscribers.md](docs/for-editors/devotional-subscribers.md)
- [docs/for-developers/devotional-architecture.md](docs/for-developers/devotional-architecture.md)
- [docs/for-developers/subscriber-data-model.md](docs/for-developers/subscriber-data-model.md)

**Drift found:**
1. **[devotional-architecture.md](docs/for-developers/devotional-architecture.md) is frozen at "Phase 1."** It describes the subscriber DB, email rendering, and cron scheduling as "next phase / third phase / fourth phase." All four phases shipped (commits `0c2d6b6`, `8250791`, `95f88e0`). The architecture doc still reads as a forward-looking design.
2. **[setup-devotional-emails.md](docs/for-tech-volunteers/setup-devotional-emails.md) lists `CHURCH_EMAIL` as required for devotionals.** Devotional code does not read it — it's only used by `app/api/submit/*` form handlers. Misleading for someone setting up devotionals only.
3. **Verification token expiry behavior undocumented.** Code uses two queries: `findByVerificationToken` (only returns rows where token hasn't expired) vs. `findByVerificationTokenAny` (used to show a friendly "expired" page). Subscriber-data-model.md doesn't explain this split.
4. **Verification email subject line varies by tag** (`app/api/devotionals/subscribe/route.ts` ~L193-199) — undocumented.
5. **Re-subscription merges tags** (`subscribe/route.ts` ~L58-59) — important user-facing behavior that's invisible from the docs.

---

### b) Weekly digest email pipeline

**Code reality (verified):**
- Routes: `app/api/cron/digest/route.ts`, `app/api/admin/digest/{send-now,send-test}/route.ts`, admin preview page at `/admin/digest/preview`
- Cron: `0 * * * *` hourly, then checks day-of-week + hour-of-day from `content/digest-settings.json`, plus idempotency on `digest_send_log.week_start`
- Compose sources: announcements (past 7 days), events (next ~10 days), recent sermons, optional pastor's note from `content/digest-notes/*.md`
- Tag filter: `'digest' = ANY(tags)` (see `lib/db/queries.ts`)
- Bounce handling: hard bounce removes only the `digest` tag, does not mark the subscriber as bounced

**Docs in place:**
- [docs/for-tech-volunteers/setup-the-weekly-digest.md](docs/for-tech-volunteers/setup-the-weekly-digest.md)
- [docs/for-editors/managing-the-weekly-digest.md](docs/for-editors/managing-the-weekly-digest.md)

**Drift found:**
1. **`/api/admin/digest/send-test` route not mentioned in the setup doc's API reference.** The route exists and is wired to a UI control, but there's no canonical doc of its contract (request body, response shape, auth).
2. **`RESEND_FROM_EMAIL` override behavior is mentioned but not explained.** Setup-devotional-emails.md explains "the env var overrides the CMS field"; setup-the-weekly-digest.md mentions it in passing without the same clarity. Inconsistent quality between two parallel docs.
3. **`force=true` query param on `/api/admin/digest/send-now`** (deletes prior `digest_send_log` row and re-sends) is undocumented. This is a foot-gun — there's nothing telling an operator what happens if they hit it twice.
4. **Pastor's note workflow is documented in editor doc but not architecturally.** The state model (`status: draft|ready`, `week_of` field, Monday-of-week semantics) lives in TinaCMS schema + editor doc only; no developer reference.

---

### c) Subscriber tag architecture

**Code reality (verified):**
- `subscribers.tags` is a Postgres text array, default `{}` (`lib/db/schema.ts:56`)
- Migration `0001_cool_paper_doll.sql` adds the column and backfills active + pending_verification rows with `['devotionals']`
- Tags currently in use: `devotionals`, `digest`
- Filters: `'devotionals' = ANY(tags)` (devotional cron), `'digest' = ANY(tags)` (digest cron)

**Docs in place:**
- [docs/for-developers/subscriber-tags.md](docs/for-developers/subscriber-tags.md) — comprehensive, canonical
- [docs/for-developers/subscriber-data-model.md](docs/for-developers/subscriber-data-model.md) — overlaps

**Drift found:**
1. **subscriber-tags.md and subscriber-data-model.md overlap and don't cross-reference cleanly.** Each describes part of the same model. Reader has to read both to see the whole picture. Not contradictory — just redundant.
2. **The "preferences page" referenced in the doc lives at `/app/preferences/page.tsx`; the API at `/app/api/preferences/route.ts`.** The doc says "add to the `SUBSCRIPTION_TYPES` array" in the preferences page — that array does exist, but the relationship between `SUBSCRIPTION_TYPES` and the Tina schema feature flags isn't called out.

---

### d) Reading plan management

**Code reality (verified):**
- TinaCMS collection `readingPlans` (`tina/config.ts:914-1074`) — nested entries with date, scripture refs, optional body, style, multiple translations
- Content lives at `content/reading-plans/*.md`
- Subscribers are linked via the `subscriber_plans` table

**Docs in place:**
- [docs/for-editors/managing-reading-plans.md](docs/for-editors/managing-reading-plans.md) — editor-facing, in good shape

**Drift / gaps:**
1. **No developer-facing doc.** `content-model.md` doesn't mention the `readingPlans` collection at all. There's no reference for the field shape, loader, or how `subscriber_plans` relates to it. A developer adding a new field has to read `tina/config.ts` cold.
2. **Scripture-API integration is alluded to but not architectural.** `lib/devotionals/scripture-api.ts` exists; there's no developer reference for which providers are supported, which env vars unlock which translation, fallback order.

---

### e) Giving / Planning Center provider-agnostic integration

**Code reality (verified):**
- Seven providers fully wired in `lib/giving.ts`: `planning_center`, `tithely`, `pushpay`, `subsplash`, `stripe`, `custom_url`, `offline_only`
- Selection driven by `content/giving.json` (CMS singleton)
- Special cases: Planning Center has a modal script injected from `app/layout.tsx`; Subsplash uses an embed; others are URL redirects
- `displayMode` field controls Planning Center modal vs link

**Docs in place:**
- [docs/for-developers/adding-a-giving-provider.md](docs/for-developers/adding-a-giving-provider.md) — solid four-file checklist
- [docs/for-editors/setup-online-giving.md](docs/for-editors/setup-online-giving.md) — covers all 7 providers

**Drift found:**
1. **Doc framing implies providers are scaffolding.** Opening reads like "the system is designed to be extended" — true, but reads as "you'll have to wire most of them yourself." All 7 are fully wired. Update the framing to: "ships with 7 providers; here's how to add an 8th."
2. **`displayMode` is invisible in the contributor doc.** A new contributor adding a provider with multiple display modes (e.g., link/iframe) won't know to model it.
3. **Local-testing flow is undocumented.** Editor doc says "save and visit your live site" — fine for editors, but a developer iterating on a new provider needs to know to edit `content/giving.json` locally and run `npm run cms`.

---

### f) Email logo URL handling

**Code reality (verified):**
- `lib/email/logo-url.ts` exports `resolveEmailImageUrl()` (added in commit `f38438d`)
- Behavior: empty → "", protocol-relative → `https:` prefix, absolute → pass through, relative → prefix with `NEXT_PUBLIC_SITE_URL`, localhost → warn
- Called by both devotional and digest email send paths

**Docs in place:**
- [docs/for-editors/managing-reading-plans.md](docs/for-editors/managing-reading-plans.md#L158-173) (devotional logo)
- [docs/for-editors/managing-the-weekly-digest.md](docs/for-editors/managing-the-weekly-digest.md#L75-91) (digest logo)

**Drift found:**
Editor docs are accurate. Developer-side architecture (the resolver function, the localhost warning, why this exists) is **undocumented**. The story sits in the commit message and nowhere else.

---

### g) Admin authentication (Basic Auth + Google OAuth via Auth.js v5)

**Code reality (verified):**
- Provider chosen by `content/site.json` → `adminAuth.provider` field (`"basic"` or `"google"`)
- Google path: `auth.ts` requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`; JWT strategy with 30-day max age
- Allowlist: union of `content/admin-access.json` (CMS-editable) + `ADMIN_ALLOWLIST` env var (bootstrap only)
- Basic Auth path: `middleware.ts` does timing-safe compare; in-memory IP rate limiter (10 fails / 10 min → 429)
- Protected routes: `/admin/devotionals/*`, `/admin/digest/*`, `/api/admin/*`

**Docs in place:**
- [docs/for-tech-volunteers/admin-access-basic-auth.md](docs/for-tech-volunteers/admin-access-basic-auth.md)
- [docs/for-tech-volunteers/admin-access-google-oauth.md](docs/for-tech-volunteers/admin-access-google-oauth.md)
- [docs/for-editors/managing-admin-access.md](docs/for-editors/managing-admin-access.md)
- [docs/for-developers/admin-access-followups.md](docs/for-developers/admin-access-followups.md)

**Drift found:**
1. **The stale-JWT gotcha is buried in a "follow-ups" doc.** When an editor adds a new admin via the CMS, the JWT for an already-signed-in user does *not* re-evaluate `isAdmin` until they sign out and back in (or until the JWT expires, up to 30 days). This is the single most likely real-world admin-onboarding bug, and it lives in `admin-access-followups.md` rather than in `managing-admin-access.md` (the editor doc) or `admin-access-google-oauth.md` (the setup doc).
2. **The combined-allowlist union (CMS + env var) is undocumented.** `managing-admin-access.md` mentions `ADMIN_ALLOWLIST` exists but not how it composes with the CMS list, or that it should be removed after bootstrap.
3. **Basic Auth username phrasing.** `admin-access-basic-auth.md:L82` says "the username can be anything" — confusing; the code accepts any username and validates only the password.
4. **Rate limiter is in-memory.** If Vercel runs multiple instances, the limiter is per-instance. Not catastrophic, but worth noting in the basic-auth doc.

---

### h) Database migration strategy

**Code reality (verified):**
- `drizzle.config.ts` reads `DATABASE_URL` then falls back to `POSTGRES_URL`
- Three migration files exist: `0000_nebulous_puff_adder.sql`, `0001_cool_paper_doll.sql`, `0002_green_midnight.sql`
- `package.json` scripts: `db:generate` (create SQL), `db:migrate` (apply), `db:push` (dev-only schema sync), `db:studio`, `db:setup` (interactive)
- Recent commit `5999f58` is titled "Safe migrations" — context not captured in docs

**Docs in place:**
- [docs/for-developers/database-migrations.md](docs/for-developers/database-migrations.md)

**Drift found:**
1. **🔴 CONTRADICTION:** [`subscriber-data-model.md`](docs/for-developers/subscriber-data-model.md) lines ~18, 27, 142 claim the project uses `drizzle-kit push` and explicitly says "not SQL migration files." This is **wrong** — the project shipped to migration files (commit `5999f58`) and the canonical guide [`database-migrations.md`](docs/for-developers/database-migrations.md) describes the correct workflow.
2. **`POSTGRES_URL` fallback not documented.** Vercel Postgres sets `POSTGRES_URL` automatically; `drizzle.config.ts` accepts either. The migration doc only mentions `DATABASE_URL`.
3. **No guidance on where migrations run in production.** "Add `npm run db:migrate` to your build command" — when? Before `next build`? In a separate Vercel hook? Implicit but not spelled out.
4. **Neon PITR section (lines ~186-194) is provider-specific** and not flagged as such. A Supabase or RDS adopter will read it and wonder what to do.

---

### i) TinaCMS configuration and collections

**Code reality (verified):**
- `tina/config.ts` defines **20 collections**: site, navigation, story, beliefs, events, pages, staff, elders, ministries, sermons, announcements, groups, serve_roles, giving, prayer_requests, readingPlans, devotionalEmailSettings, digestSettings, digestNotes, adminAccess

**Docs in place:**
- [docs/for-developers/content-model.md](docs/for-developers/content-model.md) — only covers ~10
- [docs/for-developers/adding-a-cms-collection.md](docs/for-developers/adding-a-cms-collection.md) — tutorial, fine
- Editor docs cover some collections individually

**Drift found:**
1. **🔴 CLAUDE.md says "14 collections" (twice — in the "Where everything lives" section and the TinaCMS section).** Code has 20. The four post-Phase-2 collections (`readingPlans`, `devotionalEmailSettings`, `digestSettings`, `digestNotes`) and `adminAccess` are missing from the count.
2. **`content-model.md` documents ~10 of 20 collections.** Missing: `readingPlans`, `devotionalEmailSettings`, `digestSettings`, `digestNotes`, `adminAccess`, `prayer_requests`, `groups`, `serve_roles`, `navigation` (only implicit), `giving` (only partial). For a developer who treats `content-model.md` as the canonical content reference, this is a significant blind spot.
3. **Conventions not documented:** `isBody: true` pattern, `match: { include: "site" }` for singletons vs. directories, frontmatter-vs-JSON split per collection. These are real gotchas when adding a collection.

---

### j) Cherry-pick workflow between template and adopter repos

**Docs in place:**
- [docs/for-developers/contributing.md](docs/for-developers/contributing.md) lines ~231-295

**Coverage:**
- Three approaches (manual cherry-pick, `git-template-sync`, don't sync)
- Mentions one known fix (Turbopack workspace-root)
- Reverses the direction: how to push changes *back* from an instance to the template

**Drift / gaps:**
1. **No clear recommendation.** Reader is given three options and no opinion. For most churches, "selective sync via manual cherry-pick" is the right answer — say so.
2. **Schema-migration conflicts not addressed.** If the template adds a new column and the instance has customized its own schema, cherry-picking the migration file will misbehave. Not mentioned.
3. **"Known fixes worth syncing" is a one-item list.** As the template iterates this should be a maintained ledger, not a paragraph.
4. **No guidance on tracking template version in an instance.** Should the instance pin a template SHA? Tag-track? Bookmark commits? Open question.

---

## 3. Tribal knowledge to write down

Things that took diagnostic work or live only in commit messages / chat:

1. **Stale JWT when adding a new admin.** Listed under (g). Belongs in [managing-admin-access.md](docs/for-editors/managing-admin-access.md) ("Why the new admin can't sign in for up to 30 days") with the workaround: have them sign out and sign back in.
2. **Resend sandbox sender limits.** `onboarding@resend.dev` (the default unverified sender) can only deliver to the verified account-owner email. Editors testing without a verified domain will think the system is broken. Belongs in [email-deliverability.md](docs/for-tech-volunteers/email-deliverability.md) and [setup-devotional-emails.md](docs/for-tech-volunteers/setup-devotional-emails.md).
3. **Env-var setup order.**
   - `DATABASE_URL`/`POSTGRES_URL` must be set before `db:setup` / `db:migrate` runs.
   - `NEXTAUTH_SECRET` must be set before any `/admin/` Google route works (will 500 silently).
   - `ADMIN_ALLOWLIST` should be set during bootstrap, then *removed* after the first Google sign-in adds the editor to the CMS-managed allowlist.
   - `NEXT_PUBLIC_SITE_URL` must be set before email logos render correctly in production.
   - `CRON_SECRET` must be set before the Vercel cron will accept requests.
   - None of this ordering is captured anywhere.
4. **Tag merging on re-subscription.** Subscribe route unions new tags with existing tags. Important UX behavior that editors should understand (someone resubscribing to digest doesn't lose devotional access).
5. **Welcome email is best-effort post-verification.** If the welcome email fails, verification still succeeds. Operational gotcha.
6. **Verification email subject varies by tag.** Useful to know when triaging "did the user see the right email?"
7. **`force=true` on `/api/admin/digest/send-now`.** Wipes the prior `digest_send_log` row. Power-tool with no warning.
8. **In-memory rate limiter on Basic Auth** doesn't share state across Vercel function instances.
9. **TinaCMS conventions:** `isBody: true`, `match` for singletons, frontmatter vs. JSON split. Not in `adding-a-cms-collection.md`.
10. **Local testing for giving providers.** Edit `content/giving.json` and run `npm run cms` — obvious to devs, undocumented for tech volunteers.
11. **Scripture API fallback order** in `lib/devotionals/scripture-api.ts` — which API is tried first, what happens on failure, what triggers `BIBLIA_API_KEY` vs `NEXT_PUBLIC_ESV_API_KEY`.
12. **Logo URL resolver behavior** (lib/email/logo-url.ts) — relative vs absolute vs protocol-relative vs localhost. Editors get the "what to type"; devs don't get the "what it does."

---

## 4. Redundant or contradictory docs

| # | Topic | Files | Verdict |
|---|---|---|---|
| 1 | Migration strategy | [subscriber-data-model.md](docs/for-developers/subscriber-data-model.md) says `drizzle-kit push`; [database-migrations.md](docs/for-developers/database-migrations.md) and [setup-devotional-emails.md](docs/for-tech-volunteers/setup-devotional-emails.md) say `drizzle-kit migrate` | **Contradictory.** Fix subscriber-data-model.md. |
| 2 | Devotional architecture | [devotional-architecture.md](docs/for-developers/devotional-architecture.md) calls phases 2–4 "next"; reality (vercel.json, lib/devotionals/) shows shipped | **Stale.** Rewrite or add a "Status: shipped" header. |
| 3 | Collection count | [CLAUDE.md](CLAUDE.md) says 14; [tina/config.ts](tina/config.ts) defines 20 | **Stale.** Update CLAUDE.md. |
| 4 | Subscriber model | [subscriber-data-model.md](docs/for-developers/subscriber-data-model.md) and [subscriber-tags.md](docs/for-developers/subscriber-tags.md) overlap on the schema and tag semantics | **Redundant but not contradictory.** Consider merging or making one defer to the other. |
| 5 | Admin access | [admin-access-followups.md](docs/for-developers/admin-access-followups.md) (stale-JWT gotcha) is the *only* doc that surfaces a critical operational bug; the user-facing [managing-admin-access.md](docs/for-editors/managing-admin-access.md) doesn't mention it | **Gap, not contradiction.** The "follow-ups" framing buries it. |
| 6 | Two `troubleshooting.md` files | [for-editors/troubleshooting.md](docs/for-editors/troubleshooting.md) and [for-tech-volunteers/troubleshooting.md](docs/for-tech-volunteers/troubleshooting.md) | Likely fine (different audiences), but worth a once-over for overlap. |
| 7 | Sender-email override | setup-devotional-emails.md and setup-the-weekly-digest.md describe the same `RESEND_FROM_EMAIL`-overrides-CMS pattern with inconsistent clarity | **Inconsistent voice.** Pick one source of truth and link from the other. |
| 8 | MVC case study | Referenced by `CLAUDE.md`, `README.md`, `docs/README.md`, `CHANGELOG.md`; file `docs/case-studies/majestic-view-church.md` doesn't exist | **Broken links.** Either create the file or remove the references. |

---

## 5. Prioritized action list

### 🔴 Blocker for launch

1. **Fix the contradiction.** [subscriber-data-model.md](docs/for-developers/subscriber-data-model.md) — replace `drizzle-kit push` references (lines ~18, 27, 142) with the actual workflow described in [database-migrations.md](docs/for-developers/database-migrations.md). A developer following the wrong doc could blow away a production table.
2. **Surface the stale-JWT gotcha** in the editor-facing [managing-admin-access.md](docs/for-editors/managing-admin-access.md) and the setup doc [admin-access-google-oauth.md](docs/for-tech-volunteers/admin-access-google-oauth.md). One paragraph each. This is the #1 onboarding failure mode for any church adding a second admin.
3. **Update [CLAUDE.md](CLAUDE.md)** to reflect 20 collections, not 14, and to acknowledge phases 2–4 shipped. Affects every future Claude session — every one of them will start with a wrong model.
4. **Either create [`docs/case-studies/majestic-view-church.md`](docs/case-studies/majestic-view-church.md) or remove all references to it.** Broken links in the public README are a worse first impression than no case study.

### 🟠 Needed for adoption

5. **Rewrite [devotional-architecture.md](docs/for-developers/devotional-architecture.md)** as a "Status: shipped" architecture doc — covers current reality of the four-phase pipeline, not a forward-looking design.
6. **Expand [content-model.md](docs/for-developers/content-model.md)** to cover the missing 10 collections (`readingPlans`, `devotionalEmailSettings`, `digestSettings`, `digestNotes`, `adminAccess`, `prayer_requests`, `groups`, `serve_roles`, `navigation`, `giving`). Document the `isBody`, `match`-singleton, and frontmatter-vs-JSON conventions inline.
7. **Add an "Env var setup order" section** to [environment-variables.md](docs/for-tech-volunteers/environment-variables.md). Cover the five ordering constraints listed in section 3.
8. **Document Resend sandbox sender limits** in [email-deliverability.md](docs/for-tech-volunteers/email-deliverability.md). One-paragraph "before you have a verified domain, the only address you can email is your own."
9. **Remove the spurious `CHURCH_EMAIL` reference** from [setup-devotional-emails.md](docs/for-tech-volunteers/setup-devotional-emails.md) Step 6. Devotional code doesn't read it.
10. **Add a developer-facing reading plan reference.** Field shape, loader pattern, `subscriber_plans` relationship, Scripture API providers. One new section in `content-model.md` or a dedicated `reading-plan-architecture.md`.
11. **Strengthen the cherry-pick guide.** Pick a recommendation (manual cherry-pick is the safe default), add a paragraph on schema-migration conflicts, and convert "known fixes worth syncing" into a maintained ledger.

### 🟡 Nice to have

12. **Reframe the giving-provider doc** to lead with "ships with 7 providers" instead of "designed to be extended." Add a provider-status table and a local-testing flow.
13. **Document `displayMode`** in the giving provider contributor doc.
14. **Document the email logo URL resolver** (`lib/email/logo-url.ts`) for developers — what each input format does, why the function exists.
15. **Note the in-memory rate limiter caveat** in [admin-access-basic-auth.md](docs/for-tech-volunteers/admin-access-basic-auth.md) (multi-instance Vercel won't share state).
16. **Document `?force=true`** on `/api/admin/digest/send-now`, with a warning about idempotency.
17. **Cross-link subscriber-tags.md and subscriber-data-model.md** so readers see one canonical entry point.
18. **Document undocumented behaviors in the subscribe route:** tag merging on re-subscription, verification token expiry split, verification subject by tag, welcome email best-effort.
19. **Flag the Neon PITR section** in `database-migrations.md` as "If you're using Neon (recommended)…" so non-Neon adopters know to skip it.
20. **Document Scripture API fallback order** and which env vars unlock which translation.

### 🟢 Backlog

21. Audit `for-editors/troubleshooting.md` vs `for-tech-volunteers/troubleshooting.md` for redundancy.
22. Update the [content-model.md](docs/for-developers/content-model.md) example to match the post-Phase-2 collection shape (current examples are Phase-1-era).
23. Pastor's-note workflow architecture doc (state model, `weekOf` Monday semantics, `status` transitions). Currently editor-only.
24. Decide whether to merge `subscriber-tags.md` into `subscriber-data-model.md` or vice versa.

---

## Files that need creating

- **None strictly required.** All gaps can be addressed by editing existing files.
- **Optional new file:** `docs/for-developers/reading-plan-architecture.md` (developer reference for the reading-plan collection + Scripture API + `subscriber_plans` linkage). Alternative: add a section to `content-model.md`.

## Files that need deleting

- **None.** Even the stale docs (`devotional-architecture.md`, parts of `subscriber-data-model.md`) are salvageable with a rewrite — the underlying structure is sound.

---

## Honest assessment

The docs were last comprehensively reviewed during pre-launch (the `docs/PRE_LAUNCH_REVIEW.md` pass referenced in `CLAUDE.md` — note: that file also no longer exists on disk, another broken reference). Everything shipped since — devotionals, digest, giving providers, reading plans, Google OAuth, the migration strategy switch — has docs *somewhere*, but the canonical references (`CLAUDE.md`, `content-model.md`, `devotional-architecture.md`, `subscriber-data-model.md`) were not kept in sync.

The fastest path to "trustworthy" is items 1–4 above. Items 5–11 close the gaps that would cause an adopting church or new contributor to get stuck. The rest is polish.

The good news: no doc misleads you in a way that would corrupt data *except* the migration-strategy contradiction in `subscriber-data-model.md`. Fix that first.

---

## Pass 1 completed — 2026-05-15

All four 🔴 blocker items resolved in a single focused pass. Items 5+ are still open.

### Blocker 1 — Migration-strategy contradiction ✅

**File:** [`docs/for-developers/subscriber-data-model.md`](docs/for-developers/subscriber-data-model.md)

Removed the three references to `drizzle-kit push`. The doc now defers to [`database-migrations.md`](docs/for-developers/database-migrations.md) for the workflow, the "Adding columns" walkthrough was rewritten to use the `generate` → review → commit → `migrate` flow, and the "no migration history file" claim was replaced with "the source of truth is the committed migration files plus `schema.ts`."

### Blocker 2 — Stale-JWT gotcha surfaced ✅

**Files:**
- [`docs/for-editors/managing-admin-access.md`](docs/for-editors/managing-admin-access.md) — added a "Common issue: a new admin still can't sign in" section in plain language for editors.
- [`docs/for-tech-volunteers/admin-access-google-oauth.md`](docs/for-tech-volunteers/admin-access-google-oauth.md) — added a "Known limitation: stale JWT after allowlist change" section that explains the 30-day JWT max age, why Auth.js v5 JWT-strategy mode doesn't re-evaluate `isAdmin` per request, and links to the editor doc + the followups doc.
- [`docs/for-developers/admin-access-followups.md`](docs/for-developers/admin-access-followups.md) — added a header note cross-linking to both user-facing surfaces. The technical analysis and fix-options discussion remain canonical here.

### Blocker 3 — CLAUDE.md reality check ✅

**File:** [`CLAUDE.md`](CLAUDE.md)

- "14 collections" → "20 collections" with the full list inline.
- Email stack description extended to mention the daily devotional and weekly digest pipelines.
- Directory tree updated: removed `PRE_LAUNCH_REVIEW.md`, `USABILITY_REVIEW.md`, `USABILITY_REVIEW_RAW.md` and `video-scripts/` (none on disk); added `AUDIT.md`; described `majestic-view-church.md` as "placeholder until launch."
- "Files to read if going deep" list now references `AUDIT.md` instead of the missing `PRE_LAUNCH_REVIEW.md`.
- The MVC-grep-sweep paragraph no longer points to the missing review doc — it just inlines the actual grep command.
- Inline HTML `<!-- FLAG: ... -->` comments left at three spots where load-bearing references depended on the now-missing `PRE_LAUNCH_REVIEW.md` (the v0.1.0 release-announcement draft, the repo-description draft, the persona role-play summary). The user should decide whether to recreate those drafts or replace those references.
- Bonus flag: `CHANGELOG.md` is also missing from disk despite being referenced in CLAUDE.md and elsewhere — flagged in-line.

### Blocker 4 — MVC case study placeholder created ✅

**File:** [`docs/case-studies/majestic-view-church.md`](docs/case-studies/majestic-view-church.md) (new)

Created a warm placeholder that names MVC, explains why MVC was chosen as the inaugural adopter (small congregation, volunteer-led editors, prior bad experience with unmaintainable site), lists the full template feature set as deployed, and ends with "Full case study coming after launch." Closes the broken links from `README.md`, `CLAUDE.md`, `docs/README.md`, and elsewhere. The placeholder can be expanded with screenshots, quotes, and metrics post-launch without restructuring.

### What's still open

Everything else in this audit — items 5 through 24 in §5, plus the tribal-knowledge gaps in §3 and the redundancies in §4 — remains untouched. Pass 1 was strictly scoped to the four launch-blockers. Two unrelated broken-reference issues surfaced during the CLAUDE.md edit and are flagged inline: the missing `PRE_LAUNCH_REVIEW.md` (and its launch-copy appendices) and the missing `CHANGELOG.md`. Both are out of scope for this pass.
