---
title: Adoption Audit
date: 2026-05-15
type: reference
---

# Adoption Audit — 2026-05-15

This is a usability audit, not a technical one. The question it answers: **can someone with limited technical skill successfully adopt this template, operate it, and hand it off to a successor?**

(For the docs-vs-code drift audit, see [AUDIT.md](AUDIT.md).)

**Method.** Read every relevant doc through the eyes of four personas — the Pastor, the Tech Volunteer, the Editor, the Successor — and report what each would experience. Each persona was reviewed independently; this document aggregates the findings.

**TL;DR.** The docs are well-written, warm, and structurally sound — the three-track (editor / tech-vol / developer) split works. The four serious gaps are:

1. **TinaCloud setup is undocumented end-to-end.** Tech volunteers are sent to a deploy doc that doesn't mention it, then a "grant editor access" doc that assumes it exists. This is the single biggest quit point.
2. **Operational runbooks don't exist.** Setup docs assume you're building fresh; there's no "the site is down" or "devotional emails stopped" runbook for a real outage.
3. **The successor case isn't addressed.** No service inventory, no credentials-handoff template, no "what if the prior builder's account needs to transfer." A new tech volunteer 2 years from now would be flying blind on the bigger decisions.
4. **The 30-minute claim isn't honest.** A real tech volunteer on a Saturday morning takes 60–125 minutes, depending on TinaCloud confusion and DNS propagation.

The editor experience is the strongest piece. The pastor experience is solid, gated mainly on the case-study placeholder. The successor experience is the weakest.

---

## Persona findings

### 1. The Pastor (30-minute decision)

**Verdict: Pursues. Schedules a meeting with the tech volunteer.**

What lands well:
- **Cost transparency** is unusual in this space. "$12/year total" appears unambiguously in the FAQ. The lifetime-cost comparison in [feature-comparison.md](docs/marketing/feature-comparison.md) ($1,500 of Squarespace vs. $60) is concrete and persuasive.
- **The off-ramp question is answered directly.** FAQ tells them they can point DNS back at the old host and run both sites in parallel during transition. No lock-in is real, not aspirational.
- **The "what if I don't have a tech person?" answer is good.** "The college kid who built a Discord server. The board member who builds spreadsheets. The retired engineer in the back pew." That's how pastors actually think about volunteers.
- **The design philosophy lands** — "reverent, warm, and readable" beats abstract designer-speak.

What confuses or stops them:
- **The MVC case study is a stub.** A pastor wants to see a peer who's already on the other side and happy. The placeholder explicitly says "full case study coming after launch" — they're reading pre-launch material. This is the single biggest "bookmark and forget" risk.
- **No denominational diversity.** The default seed content reads evangelical; a mainline Methodist or Catholic pastor wonders if it fits. The FAQ claims "generic enough to fit most traditions" but doesn't demonstrate it.
- **No support response-time signal.** "Help comes from docs and the community" is honest, but a pastor making a 5-year commitment wants to see active issues being resolved.
- **No WordPress migration roadmap.** Many churches are coming *from* WordPress. There's no doc saying "here's how to bring your existing sermons across."

### 2. The Tech Volunteer (the gating function)

**Verdict: Succeeds, but with friction. ~60–125 minutes instead of the promised 30.**

What works:
- [01-overview.md](docs/for-tech-volunteers/01-overview.md) — clear path, honest per-step time breakdown, "why each step exists" copy.
- [03-use-this-template.md](docs/for-tech-volunteers/03-use-this-template.md) — screenshot-heavy, the Codespaces path is sold well.
- [06-deploy-to-vercel.md](docs/for-tech-volunteers/06-deploy-to-vercel.md) Path A (the automated `npm run deploy` script).
- [07-connect-domain.md](docs/for-tech-volunteers/07-connect-domain.md) — methodical, with a glossary for DNS terms.

Where they get stuck:
- **TinaCloud is the #1 quit point.** [08-grant-editor-access.md](docs/for-tech-volunteers/08-grant-editor-access.md) references a TinaCloud project as "done during deploy setup," but [06-deploy-to-vercel.md](docs/for-tech-volunteers/06-deploy-to-vercel.md) never mentions TinaCloud. The env vars `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` appear in instructions with no source documented. A volunteer gets "You are not authorized" at `/admin/`, can't find where the credentials come from, and gives up.
- **Codespaces URL/port-forwarding** in [04-first-time-setup.md](docs/for-tech-volunteers/04-first-time-setup.md). The doc says "the URL is different" without a screenshot of the Ports tab. Volunteers try `localhost:3000`, get a connection refused error, conclude the setup is broken.
- **Google Cloud OAuth setup** in [admin-access-google-oauth.md](docs/for-tech-volunteers/admin-access-google-oauth.md). No screenshots of the console; OAuth consent screen / scopes / test users are decisions with no guidance.
- **Time estimate mismatch.** "30 minutes" doesn't include Node.js install (10–15 min) or DNS propagation (5–60 min). Math is wrong, trust takes a hit.

Specific friction phrases that came up:
- "Slightly slower than running locally" (Codespaces con) — slower at what? Vague.
- "30 seconds" to remove a background in Photopea — actually 5–10 minutes the first time.
- "Code editing starts here. Everything below this point involves opening real code files" — patronizing tone in a doc that's supposed to lower the barrier.
- "Sandstone & Sage" — color palette names without visual swatches don't help.
- [09-maintenance.md](docs/for-tech-volunteers/09-maintenance.md) tells the tech vol to **revoke editor access in GitHub**, but editor access is actually managed in TinaCloud. **This is a documented security hole** — removing a GitHub collaborator does not revoke their CMS access.

Top 3 quit points (in order):
1. TinaCloud env vars sourced from nowhere → "I'm stuck and I don't know what's missing."
2. Codespaces URL confusion → "Setup didn't work — page won't load."
3. OAuth console complexity → "I'll ask a developer to do this part."

### 3. The Editor (weekly use for 5 years)

**Verdict: Can do ~60–70% of routine tasks unaided. The other 30–40% will trigger a "can you help me" call.**

What works:
- [01-getting-started.md](docs/for-editors/01-getting-started.md) — warm tone, realistic expectations, good login walkthrough.
- [05-update-service-times.md](docs/for-editors/05-update-service-times.md) — clearest doc in the set. Mental model matches WordPress.
- [09-add-an-announcement.md](docs/for-editors/09-add-an-announcement.md), [07-upload-photos.md](docs/for-editors/07-upload-photos.md), [08-publishing-changes.md](docs/for-editors/08-publishing-changes.md) — all pass.
- [troubleshooting.md](docs/for-editors/troubleshooting.md) — symptoms-first organization is right.

Where they fail outright:
1. **Day-of-week numbering in [06-add-an-event.md](docs/for-editors/06-add-an-event.md).** Sunday=0, Wednesday=3 — the doc literally admits "the numbering starts at zero — that's a computer thing." A non-technical editor will type the wrong number, see the event on the wrong day, and call for help.
2. **Reading plans in [managing-reading-plans.md](docs/for-editors/managing-reading-plans.md).** The doc requires understanding markdown, YAML, frontmatter, slugs, Bible API keys, cron jobs, and prayer frameworks (SOAP, Lectio Divina). Halfway through it asks the editor to "ask your tech volunteer to convert the CSV to YAML frontmatter" — admitting the task is too hard for them.
3. **Display Order Option B in [04-add-a-staff-member.md](docs/for-editors/04-add-a-staff-member.md).** The "renumber the people below them" option is a foot-gun. A non-technical editor will accidentally duplicate numbers while renumbering. Option A (use 2.5) is fine and the doc should stop there.

Jargon flagged that doesn't appear in [glossary.md](docs/for-editors/glossary.md):
- **Vercel** (used in docs 3, 8 — not in glossary)
- **Slug** (used in doc 13 — not in glossary)
- **Double opt-in** (used in doc 10 — not in glossary)
- **RSVP** (used in doc 6 — not in glossary)
- **Environment variable** (used in doc 12 — not in glossary)
- **Cron** (used in docs 13, 14 — not in glossary)
- **YAML, frontmatter, Feature Flags** (used in doc 13 — not in glossary)
- **Commit** (in glossary, but encountered 4 times before reaching the glossary)

WordPress-comparison verdict: **wins on Update Service Times** (parity); **loses on Add a Recurring Event** (5 extra clicks + 0-indexed days); **loses on Reading Plans** (no WordPress equivalent, and the docs don't make it accessible).

### 4. The Successor (cold inheritance 2 years from now)

**Verdict: Survives but is nervous. Day-one survival rate ~6/10 on operational scenarios.**

Scenarios that work:
- Pastor wants to add his wife as a new admin → done in 5 minutes. [admin-access-google-oauth.md](docs/for-tech-volunteers/admin-access-google-oauth.md) day-to-day section is solid.
- Security patch needs to ship → [09-maintenance.md](docs/for-tech-volunteers/09-maintenance.md) walks through `npm outdated` flow.
- Updating template improvements → [contributing.md](docs/for-developers/contributing.md) "syncing template updates" section is good.
- "What env vars are required?" → [environment-variables.md](docs/for-tech-volunteers/environment-variables.md) is fine.

Scenarios that leave them flailing:
- **The site is down.** No "start here" runbook. They'd panic, dig through Vercel logs, hope.
- **Devotional emails stopped sending.** [setup-devotional-emails.md](docs/for-tech-volunteers/setup-devotional-emails.md) is a setup guide, not operations. They'd eventually find the cron job logs in Vercel.
- **Previous builder's TinaCloud account needs to transfer.** Not addressed at all.
- **Vercel free tier limit got hit.** Mentioned in FAQ; no follow-through on what to do.
- **A leaked secret needs rotation.** No runbook. They'd improvise.

What's missing for them:
- **A service inventory.** Which GitHub org? Which Vercel project? Which TinaCloud org? Which Resend account? Which Neon project? Which domain registrar? They'd have to log in to each service and reconstruct ownership from scratch.
- **The "why?" trail.** [decision-log.md](docs/for-developers/decision-log.md) is *excellent*, but it's buried in the developer section. A successor wouldn't think to read it. Without it, every config choice looks arbitrary and they'd second-guess.
- **A health-check for production.** `npm run doctor` is local. There's no equivalent to verify the live site is healthy without poking at it.
- **One central "gotchas" doc.** Stale JWT, Resend sandbox limits, tag-merge on re-subscription, verification token expiry — all real, all scattered, all the kind of thing only the original builder would know.

**[CLAUDE.md](CLAUDE.md) is the closest thing to a handoff doc** but is written *for AI context*, not for a human inheritor — it reads as "what was built in what order" rather than "what you need to know to keep this running."

---

## Aggregate findings

### A. Critical adoption gaps (blocking adoption)

| # | Audience | File path | What needs to be in it | Effort |
|---|---|---|---|---|
| A1 | Tech vol | `docs/for-tech-volunteers/setup-tinacloud.md` (new) | End-to-end TinaCloud setup: create org, connect GitHub repo, locate `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`, paste into Vercel, verify `/admin/` login. **The single biggest gap.** | Large |
| A2 | Pastor | `docs/case-studies/majestic-view-church.md` (expand) + at least one more denomination (Methodist or Catholic) | Real case studies with screenshots, pastor quotes, before/after, real adoption timelines. Stub is current state. | Large (per case study) |
| A3 | Tech vol | `docs/for-tech-volunteers/04-first-time-setup.md` Codespaces note | Full subsection with screenshot of Codespaces Ports tab + globe icon + the forwarded URL. Currently a one-line warning. | Small |
| A4 | Tech vol | `docs/for-tech-volunteers/admin-access-google-oauth.md` | Screenshots for every Google Cloud Console screen + decision guidance ("External vs. Internal user type" with a recommendation). | Medium |
| A5 | Tech vol | `docs/for-tech-volunteers/01-overview.md` + README | Recalibrate time estimate. "30 minutes" is the *steady-state* claim; first-time-with-Node-install-and-DNS is closer to 90 minutes. Add a "first-time total" estimate. | Small |
| A6 | All | README.md + `docs/README.md` | Add a fourth path: "I'm inheriting a site someone else built." Currently the README has three paths (editor / tech-vol / dev), no path for a successor. | Small |

### B. Critical operating gaps (day-to-day operation)

| # | Audience | File path | What needs to be in it | Effort |
|---|---|---|---|---|
| B1 | Tech vol / successor | `docs/for-tech-volunteers/runbook-site-down.md` (new) | "Site is down — start here." Decision tree: is Vercel green? is the domain resolving? is the latest deploy successful? is TinaCloud accessible? | Medium |
| B2 | Tech vol / successor | `docs/for-tech-volunteers/runbook-emails-stopped.md` (new) | "Devotional or digest emails stopped sending — start here." How to check Vercel cron logs, Resend dashboard, subscriber DB. | Medium |
| B3 | Editor | `docs/for-editors/06-add-an-event.md` | Replace 0–6 numeric Day of Week field with documented dropdown. **This is a UI change, not just a doc fix** — but the doc should reflect whichever wins. | Medium (if UI change) / Small (if doc-only) |
| B4 | Editor | `docs/for-editors/managing-reading-plans.md` | Either simplify the doc to assume zero technical knowledge (drop YAML/frontmatter/cron references), or rescope the feature as "editor + tech volunteer collaboration." | Medium |
| B5 | Tech vol / successor | `docs/for-tech-volunteers/09-maintenance.md` | Add a "verify production is healthy" checklist. Or add a `npm run doctor:prod` command and document it. | Small (checklist) / Medium (script) |
| B6 | Tech vol / successor | `docs/for-tech-volunteers/runbook-rotate-secret.md` (new) | "I leaked a secret — what now?" Steps for each secret (`RESEND_API_KEY`, `ADMIN_PASSWORD`, `NEXTAUTH_SECRET`, `CRON_SECRET`, `TINA_TOKEN`). | Medium |
| B7 | Tech vol | `docs/for-tech-volunteers/email-deliverability.md` | Add Resend sandbox-mode section: `onboarding@resend.dev` can only deliver to the verified account-owner email. Currently tribal knowledge. | Small |
| B8 | Tech vol / successor | `docs/for-tech-volunteers/environment-variables.md` | For each env var, add "if you change it, what breaks?" column. Especially `RESEND_FROM_EMAIL`, `ADMIN_ALLOWLIST`, `NEXTAUTH_URL`. | Medium |
| B9 | Editor | `docs/for-editors/glossary.md` | Add missing entries: Vercel, slug, double opt-in, RSVP, environment variable, cron, YAML, frontmatter, Feature Flags. | Small |
| B10 | Editor | `docs/for-editors/02-add-a-sermon.md` and forward | Define "commit" inline the first time it appears (doc 02), don't wait for the glossary. Pattern: "TinaCMS commits (saves a snapshot of) the change…" | Small |
| B11 | Tech vol | `docs/for-tech-volunteers/09-maintenance.md` | **Fix the documented security hole:** the quarterly "Review editor access" task currently sends the tech vol to GitHub Collaborators. Editor access is managed in TinaCloud. Sending them to GitHub is at best useless, at worst leaves a security hole. | Small |

### C. Succession gaps (handoff to future maintainer)

| # | Audience | File path | What needs to be in it | Effort |
|---|---|---|---|---|
| C1 | Successor | `docs/for-tech-volunteers/successor-runbook.md` (new) | "You are the successor — start here." Service inventory template (which GitHub org? Vercel? TinaCloud? Resend? Neon? domain registrar?), credentials checklist, first-60-minutes orientation. **Single most important missing doc.** | Large |
| C2 | Successor | `docs/for-tech-volunteers/successor-runbook.md` or new | Credentials/accounts succession plan: how to transfer ownership of TinaCloud org, Vercel project, GitHub org, Neon DB, Resend account if the previous builder's accounts need to migrate. | Medium |
| C3 | Successor | `docs/for-tech-volunteers/known-gotchas.md` (new) | Consolidated gotchas page. Stale JWT, Resend sandbox limits, tag-merge on re-subscription, verification token 24h expiry, force=true digest behavior, in-memory rate limiter caveat. Each in a one-paragraph "if you see X, the cause is Y" format. | Medium |
| C4 | Successor | `docs/README.md` + `docs/for-tech-volunteers/01-overview.md` | Cross-link `decision-log.md` from the tech-volunteer track, not just the developer track. A successor reading "Overview" should be one click from "why was this stack chosen." | Small |
| C5 | Successor | `docs/for-developers/decision-log.md` | Add missing rationales: why Neon over Supabase, why Resend over alternatives, why no PR-based editorial workflow. | Small |
| C6 | Successor | `CLAUDE.md` | Add a "If you're a human reading this for the first time" section near the top. CLAUDE.md is currently the best handoff doc but is framed for AI. One paragraph would fix it. | Small |
| C7 | Successor | `docs/for-tech-volunteers/runbook-tinacloud-recovery.md` (new) | "Previous builder's TinaCloud account expired or needs to transfer." How to claim ownership, what to do if you can't reach them, how to migrate to a fresh org without losing content. | Medium |

### D. Polish items (lower the skill floor without blocking)

| # | Audience | File path | What needs to be in it | Effort |
|---|---|---|---|---|
| D1 | Tech vol | `docs/for-tech-volunteers/05-customize-branding.md` | Add visual swatches of the four palettes. "Sandstone & Sage" means nothing without a picture. | Small |
| D2 | Tech vol | `docs/for-tech-volunteers/05-customize-branding.md` | Honest Photopea time estimate (5–10 min first time, not 30 sec). | Small |
| D3 | Pastor / tech vol | New `docs/migration-from-wordpress.md` | Step-by-step migration: exporting sermons, importing into `/content/sermons/`, dealing with embedded images. | Large |
| D4 | Pastor | FAQ + `docs/marketing/feature-comparison.md` | Denomination-specific examples: Methodist version of beliefs page, Catholic mass times template, etc. | Medium |
| D5 | Tech vol | `docs/for-tech-volunteers/02-prerequisites.md` | Codespaces 60-hour free quota warning. Reassurance that casual updates use <5 hrs/month. | Small |
| D6 | Tech vol | `docs/for-tech-volunteers/06-deploy-to-vercel.md` | Inline glossary of `git add` / `git commit` / `git push`. One sentence each. Or extract to a "Git for non-developers" sidebar. | Small |
| D7 | Tech vol | `docs/for-tech-volunteers/06-deploy-to-vercel.md` | Surface the GitHub Personal Access Token flow earlier — currently buried in troubleshooting. Many tech vols hit this on first `git push`. | Small |
| D8 | Tech vol | `docs/for-tech-volunteers/04-first-time-setup.md` | Tell the volunteer that `npm install` takes 1–3 minutes and produces a wall of scrolling output. Currently they may close the terminal thinking it hung. | Small |
| D9 | Tech vol | `docs/for-tech-volunteers/03-use-this-template.md` | Recovery paths if Codespaces creation fails (network glitch, GitHub auth). Currently doc only covers happy path. | Small |
| D10 | Editor | `docs/for-editors/04-add-a-staff-member.md` | Remove Option B (renumber the others). Only document Option A (use 2.5). | Small |
| D11 | Editor | All editor task docs | Add a screenshot of the entry-point button/menu for each task ("Click **Sermons** → **New Sermon**" with a screenshot of the sidebar). | Medium |
| D12 | Tech vol | `docs/for-tech-volunteers/07-connect-domain.md` | Broader registrar guidance — not just GoDaddy/Namecheap/Cloudflare/Google. Pattern: "Look for 'DNS Settings' or 'Advanced DNS,' usually under your domain name." | Small |
| D13 | Tech vol | `docs/for-tech-volunteers/07-connect-domain.md` | Warning that some registrars (cheap GoDaddy tiers) don't let you edit raw DNS records. Choose a registrar that does. | Small |
| D14 | Tech vol | `docs/for-tech-volunteers/setup-devotional-emails.md` | Clarify that Vercel Postgres is powered by Neon (relevant for the point-in-time recovery section). | Small |
| D15 | Editor | `docs/for-editors/06-add-an-event.md` | Move the examples section to the *top*, not the bottom. Editors will pattern-match faster from an example than read all three recurrence patterns abstractly. | Small |

---

## Where video walkthroughs would have outsized impact

In order of impact:

1. **TinaCloud setup end-to-end.** Tech volunteers cannot succeed on this without help today. A 3-minute video showing org creation → repo connection → env-var copy → Vercel paste → `/admin/` login would close the biggest quit point in the funnel.
2. **First deploy to Vercel.** Lots of moving pieces (importing repo, Vercel config, build logs, the celebration screen). A video would show what "normal" looks like and prevent panic when scrolling logs appear.
3. **Google Cloud Console OAuth setup.** This is the most click-heavy external service, with the most decisions per screen. A screen recording with narration would make this feasible for a wider set of volunteers.
4. **"Add a sermon" for editors.** This is the most-repeated editor task. A 90-second video would shortcut the YouTube-ID extraction step and reduce the stuck-call rate significantly.
5. **Codespaces orientation.** What the IDE looks like, where the terminal is, how to find the Ports tab, where files live. Two minutes of "this is what you'll see" would orient a first-time volunteer who's never used a web IDE.

## Where screenshot-rich versions would lower the skill floor more than rewriting

These docs are correct but text-only; screenshots would help more than another rewrite:

1. **[admin-access-google-oauth.md](docs/for-tech-volunteers/admin-access-google-oauth.md)** — every Google Cloud Console screen.
2. **[04-first-time-setup.md](docs/for-tech-volunteers/04-first-time-setup.md)** Codespaces note — Ports tab + forwarded URL.
3. **[06-deploy-to-vercel.md](docs/for-tech-volunteers/06-deploy-to-vercel.md)** — what Vercel build logs look like during a normal build, and what a typical *failed* build looks like.
4. **[07-connect-domain.md](docs/for-tech-volunteers/07-connect-domain.md)** — Vercel's DNS-instruction screen with the exact records callout.
5. **All editor task docs** — entry-point sidebar screenshots ("Click **Sermons** in the sidebar"). Currently the docs describe a destination without showing the door.
6. **Error states across editor troubleshooting** — what does "Not authorized" look like? What does a "conflict" save error look like? An editor recognizing the symptom from a screenshot beats reading a description.
7. **[05-customize-branding.md](docs/for-tech-volunteers/05-customize-branding.md)** — color palettes applied to the homepage. "Sandstone & Sage" should be a thumbnail you can click.

## Docs that are too technical for their stated audience

Three editor-track docs currently require knowledge their audience doesn't have:

1. **[managing-reading-plans.md](docs/for-editors/managing-reading-plans.md)** uses markdown, YAML, frontmatter, slugs, Bible API keys, cron concepts, and prayer-framework knowledge (SOAP, Lectio Divina). Halfway through it tells the editor to "ask your tech volunteer to convert the CSV to YAML frontmatter." If the doc admits an editor can't finish it, the doc is mis-targeted. Either rescope as collaboration or simplify the underlying UX.
2. **[06-add-an-event.md](docs/for-editors/06-add-an-event.md)** uses 0-indexed days of the week. The doc literally admits "that's a computer thing." Editors shouldn't be exposed to computer conventions.
3. **[managing-admin-access.md](docs/for-editors/managing-admin-access.md)** "What if I lock myself out?" section walks the editor through editing Vercel environment variables. That's a tech-volunteer task. The doc should say "ask your tech volunteer to run this rescue" rather than "here's how to do it yourself."

One tech-vol-track doc that's too technical even for its audience:

4. **[setup-devotional-emails.md](docs/for-tech-volunteers/setup-devotional-emails.md)** treats `npm run db:setup` / `db:generate` / `db:migrate` / `db:push` as black-box commands. A tech volunteer doesn't need a database-internals tutorial, but they do need one paragraph explaining: "These commands manage a Postgres database. `setup` initialises, `generate` writes a schema change file, `migrate` applies it safely. **Never run `push` against production** — it can drop tables." Currently it only says the last bit, which scares without teaching.

---

## Honest assessment

**How close is this template to its "anybody can adopt it" promise?**

**6.5 / 10.**

The reasoning:

- **The editor experience is strong** (a real editor can do 60–70% of their weekly tasks unaided). That's the hardest target to hit and the template largely hits it.
- **The pastor decision experience is strong** — they'd proceed after 30 minutes. The one blocker is the case-study stub.
- **The tech-volunteer experience is the weak piece.** The TinaCloud gap, the Codespaces URL confusion, and the missing OAuth screenshots add up to a 60–125-minute first-time setup instead of a 30-minute one. A volunteer who hits two of these in succession on a Saturday morning will close the tab. The docs that exist are *high quality*; the problem is missing docs (TinaCloud) and unillustrated docs (OAuth).
- **The successor case is genuinely under-served.** No service inventory, no operational runbooks, no central gotchas doc, no path for transferring ownership of external accounts. The technical fundamentals are there to make a project sustainable; the *succession* fundamentals are not.

Single biggest accessibility win possible: **write the missing TinaCloud setup doc (gap A1).** It closes the #1 tech-vol quit point, unblocks gap A4 partially (editors can't access the CMS without it), and is foundational to gap C1 (the successor runbook). Until that doc exists, the "anybody can adopt it" claim has a critical hole.

Most surprising finding: **the maintenance doc tells the tech volunteer to manage editor access in GitHub, but editor access is actually controlled by TinaCloud.** This isn't a clarity issue — it's a documented security hole. A church following the quarterly review procedure will remove someone from GitHub Collaborators (which does almost nothing) and believe they've revoked CMS access (which they haven't). Worth fixing immediately and independently from any larger doc effort.

The good news: nothing in this audit is fundamental. No architectural changes needed. Every gap is closeable with documentation work, mostly small-to-medium-effort. The template *can* deliver on its promise with the gaps closed. It's just not there yet.

---

## Session A completed — 2026-05-15

Quick-win pass focused on small, independent fixes. **Larger items (TinaCloud setup doc, successor runbook, operational runbooks) deferred to their own sessions.** The audit above remains the snapshot.

### Critical: documented security hole fixed (B11)

- **[09-maintenance.md](docs/for-tech-volunteers/09-maintenance.md)** — Rewrote the "Review editor access" quarterly task. Now leads with TinaCloud (the system that actually controls CMS access) and flags the GitHub-Collaborators step as repo-level only. Added a prominent warning callout. Also rewrote the "When someone leaves" section in the same file, which had the same wrong-system bug. Cross-links to [08-grant-editor-access.md](docs/for-tech-volunteers/08-grant-editor-access.md) and [managing-admin-access.md](docs/for-editors/managing-admin-access.md).

### Editor experience fixes (B3 footgun, B9 glossary, B10 inline definitions, D10 Option B, D15 example reordering)

- **[glossary.md](docs/for-editors/glossary.md)** — Added nine missing entries: Vercel, slug, double opt-in, RSVP, environment variable, cron, YAML/frontmatter (merged), Feature Flags. Plain-language for editors, not developers.
- **[02-add-a-sermon.md](docs/for-editors/02-add-a-sermon.md), [03-edit-a-page.md](docs/for-editors/03-edit-a-page.md), [04-add-a-staff-member.md](docs/for-editors/04-add-a-staff-member.md), [05-update-service-times.md](docs/for-editors/05-update-service-times.md)** — Inline definition of "commit" at first occurrence in each doc: "TinaCMS commits (saves a snapshot of) the change…" Glossary stays as backup.
- **[04-add-a-staff-member.md](docs/for-editors/04-add-a-staff-member.md)** — Removed Display Order "Option B" (the renumber-everyone footgun). Only Option A (use 2.5) remains.
- **[06-add-an-event.md](docs/for-editors/06-add-an-event.md)** — Moved the three filled-in examples to the *top* (right after "The three recurrence types"). Editors can pattern-match in 30 seconds without reading the abstract step-by-step. Removed the duplicate Examples section that was at the bottom. The 0-indexed Day-of-Week field is unchanged (UI decision, deferred to a future session).

### Tech volunteer experience fixes (A5 time estimate, D1 swatches, D2 Photopea, D5 Codespaces, D8 npm install, D13 registrar warning)

- **[01-overview.md](docs/for-tech-volunteers/01-overview.md), [README.md](README.md)** — Time-estimate honesty pass. "30 minutes" stays as the *hands-on* / *steady-state* number; "~90 minutes" is now surfaced as the realistic *first-time end-to-end* number (includes Node install or Codespaces orientation + DNS propagation wait). Four touch points updated in README, two in the overview.
- **[05-customize-branding.md](docs/for-tech-volunteers/05-customize-branding.md)** — Added a "Four palettes at a glance" visual swatch table at the top of section 4. Each palette now shows three colored squares (background / primary / accent) plus the hex code. Falls back to legible hex codes if the swatch service is unreachable.
- **[05-customize-branding.md](docs/for-tech-volunteers/05-customize-branding.md)** — Photopea time estimate corrected from "30 seconds" to "5–10 minutes the first time, faster after that." Added a pointer to YouTube walkthroughs.
- **[02-prerequisites.md](docs/for-tech-volunteers/02-prerequisites.md)** — Added a Codespaces 60-hour quota explainer with reassurance ("casual updates use less than 5 hours per month").
- **[04-first-time-setup.md](docs/for-tech-volunteers/04-first-time-setup.md)** — Added the "wall of text scrolling by is normal, just wait for the checkmark" reassurance for the `npm install` step.
- **[07-connect-domain.md](docs/for-tech-volunteers/07-connect-domain.md)** — Added a callout for limited registrars (cheap GoDaddy tiers, hosting bundles that lock DNS) with two recovery options: upgrade the plan, or transfer to a registrar that supports custom DNS.

### Email-pipeline fixes (B7 Resend sandbox, plus AUDIT.md item 9 CHURCH_EMAIL)

- **[setup-devotional-emails.md](docs/for-tech-volunteers/setup-devotional-emails.md)** — Removed the spurious `CHURCH_EMAIL` reference from Step 6's troubleshooting list. Devotionals don't read that env var; it's only for form-submission handlers. (This also closes one of the technical-audit items.)
- **[email-deliverability.md](docs/for-tech-volunteers/email-deliverability.md)** — Added a prominent "Before you start: Resend sandbox mode" section at the top, surfacing the tribal-knowledge fact that `onboarding@resend.dev` only delivers to the verified account owner's address. Now first-class documentation, not a hidden trap.

### Items intentionally deferred (matched the user's scope guard)

The following audit items were touched only enough to mention; the meaty work belongs in a future session:

- **A1 — TinaCloud setup end-to-end doc.** Still missing. Big enough to deserve its own session.
- **C1 — Successor runbook.** Still missing.
- **B1, B2, B6 — Operational runbooks.** Still missing.
- **B3 — Day-of-week dropdown for events.** UI decision; doc unchanged in this pass beyond moving the examples.
- **B4 — Reading-plan rescoping for editors.** Out of scope.
- **A2, A3, A4 — Case studies + Codespaces screenshots + OAuth screenshots.** All require screenshots / new content, not in-scope for this pass.

### Nothing turned out larger than expected

All 13 items were genuinely independent and small. No scope-bleed into the deferred categories. Total edits across 14 files; pure markdown changes; no code touched.
