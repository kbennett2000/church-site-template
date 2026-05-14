# Project context for Claude

> **What this file is:** a self-contained handoff for resuming work on the Church Site Template in a new Claude session — on a new machine, in a new window, or after a long gap. Claude Code auto-loads `CLAUDE.md` from the repo root, so this file becomes context automatically. No need to paste it manually.
>
> **What this file is not:** a substitute for the docs in `/docs/`. Read those for architecture, content model, and adoption flow. This file captures the *conversation-level* context that wouldn't otherwise be in the repo.

---

## Project at a glance

| | |
|---|---|
| **Project** | Church Site Template — a free, mobile-first website template for small churches |
| **Repo (public)** | `github.com/kbennett2000/church-site-template` |
| **Local path** | `c:\Users\KB\Desktop\Projects\church-site-template` (Windows) |
| **Status** | v0.1.0 — feature-complete, three launch blockers remain (see below) |
| **License** | MIT |
| **Owner** | Kris Bennett (`kbennett2000` on GitHub, `kbennett2000@gmail.com`) |
| **Origin** | Generalized from a prototype redesign for Majestic View Church (Kiowa, CO) |

### Stack

- **Framework:** Next.js 16 (App Router, RSC, static export)
- **UI:** React 19, Tailwind CSS 3.4, semantic-token theme system, shadcn-style primitives in `/components/ui/`
- **Type system:** TypeScript 5.6 strict mode
- **CMS:** Decap CMS (git-based, editorial workflow) at `/admin/`
- **Content:** Markdown + frontmatter (via `gray-matter`) and JSON in `/content/`
- **Icons:** `lucide-react`
- **Fonts:** Inter (sans) + Fraunces (serif) via `next/font/google`
- **Hosting target:** Vercel (free tier)

### Three launch blockers (operational, not code)

1. **Capture screenshots.** Docs reference `docs/screenshots/marketing/*.png`, `docs/screenshots/editor/*.png`, `docs/screenshots/tech-volunteer/*.png`, and `docs/case-studies/screenshots/mvc/*.png` — all listed in [`docs/SCREENSHOTS_NEEDED.md`](docs/SCREENSHOTS_NEEDED.md). On launch day these render as broken images. **Highest-priority blocker.**
2. **Toggle "Template repository"** in GitHub repo Settings → General. Until that's on, the green "Use this template" button (which every doc tells adopters to click) doesn't appear.
3. **Tag `v0.1.0`** and create the GitHub Release so the `CHANGELOG.md` link `releases/tag/v0.1.0` resolves.

Also pending: **GitHub topics** — `church`, `nonprofit`, `website-template`, `nextjs`, `decap-cms`, `open-source`, `small-church`, `church-website`. Add via repo Settings → General → Topics.

---

## The two foundational mental models

If you only remember two things from this file:

### 1. Template vs. Instance

This codebase plays two roles:

- **The template repo** (this one, `kbennett2000/church-site-template`) is the canonical starter. It receives PRs, ships releases, and has generic placeholder content.
- **Church instances** are independent repos created by adopters clicking GitHub's **"Use this template"** button. They are *not* GitHub forks — there's no Git relationship between them and the template.

This is intentional ([ADR-009](docs/for-developers/decision-log.md#adr-009-github-template-not-fork-for-church-adoption)). Consequences:
- Template improvements don't auto-flow downstream. Adopters cherry-pick if they want updates (documented in `docs/for-developers/contributing.md`).
- Code reviewers should ask: *"Would this make sense for any small church, or is it specific to one church?"* If specific, it doesn't belong in the template — it belongs in a church-instance fork.

### 2. The placeholder church

The template ships with seed data for a fictional church:

- **Name:** Grace Community Church (short: `GCC`)
- **Phone:** `(555) 123-4567` (deliberately the universal placeholder area code)
- **Email:** `hello@example.church`
- **Address:** `123 Main Street, Your Town, ST 12345`
- **Service:** Sundays at 10:00 AM
- **Tagline:** "A welcoming church in [Your Town]"

Every content file uses some form of `[Replace with your...]` marker so adopters know what to swap. [`SEED_DATA.md`](SEED_DATA.md) is the full checklist.

When you see "Grace Community Church" in code, it's the seed data — never edit it to match a different church *in the template*. (Examples in `/examples/` use different churches — Prairie Community for rural, Oakbridge Community for suburban.)

---

## The case-study church (intentional, not seed data)

**Majestic View Church (MVC)** in Kiowa, Colorado — the real prototype congregation. Live site at `mvckiowa.com`. The full case study is at [`docs/case-studies/majestic-view-church.md`](docs/case-studies/majestic-view-church.md).

**Where MVC may legitimately appear:**
- The case study itself
- README's Credits and Live Examples sections
- `CHANGELOG.md` mentioning the inaugural case study
- `docs/marketing/one-pager.md` and `docs/README.md` linking to the case study
- `docs/for-developers/contributing.md` brief "see case study" mention

**Where MVC must never appear:**
- Any seed data (`/content/*`)
- Any component code (`/app/`, `/components/`, `/lib/`)
- Any other doc

There's a final grep sweep documented in [`docs/PRE_LAUNCH_REVIEW.md`](docs/PRE_LAUNCH_REVIEW.md). The current state is clean.

---

## Where everything lives

```
/                              repo root
├── README.md                   public entry — three-path structure + Use This Template callout
├── CHANGELOG.md                Keep a Changelog format, v0.1.0 entry
├── FAQ.md                      adopting-church FAQ, two-section (before/after adoption)
├── GLOSSARY.md                 plain-English terms
├── SEED_DATA.md                checklist of every placeholder
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE                     MIT
├── CLAUDE.md                   ← this file
├── package.json                postinstall → scripts/welcome.js
├── tailwind.config.ts          theme tokens + Fraunces axes
├── next.config.mjs             rewrites for /admin/, image remotes
├── tsconfig.json               strict TS
│
├── .github/
│   ├── TEMPLATE_GUIDE.md       GitHub surfaces this after "Use this template"
│   ├── FUNDING.yml             all platforms commented out (instructional)
│   └── ISSUE_TEMPLATE/
│       ├── adopting-help.md    for stuck adopting churches
│       ├── template-improvement.md
│       ├── template-bug.md     with "is this a template or instance bug?" diagnostic
│       ├── docs-feedback.md
│       └── config.yml          surfaces docs/FAQ/case-studies above the chooser
│
├── app/                        Next.js App Router routes (all static)
│   ├── layout.tsx              fonts, metadata
│   ├── page.tsx                homepage composition
│   ├── globals.css             CSS variables for the theme (HSL triplets)
│   ├── about|beliefs|calendar|connect|give|ministries|visit|watch/
│
├── components/
│   ├── site-header.tsx         dynamic-text or image-logo, hidden md:inline name
│   ├── site-footer.tsx         same fallback pattern, min-w-0 for long names
│   ├── mobile-nav.tsx
│   ├── sections/               homepage sections (hero, this-week, latest-sermon, etc.)
│   └── ui/                     button/card/input primitives
│
├── lib/                        types + helpers (NOT data)
│   ├── church-info.ts          loads content/site.json + derives mapsUrl/phoneHref/etc.
│   ├── calendar-data.ts        types + month-expansion math
│   ├── sermons.ts / staff.ts / elders.ts / ministries.ts / beliefs.ts / events.ts /
│       announcements.ts        TYPES ONLY — data lives in /content/
│   ├── groups.ts               STILL has inline data (TODO: migrate to /content/)
│   ├── prayer-wall.ts          STILL has inline data (TODO: migrate)
│   ├── serve-roles.ts          STILL has inline data (TODO: migrate)
│   └── utils.ts                cn() helper
│
├── content/                    EDITORIAL DATA — Decap CMS edits this folder
│   ├── site.json               church identity + cross-cutting copy
│   ├── site.ts                 loader + field-by-field comment reference
│   ├── beliefs.json            doctrinal statements + _note flag for adopters
│   ├── events.json             recurring events
│   ├── story.md                about-page prose
│   ├── ministries/             .md per ministry (kids/youth/young-adults/women/men/recovery/missions)
│   ├── ministries.ts           loader + SLUG_ORDER array (controls display order)
│   ├── staff/                  .md per staff member
│   ├── elders/                 .md per elder
│   ├── sermons/                .md per sermon (date-prefixed filenames)
│   └── announcements/          .md per announcement
│
├── public/
│   ├── admin/                  Decap CMS app
│   │   ├── config.yml          collections schema — KEEP `repo: your-org/your-repo` as placeholder
│   │   └── index.html
│   └── images/
│       ├── placeholders/       SVG placeholders (gradients + initials avatars)
│       │   └── staff/          AM/JR/PT/SC initials avatars
│       └── uploads/            CMS upload destination (gitkeep'd)
│
├── examples/                   alternate /content/ configs (data only, no loaders)
│   ├── README.md               how to use (browse vs. swap-in)
│   ├── small-rural-church/     Prairie Community Church — 4 ministries, simple
│   └── suburban-family-church/ Oakbridge Community Church — 7 ministries, programmed
│
├── docs/
│   ├── README.md               doc map (4 tracks: editors, tech-vol, devs, case studies)
│   ├── PRE_LAUNCH_REVIEW.md    persona review + appendices for v0.1.0 launch copy
│   ├── SCREENSHOTS_NEEDED.md   capture checklist
│   ├── USABILITY_REVIEW.md     internal persona-driven readthrough audit
│   ├── USABILITY_REVIEW_RAW.md raw findings
│   ├── design.md               palette/type/density rationale
│   │
│   ├── for-editors/            01–09 numbered guides + troubleshooting + glossary
│   ├── for-tech-volunteers/    01 overview → 10 customize-deeper, all sequential
│   ├── for-developers/         architecture / content-model / decision-log / contributing / etc.
│   ├── case-studies/
│   │   ├── README.md           submission instructions
│   │   ├── majestic-view-church.md   inaugural case study (screenshots + quote pending)
│   │   ├── _TEMPLATE.md        copy-paste for new case study submissions
│   │   └── screenshots/        per-church subdirs
│   ├── marketing/
│   │   ├── one-pager.md        PDF-ready board pitch
│   │   ├── elevator-pitch.md   8 pitch variants
│   │   └── feature-comparison.md   vs. Wix/Squarespace/WordPress/DIY
│   └── video-scripts/          screencast scripts paired with editor + tech-vol guides
│
└── scripts/                    Node CLI scripts
    ├── setup.js                npm run setup — interactive setup wizard
    ├── dev.js                  npm run start — wrapper around `next dev`
    ├── deploy-setup.js         npm run deploy — Vercel walkthrough
    ├── doctor.js               npm run doctor — 11 health checks
    └── welcome.js              post-install banner (run once via marker file)
```

---

## Conventions and gotchas

### The CMS-config placeholder

`public/admin/config.yml` has `repo: your-org/your-repo` as an intentional placeholder. **Do not "fix" it** to point at `kbennett2000/church-site-template` — adopters need to recognize it as the value they replace. `scripts/doctor.js` checks for this exact placeholder string and warns adopters about it.

There was a bulk-replace gotcha during the cleanup: replacing `your-org/your-repo` repo-wide overcorrected this placeholder. It's now reverted.

### The logo SVG

`public/images/placeholders/logo.svg` is icon-only (a generic church-cross mark). **Don't bake church-name text into it** — there was a real bug where a previous version had `<text>Grace Community</text>` baked in and got truncated by the SVG viewBox. The dynamic header/footer renders the name from `content/site.json`. If you ever regenerate the logo placeholder, keep it text-free.

### Header/footer name rendering — template constraint

In `components/site-header.tsx` and `components/site-footer.tsx` there's a comment block flagging the constraint: **the church name must remain a plain text node with no truncation, ellipsis, or fixed width.** Adopting churches have names ranging from "Hope Church" (11 chars) to "First United Methodist Church of Springfield" (44 chars). The current solution uses `min-w-0` + `shrink-0` to let the name wrap when space is tight rather than truncate.

### Welcome script idempotency

`scripts/welcome.js` runs on `npm install` via `postinstall`. It writes a marker file `.template-welcomed` (gitignored) so subsequent installs are silent. The script detects CI and non-TTY environments and degrades gracefully. To re-run manually: `npm run welcome` (uses `--force` flag).

### Ministry slug ordering

`content/ministries.ts` has a `SLUG_ORDER` array that controls homepage and nav order. The nav itself is in `lib/church-info.ts`. **Both must be kept in sync** when adding or removing a ministry — there's a walkthrough in `docs/for-tech-volunteers/10-customize-deeper.md`.

The default ministry slug for recovery is `"recovery"` (not `"overcomers"`). An older version of the prototype used `"overcomers"` but the template renames to `"recovery"` for broader applicability.

### `/lib/` still has inline data

Three `/lib/` files have static placeholder data that should ideally live in `/content/`:
- `lib/groups.ts` — used by `/connect/groups`
- `lib/prayer-wall.ts` — used by `/connect/prayer`
- `lib/serve-roles.ts` — used by `/connect/serve`

This is a known gap, documented in CHANGELOG.md "Known limitations" and in the developer architecture doc. Migrating these to CMS-managed `/content/` collections is on the v0.2 roadmap.

### Forms are UI-only

The visit-form, prayer-form, newsletter, and contact form are UI scaffolding. They log to the browser console; they do not send email. Wiring to Resend/Formspree/Mailchimp is the adopter's developer work.

### TypeScript strict mode

`tsconfig.json` has `"strict": true`. No `any` without a comment explaining why. Code reviewer enforces.

### Three-track docs convention (Diátaxis)

Every doc has a `type:` frontmatter field — one of `tutorial`, `how-to`, `reference`, `explanation`, or (new) `case-study`. Follow the existing pattern when adding new docs.

---

## Conversation history (what was built, in order)

The template was built across 7 distinct prompts over a couple of days. Each prompt's scope is captured here so future-Claude can locate context.

### Prompt 1 — Initial template copy + de-MVC

Copied source from a prototype repo (`../mvc-prototype/` — actually `../mvc-revamp/`) into the empty `church-site-template` repo. Replaced all church-specific data with generic Grace Community Church seed data:
- 3 staff (Alex Morgan, Jamie Rivera, Pat Taylor)
- 1 elder (Sam Chen)
- 7 ministries
- 8 beliefs with `_note` flagging them as examples
- 5 recurring events
- 6 sermons (Walking in Faith series, generic placeholder)
- 3 announcements
- Generic story.md

Generated 16 SVG placeholders for hero/plan-a-visit/watch/small-groups/logo/7 ministries/4 staff avatars. Wrote `SEED_DATA.md` checklist. Updated `package.json` for the template audience.

### Prompt 2 — Header/footer truncation bug

User reported "Grace Community Church" was rendering as "Grace Communi" in both header and footer. Root cause: the logo.svg I'd generated had hardcoded `<text>Grace Community</text>` baked in, overflowing its viewBox. Fixed by:
- Stripping all text from logo.svg (icon-only now)
- Setting `church.logo: ""` in site.json so the dynamic-text branch renders
- Rewriting header text rendering with `min-w-0` + `shrink-0` for graceful wrapping at all name lengths
- Adding prominent template-constraint comments in both site-header.tsx and site-footer.tsx
- Manually tested layout math for "First United Methodist Church of Springfield" (44 chars) at 375/768/1024/1280px breakpoints

### Prompt 3 — Decap CMS login error

User got "not a user of that repo" when trying to log in to `/admin/`. Diagnosed: they were running locally but hadn't started the Decap local proxy (`npm run cms`). Without the proxy, Decap falls through to GitHub OAuth which hits the placeholder `your-org/your-repo` in config.yml. Fix: run `npm run cms` in a second terminal.

Documented the local vs. production CMS auth distinction.

### Prompt 4 — Documentation update for template audience

Rewrote `/README.md` and `/FAQ.md` for the template audience (not the prototype audience). Reframed `01-overview.md`, retitled `03-fork-and-clone.md` → `03-use-this-template.md`, created `04a-customize-with-setup-script.md`. Updated branding guide with logo/avatar/photo replacement sections.

Added "Template vs. Instance" section to architecture.md, added ADR-009 to decision-log.md, added "Keeping a church instance in sync" to contributing.md.

Created `/docs/case-studies/` with MVC case study + submission template + folder README.

### Prompt 5 — Polish pass (final-mile)

Added:
- `.github/TEMPLATE_GUIDE.md` — GitHub surfaces this post-"Use this template"
- `CHANGELOG.md` — Keep a Changelog format, v0.1.0 entry
- `scripts/welcome.js` + postinstall wiring + `.template-welcomed` marker
- `/examples/small-rural-church/` (Prairie Community) and `/examples/suburban-family-church/` (Oakbridge Community)
- `docs/for-tech-volunteers/10-customize-deeper.md`
- `.github/FUNDING.yml` (commented out)
- 3 issue templates + config.yml
- `docs/marketing/` (one-pager, elevator-pitch, feature-comparison)

### Prompt 6 — Doc update redo

(Some overlap with prompt 4 — user wanted to refine the template-audience framing further.)

### Prompt 7 — Ruthless final review

Pre-launch review pass:
- Deleted prototype-era docs (IMAGES_TO_REPLACE, CONTENT_AUDIT, REFACTOR_FOR_TEMPLATE, CMS_GUIDE)
- Rewrote design.md to remove MVC framing
- De-MVC'd remaining doc examples (content-model.md, 04-first-time-setup.md, 06-deploy-to-vercel.md)
- Bulk-replaced `your-org/your-repo` feedback URLs across 32 files; reverted CMS-config placeholder
- Fixed broken links to deleted docs
- Verified all non-screenshot internal links resolve (wrote a Node script that walks all .md files)
- Verified production image refs all resolve (the only "missing" refs are pedagogical examples in doc code blocks)
- `npm run doctor` → all checks pass except intentional placeholder warning
- `npm run build` → 28 static pages, TypeScript clean, no warnings
- Persona role-play (pastor / tech-vol / developer) written to `docs/PRE_LAUNCH_REVIEW.md` with launch-copy appendices

---

## Working with the user (Kris Bennett)

Things I've learned about how they work, beyond what's in the auto-memory:

- **They give detailed, multi-step prompts** with numbered substeps. They expect each step to land.
- **They want clarifying questions before destructive or assumption-heavy work** (e.g. when there was no `mvc-prototype` folder, I asked rather than guessed). They appreciate this — they explicitly answered the AskUserQuestion options and proceeded.
- **They flag scope drift gracefully** — if I do more than asked, they note it but don't push back unless it's wrong.
- **"Be ruthless" means be thorough**, not aggressive. They want comprehensive cleanup, not minimum-viable cleanup.
- **They like end-of-turn summaries** with explicit lists of what changed, what was deferred, and what blockers remain.
- **They prefer fewer files with more depth** to many shallow files. The marketing docs are tight; the case study is detailed; the one-pager is one screen.
- **They want honest framing**, including in marketing copy ("Honest about the floor:" sections). Don't oversell.
- **They want todo lists for big work** but skip them for trivial work. Multi-step prompts get todo lists.
- **Their working machine is Windows** (PowerShell + Git Bash both available). Cross-platform scripts should detect and degrade.
- **They use Claude Code** with the auto-memory system at `c:\Users\KB\.claude\projects\...` — relevant for understanding *why* `CLAUDE.md` works as auto-loaded context.

### User-specific decisions they've made

- **GitHub username:** `kbennett2000`. Template repo URL: `github.com/kbennett2000/church-site-template`.
- **Template-not-fork:** They picked "Generate SVG placeholders" over "Download from Unsplash" when offered. They picked "Use kbennett2000/church-site-template" for `repository.url` when offered.
- **They explicitly chose `recovery` over `overcomers` as the 7th ministry slug.**

---

## How to verify the project still works

After any non-trivial edit:

```bash
npm run doctor    # 11 health checks; 1 expected "fail" on CMS placeholder
npm run build     # full TS + Next build; should be clean
```

If editing components or content:

```bash
npm run start     # http://localhost:3000
npm run cms       # in a 2nd terminal, enables /admin/ locally without GitHub
```

The build output should show:
- 28 static pages generated
- TypeScript clean
- 7 ministry pages prerendered: kids, youth, young-adults, women, men, recovery, missions
- 6 sermon pages prerendered: walking-in-faith-part-{1..6}

---

## Open work, prioritized

### Pre-launch (operational, blocks v0.1.0 release)

1. **Capture screenshots** per [`docs/SCREENSHOTS_NEEDED.md`](docs/SCREENSHOTS_NEEDED.md). At minimum the 4 marketing screenshots (homepage desktop/mobile, CMS dashboard, calendar).
2. **Toggle "Template repository"** in GitHub repo Settings.
3. **Tag `v0.1.0`** and create the GitHub Release using the [draft body in PRE_LAUNCH_REVIEW.md Appendix B](docs/PRE_LAUNCH_REVIEW.md#appendix-b--draft-v010-release-announcement).
4. **Set the repo description** using the [draft in PRE_LAUNCH_REVIEW.md Appendix A](docs/PRE_LAUNCH_REVIEW.md#appendix-a--draft-repo-description).
5. **Add topics** to the repo (list above).
6. **Optionally:** capture the inaugural case-study screenshots (MVC old/new homepage, mobile, calendar, CMS) once permission is confirmed.
7. **Optionally:** collect a staff quote from MVC for the case study (currently a `<!-- TODO -->` block).

### Soft v0.2 wishlist (post-launch)

- **Migrate `/lib/groups.ts`, `/lib/prayer-wall.ts`, `/lib/serve-roles.ts`** to `/content/` collections with Decap CMS schemas.
- **Add a test suite.** Vitest for units + Playwright for one or two end-to-end smoke tests. Honest gap acknowledged in CHANGELOG.md and contributing.md.
- **Add GitHub Actions CI** running `npm run build` + `tsc --noEmit` on every PR.
- **Open 3–5 "good first issue" tickets** so contributors have a clear entry point.
- **Wire one real form** end-to-end (e.g. plan-a-visit → Resend). Document the pattern in a developer guide.
- **Migrate the about-page prose** to read from `content/story.md` (currently hardcoded JSX with story.md as a parallel canonical source).
- **Capture the remaining editor + tech-volunteer screenshots** for the docs.
- **Add a Decap OAuth proxy** auto-setup, perhaps via a Vercel-deployable companion repo.

### Backlog (no rush)

- **Sermons embedding** — currently expects YouTube IDs; consider supporting Vimeo, Sermon Cloud, and direct MP4.
- **i18n.** Mentioned as welcomed in contributing.md but no scaffolding yet.
- **Dark mode toggle.** Common request from churches with younger demographics.
- **Member directory** — explicit non-feature today, but adopters will ask.

---

## When you resume work

1. **Read this file first** (you're doing that).
2. **Run `npm install`** if `node_modules/` isn't there. The welcome script may fire — that's normal on a fresh clone.
3. **Run `npm run doctor`** to confirm baseline health.
4. **Run `npm run build`** to confirm the project still compiles.
5. **Ask the user what they want to work on.** Don't assume the next task from the "Open work" list above — they may have a new priority.

### Files to read if you're going deep

- [`docs/for-developers/architecture.md`](docs/for-developers/architecture.md) — Template vs. Instance + stack rationale
- [`docs/for-developers/decision-log.md`](docs/for-developers/decision-log.md) — 9 ADRs, ADR-009 is the foundational one
- [`docs/for-developers/contributing.md`](docs/for-developers/contributing.md) — including the "syncing template updates into a church instance" section
- [`SEED_DATA.md`](SEED_DATA.md) — every placeholder and what to replace
- [`docs/PRE_LAUNCH_REVIEW.md`](docs/PRE_LAUNCH_REVIEW.md) — persona findings + launch-copy drafts
- [`CHANGELOG.md`](CHANGELOG.md) — feature inventory + known limitations
- [`README.md`](README.md) — the public face of the template

### Pitfalls to avoid

- **Don't replace `your-org/your-repo` in `public/admin/config.yml`** — it's an intentional placeholder.
- **Don't add real photos of real people** unless you have written consent. The template uses initials avatars and SVG gradients for a reason.
- **Don't add features that wouldn't make sense for any small church** — those belong in a church instance, not the template.
- **Don't bake church-specific text into images** (the logo SVG bug).
- **Don't tighten the vertical rhythm** to fit more on screen — empty space is part of the brand (per [`docs/design.md`](docs/design.md)).
- **Don't introduce vendor lock-in** as a requirement — paid integrations are fine as optional, not as a baseline.
- **Don't disable the editorial workflow** in Decap — the PR-based review step is a deliberate safety net for non-technical editors.
- **Don't add tests in a haphazard pass** — the test framework should be picked deliberately and added with a complete first wave (not one Vitest spec). Discuss before adding.

---

## Quick reference — common commands

```bash
# Day-to-day
npm run start       # next dev server on :3000
npm run cms         # decap-server proxy on :8081 (run in 2nd terminal for /admin/)
npm run build       # production build
npm run doctor      # 11 health checks

# First-time / re-configuration
npm run setup       # interactive wizard (church name, address, palette)
npm run welcome     # re-run the post-install banner (uses --force)
npm run deploy      # interactive Vercel walkthrough

# Type-check without building
npx tsc --noEmit

# Find every placeholder marker for adopters
grep -rn "\[Replace" .
grep -rn "\[Customize" .
grep -rn "TODO" --include="*.md" .

# Verify no MVC contamination (should match only legitimate case-study/credits files)
grep -rE "Majestic|\bMVC\b|mvckiowa|Kiowa|Comanche|303-491" \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git
```

---

## The "why this template exists" north star

Small churches often can't afford a professional website and can't maintain a custom build long-term. They end up either with no website or a fragile DIY one that no one knows how to update once the volunteer who built it moves on. **This template closes that gap.**

Every design decision should pass this test: *Does this make it easier for a 65-year-old church secretary to update the site, or a 30-something tech volunteer to deploy it, or a developer to step in for 30 minutes a year?* If yes, ship it. If no, reconsider.

That's the brief.
