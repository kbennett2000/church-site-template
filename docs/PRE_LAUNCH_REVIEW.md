---
type: reference
audience: maintainer
time: 5 minutes
---

# Pre-launch review

A persona-driven read of the template's entry points the day before public launch. Each persona arrives cold, with no prior knowledge of the project. Findings are listed in order of perceived persona priority; fixes are noted inline as **Fixed** when applied to this same pass, or **Open** when deferred.

This document is an internal record of the v0.1.0 launch readiness check. It's not meant to be read by adopters.

---

## Persona 1 — A pastor who heard about this from a friend

**Scenario:** Pastor Linda's friend at another church mentioned this template at a conference. Linda lands on the GitHub repo page on her phone during her morning coffee. She has 60 seconds, maybe two minutes.

### What she sees in 10 seconds

- ✅ The repo title says "Church Site Template" — clear, no jargon.
- ✅ The tagline answers her first question ("is this for churches like mine?"): *free, modern, mobile-first, deploy free in 30 minutes*.
- ✅ Two badges (License, Next.js) suggest the project is real and properly licensed.
- ⚠️ **Open:** The "Use this template" button is the first major callout. For someone *deciding* whether to adopt (vs. someone who has already decided), it's premature. They want to see the site first.
- ⚠️ **Open:** Screenshots are below the fold and currently reference `docs/screenshots/marketing/*.png` files that don't exist yet — so on launch day, the screenshots section will render two broken-image icons. This is the single most visible polish gap.

### What she sees in 30 seconds

- ✅ "Why this exists" paragraph names her actual situation: can't afford a pro site, can't maintain a fragile DIY one. She nods.
- ✅ "What you get" bullets are concrete and use the right vocabulary ("sermons," "service times," "prayer requests"). She recognizes every item.
- ✅ "What you'll need" is honest about the ~30 minute setup floor and the ~$12/year domain.

### What she sees in 2 minutes

- ✅ "Pick your path" three-way split with a clear option for her ("setting this up for my church" — though she'd probably hand this to a tech volunteer rather than do it herself; the table makes that distinction implicit but not explicit).
- ✅ "Live examples" gives her a real, working example (MVC). She'd click that link.
- ⚠️ **Open:** "Live examples" currently has only one entry. Until there are 3+, the section feels thin — a pastor evaluating the template wants social proof that it's not just one church.

### What might cause her to bounce

- The broken screenshot images (above). Will damage initial credibility within 5 seconds.
- The case-study screenshots are also missing (same problem inside `docs/case-studies/majestic-view-church.md`).

### Verdict — Persona 1

**Value clear in 10 seconds: yes** (the tagline does the heavy lifting).
**Likely to adopt without seeing the live demo: probably not.** A pastor wants to *see* the church-website-shaped output, not just read about it. Capturing the marketing screenshots is the single highest-impact pre-launch task.

### Fixes applied this pass

- None — the gap is "screenshots not yet captured," which is operational rather than editorial.

### Recommendations before public launch

1. **Capture the four marketing screenshots** (homepage desktop, homepage mobile, CMS dashboard, calendar). Tracked in [SCREENSHOTS_NEEDED.md](./SCREENSHOTS_NEEDED.md).
2. **Capture the MVC case-study screenshots** (before/after WordPress vs new site, on mobile and desktop). Also tracked in [SCREENSHOTS_NEEDED.md](./SCREENSHOTS_NEEDED.md) once we add them there.
3. *(Optional)* Surface "See it live: mvckiowa.com" higher in the README — above the "Use this template" button. Right now the live link is buried in the Live Examples section.

---

## Persona 2 — A tech volunteer who just clicked "Use this template"

**Scenario:** Marcus is the "I can figure this out" volunteer at his church. He just clicked "Use this template," picked a name, and landed on his new repo's page. GitHub may or may not surface TEMPLATE_GUIDE.md automatically.

### What he sees first

- If GitHub does surface `.github/TEMPLATE_GUIDE.md`: a 5-step numbered list with doc links. ✅
- If it doesn't: he sees the README, which leads with "Use this template" — confusing because he already did that.

### Working through the 30 minutes

- ✅ Step 1 — Read overview: `docs/for-tech-volunteers/01-overview.md` is well-structured, has a journey table.
- ⚠️ **Open:** Step 2 — Install Node.js. For Marcus, this could easily be the longest step. The TEMPLATE_GUIDE.md and 01-overview don't warn that step 2 alone might take 15 minutes if he hasn't installed Node before. The "30 minutes total" target is realistic *if* Node is already installed; otherwise it's more like 45.
- ✅ Step 3 — Setup script. `04-first-time-setup.md` and `04a-customize-with-setup-script.md` are thorough. The companion 04a doc is a strong addition.
- ✅ Step 4 — Customize branding. The "replace placeholder avatars with real photos" section gives Marcus a graceful path even if he doesn't have all photos yet.
- ✅ Step 5 — Deploy to Vercel. Detailed walkthrough with screenshots (tracked).

### Friction points

- ⚠️ **Open:** When Marcus runs `npm install` and gets the welcome banner, the banner's "Run setup now?" prompt is great UX but assumes he's at a terminal. If he ran install in his IDE's task runner, the prompt might be invisible. *Not fixable in the script — works for terminal-first users.*
- ⚠️ **Open:** `npm run setup` writes the church name and creates the placeholder logo, but the README's instructions to also fill in beliefs, ministries, and staff are in SEED_DATA.md — not in the post-setup output. Marcus might think he's "done" after setup without realizing how much placeholder content remains.

### What might cause him to give up

- Hitting the Decap CMS GitHub auth step (08-grant-editor-access) without realizing he needs to set up an OAuth proxy. This is documented but the flow is intricate.
- A non-trivial error during `npm install` (peer dep warnings, npm version mismatch, etc.). Doctor catches some but not all of these.

### Verdict — Persona 2

**Does Marcus know what to do in the next 30 minutes: yes.** The journey is well-signposted; each step links to the next. The honest "this might take longer if Node isn't installed" caveat is in [02-prerequisites.md](./for-tech-volunteers/02-prerequisites.md) but should bubble up to [01-overview.md](./for-tech-volunteers/01-overview.md).

### Fixes applied this pass

- ✅ **Fixed:** `scripts/setup.js` previously told the user to "see `docs/CMS_GUIDE.md`" for editing help — that doc no longer exists. Now points to `docs/for-editors/01-getting-started.md`.
- ✅ **Fixed:** `scripts/deploy-setup.js` previously referenced the deleted CMS_GUIDE. Now points to the grant-editor-access doc.
- ✅ **Fixed:** `public/admin/index.html` welcome comment referenced the deleted CMS_GUIDE. Now points to the for-editors guide.
- ✅ **Fixed:** Doctor's "fix this" hint referenced a stale `kbennett2000/church-site-template` placeholder name; now references the actual `your-org/your-repo` placeholder.
- ✅ **Fixed:** `04-first-time-setup.md` used to say "Tech volunteers who've forked the template" — now says "who've created their church's copy of the template."
- ✅ **Fixed:** `06-deploy-to-vercel.md` previously said "the list should now include your fork" — now says "your repo."

### Recommendations before public launch

1. **Add a "Step 2 caveat"** in `01-overview.md`: if you don't have Node.js installed, add 10-15 minutes — or use Codespaces and skip it.
2. **Add a post-setup hand-off message** in `setup.js` that explicitly nudges Marcus toward SEED_DATA.md ("You've set the church name. Now replace the rest of the placeholder content — see SEED_DATA.md").
3. **Consider scripting OAuth proxy setup** in a future release. For v0.1.0, the manual flow in 08-grant-editor-access is acceptable.

---

## Persona 3 — A developer evaluating whether to contribute

**Scenario:** Sara is a freelance Next.js developer who saw the repo trending on GitHub. She's debating whether this is worth her time as an open-source project to contribute to.

### What she sees first

- ✅ README's "I'm a developer" path lands her on `architecture.md`.
- ✅ Stack table answers her tech questions in 30 seconds.
- ✅ The "Template vs. Instance" section at the top of architecture.md tells her this isn't a typical fork-and-PR project — it's a template that adopters use independently. She immediately understands the contribution model.
- ✅ ADR-009 in `decision-log.md` explains *why* the template-not-fork approach was chosen with alternatives weighed.

### Working through her evaluation

- ✅ Architecture doc is genuinely useful — folder layout, RSC rationale, loader pattern, build pipeline all covered.
- ✅ Decision log has 9 ADRs covering the major stack choices. Sara respects this.
- ✅ Contributing guide is honest about what's welcome vs. not (the "no, thanks" section is rare and useful).
- ✅ The two-workflow split (template improvements vs. instance maintenance) is clearly explained.
- ⚠️ **Open:** No automated test suite. Acknowledged in contributing.md ("known gap") but for a 2026 launch, the lack of even basic Vitest+Playwright will look dated to evaluators.
- ⚠️ **Open:** No CI badge in the README. Even a simple "build passes" check would signal that the project is alive.
- ⚠️ **Open:** No `CONTRIBUTORS.md` or sponsors list yet — empty until the first contributors land.

### Friction points

- The `your-org/your-repo` placeholder in `public/admin/config.yml` is intentional (per ADR-009) but a developer skimming the codebase for the first time might flag it as "stale" before reading the docs that explain why.
- The codebase has some legacy hardcoded data in `/lib/groups.ts`, `/lib/prayer-wall.ts`, `/lib/serve-roles.ts` that should be in `/content/`. This is on the roadmap but a discerning reader will notice the inconsistency.

### Verdict — Persona 3

**Does Sara understand the architecture and contribution flow: yes.** Both architecture.md and the Template-vs-Instance framing make the unusual two-repo model very clear. The decision log is one of the strongest signals of project seriousness.

**Will she contribute: maybe.** The lack of tests is the biggest deterrent for a senior developer evaluating where to spend volunteer time. A first PR adding even a smoke test would meaningfully change the project's signaling.

### Fixes applied this pass

- ✅ **Fixed:** Multiple stale references to the deleted `REFACTOR_FOR_TEMPLATE.md` were replaced with current cross-references. Sara would have hit these links and bounced.
- ✅ **Fixed:** `lib/calendar-data.ts` had a comment pointing at deleted `docs/CONTENT_AUDIT.md`; rewrote to describe the actual situation.
- ✅ **Fixed:** Many doc-feedback footers pointed at `your-org/your-repo` — bulk replaced with the real template repo path.

### Recommendations before public launch

1. **Add a minimal test suite** before v0.2 — even just one Vitest snapshot per page would change the project's contribution signaling significantly.
2. **Add CI** (GitHub Actions running `npm run build` + `tsc --noEmit` on every PR). Cheap to set up, big trust signal.
3. **Open a few "good first issue" tickets** before public launch so Sara has somewhere to start. Examples: migrate `/lib/groups.ts` to `/content/`; replace remaining stock-photo references; add an analytics integration.
4. **Tag the v0.1.0 release on GitHub** so the CHANGELOG link works.

---

## Cross-cutting findings

A few issues that span all three personas:

### Screenshots

The single biggest gap. The README, the editor docs, the tech-volunteer docs, and the case study all reference screenshot files that haven't been captured. On launch day this will be the most visible polish gap.

- 39 image links in markdown files resolve to non-existent files.
- All are tracked in [SCREENSHOTS_NEEDED.md](./SCREENSHOTS_NEEDED.md).
- Recommendation: **block public launch on capturing at least the four marketing screenshots** (README hero + editor screenshot, plus the homepage in mobile and desktop). The editor-track screenshots can come in a v0.1.1 doc-polish release.

### "Use this template" button must be enabled

The README, TEMPLATE_GUIDE, and several docs all instruct adopters to click the green "Use this template" button. **That button does not appear unless the repo is configured as a template in GitHub's Settings → General → Template repository.** This is the single most important pre-launch toggle.

### CHANGELOG link

The CHANGELOG references a release tag `v0.1.0` that doesn't exist yet. Until the tag is pushed and a GitHub Release is created, the link 404s.

### MVC sweep

All MVC references outside the case-study/credits contexts have been removed. Remaining intentional references:

- README.md (Live Examples + Credits)
- docs/marketing/one-pager.md (case study reference)
- docs/README.md (case study link in doc map)
- docs/case-studies/* (the case studies themselves)
- docs/for-developers/contributing.md (explicit "see case study" mention)
- CHANGELOG.md (case study entry)

### Build status

- `npm run build` passes cleanly with 28 statically-generated pages, no TypeScript errors, no warnings.
- `npm run doctor` reports 1 expected issue (placeholder CMS repo path — intentional for the template, doctor message is accurate).

---

## Final verdict

**The template is launch-ready** — assuming the four blockers below are resolved:

1. ✅ **Done:** All MVC references cleaned up outside case-study/credits contexts.
2. ✅ **Done:** All non-screenshot internal links verified.
3. ✅ **Done:** Build passes cleanly with generic seed data.
4. ⚠️ **Open:** Screenshots not yet captured — marketing + editor + case-study sets.
5. ⚠️ **Open:** Repo must be toggled to "Template repository" in GitHub settings.
6. ⚠️ **Open:** v0.1.0 git tag and GitHub Release need to be created so CHANGELOG links resolve.

Soft recommendations (good for v0.2):

- Add basic test suite (Vitest).
- Add GitHub Actions CI.
- Open 3–5 "good first issue" tickets.
- Capture remaining editor + tech-volunteer screenshots.
- Migrate `/lib/groups.ts`, `/lib/prayer-wall.ts`, `/lib/serve-roles.ts` to `/content/`.

---

*Reviewed against template state as of v0.1.0 pre-launch. Re-run this review on any major refactor or persona-relevant change.*

---

## Appendix A — Draft repo description

Paste into **Settings → General → Description** (or via the gear icon at the top of the About panel). GitHub allows up to 350 characters.

```
Free, mobile-first website template for small churches. Editors update content in their browser — no developer needed long-term. Deploys free on Vercel in ~30 minutes. Built on Next.js + Decap CMS. MIT licensed.
```

Character count: **226** (well under the 350 cap).

If you want to include a hint about adoption mechanics, an alternative:

```
A free, open-source website template for small churches. Click "Use this template," customize for your church, deploy free on Vercel — about 30 minutes. Editors update content in their browser, no developer needed. Next.js + Decap CMS, MIT licensed.
```

Character count: **261**.

---

## Appendix B — Draft v0.1.0 release announcement

Paste into the **release body** when creating the `v0.1.0` GitHub release. Markdown.

```markdown
# Church Site Template v0.1.0 — Initial Release 🎉

A free, mobile-first website template for small churches. Editors update content in their browser — no developer needed long-term. Deploys free on Vercel in about 30 minutes.

This is the first public release. The template grew out of a real redesign project for [Majestic View Church](https://mvckiowa.com/) in Kiowa, Colorado, then was generalized into a starter any small church can adopt. The MVC version is live; the full case study is in [docs/case-studies/majestic-view-church.md](docs/case-studies/majestic-view-church.md).

## What you get

- **A complete church website** — homepage, sermons archive, plan-a-visit, calendar, ministries, small groups, prayer requests, give, contact, about, beliefs.
- **Browser-based editing (Decap CMS)** — staff update content without touching code. Editorial-workflow mode means every edit becomes a pull request reviewed before going live.
- **Mobile-first design** — built for the 70%+ of visitors arriving on phones.
- **Free hosting on Vercel** — scales to thousands of visitors a day at no cost.
- **No vendor lock-in** — content is plain Markdown and JSON in your repo. Move anywhere, anytime.

## Get started

1. Click the green **Use this template** button at the top of [the repo](https://github.com/kbennett2000/church-site-template).
2. Open your new repo in [GitHub Codespaces](https://github.com/features/codespaces) (zero install) or clone it locally.
3. Run `npm install`, then `npm run setup`. Follow the prompts.
4. Run `npm run deploy` to push to Vercel.

Full 30-minute walkthrough: [docs/for-tech-volunteers/01-overview.md](docs/for-tech-volunteers/01-overview.md).

## Highlights

- **Three-track docs** following the Diátaxis framework — separate guides for content editors, tech volunteers, and developers.
- **Two example content configurations** — see [`examples/small-rural-church`](examples/small-rural-church/) and [`examples/suburban-family-church`](examples/suburban-family-church/) for what real-world adoption looks like.
- **Case study** — [Majestic View Church](docs/case-studies/majestic-view-church.md) is the inaugural adopter, with a submission template waiting for the next church to share their story.
- **Marketing materials** — one-pager, elevator pitches, and feature comparison vs. Squarespace/Wix/WordPress for tech volunteers pitching the template to pastors and boards.

## What's NOT in v0.1.0

A few honest caveats:

- **No automated test suite** yet. Manual testing only. Adding Vitest + Playwright is on the roadmap.
- **Forms (contact, prayer, newsletter, visit) are UI-only by default.** Wiring them to a service like Resend, Formspree, or Mailchimp requires a developer.
- **Decap CMS production GitHub OAuth** requires the adopting church to set up an OAuth app or proxy — documented but not automated. Local CMS mode works out of the box.
- **Screenshots in the docs** are still being captured. Most reference paths exist but the PNGs are pending. Tracked in [docs/SCREENSHOTS_NEEDED.md](docs/SCREENSHOTS_NEEDED.md).

## Got a church using this?

After you launch, we'd love to feature your church. Open a pull request adding yourself to the [Live examples](README.md#live-examples) section and the [case studies folder](docs/case-studies/) — see [docs/case-studies/README.md](docs/case-studies/README.md) for the submission template.

## Full changelog

See [CHANGELOG.md](CHANGELOG.md) for the detailed feature inventory.

---

Thanks to the people at Majestic View Church for being the willing prototype church. If this template saves your church $500–$5,000 in web fees over the next few years, that's the goal.

— Maintainers
```

---

*End of pre-launch review.*
