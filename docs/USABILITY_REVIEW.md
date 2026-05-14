---
type: reference
audience: all
---

# Usability review — editor & tech-volunteer tracks

A persona-driven read of all 20 docs in [for-editors/](for-editors/) and [for-tech-volunteers/](for-tech-volunteers/), capturing where a non-technical reader would stumble, get confused, or quit. Includes what was found, what was fixed, and what was deliberately left alone.

The full per-line findings (175 flags) are preserved in [USABILITY_REVIEW_RAW.md](USABILITY_REVIEW_RAW.md) as an audit trail.

---

## Methodology

**The persona:** a 65-year-old church secretary.

- Comfortable with email, Facebook, Microsoft Word, online banking.
- Has **never** used: GitHub, a code editor, a terminal / command line / PowerShell, npm, git, Codespaces.
- Knows what a "web browser" and "URL" are. Would Google unfamiliar terms but might still be uncertain afterward.
- Reads instructions literally.
- **Would close the tab if she hits 2+ unfamiliar terms in a row without explanation.**

A sub-agent read every file in the two tracks and flagged issues across six categories: `give-up-risk`, `ambiguous-step`, `assumed-knowledge`, `jargon-undefined`, `missing-context`, `good` (positive patterns worth keeping).

## Findings at a glance

| Category | Count | Track tilt |
| --- | --- | --- |
| give-up-risk | ~50 | Mostly tech-volunteer |
| assumed-knowledge | ~55 | Both, but worse in tech-volunteer |
| jargon-undefined | ~45 | Both |
| ambiguous-step | ~15 | Mostly editor |
| missing-context | ~10 | Both |
| good | ~15 | Both (positive examples) |

**Top 3 problem docs:**

1. **[for-tech-volunteers/05-customize-branding.md](for-tech-volunteers/05-customize-branding.md)** — Drops into CSS, HSL theory, JSX/TypeScript edits, raw file paths. The cliff begins at "edit the CSS variables" and never lets up.
2. **[for-tech-volunteers/02-prerequisites.md](for-tech-volunteers/02-prerequisites.md)** — First-time hit with "terminal," `node --version`, `git config --global`, package managers. If a volunteer's going to bail on the project, it's here.
3. **[for-tech-volunteers/07-connect-domain.md](for-tech-volunteers/07-connect-domain.md)** — Seven new DNS terms in a row, then deletion instructions that read like "you might break email."

**Editor track is in much better shape** than the tech-volunteer track. The persona is precisely the editor audience, and the docs were written to her level deliberately. Most editor flags were minor — except one repeating pattern that affected every single doc.

## Patterns observed

### The repeating pattern (every editor doc had it)

Every editor doc's "Stuck?" footer ended with:

> `- Email a tech volunteer or open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)`

She'd read "Email a tech volunteer" and stop. The second clause — "or open an issue" — uses verbs she doesn't understand and links to a place she'd never go on her own.

This pattern appeared **10 times** (once per editor doc). It was the single biggest cumulative friction point. Fixed in this pass.

### "Decap" used without re-introduction

Multiple editor docs use the name "Decap" without explaining it's the editor they've been calling "the editor." The persona would wonder if Decap is a different thing entirely. Flagged but not fixed — replacing "Decap" everywhere is invasive and the name is searchable. Recommended for a future style pass.

### "kbennett2000/church-site-template" placeholders

URL placeholders like `https://github.com/kbennett2000/church-site-template` appear in many guides. The persona would read these literally and try to navigate to that exact URL. Flagged but mostly accepted — these get find-and-replaced when the real repo is published.

### Tech-volunteer audience tension

The tech-volunteer track is written for a **semi-technical** person ("can install software, follow steps, but isn't a developer"). The 65-year-old persona is one notch below that. Strict persona application would dumb down the tech-volunteer track in ways that hurt its actual audience.

**Decision:** Fix the worst give-up risks in tech-volunteer docs (clear cliffs, undefined jargon clusters, missing reassurance around scary actions), but don't try to make tech-volunteer docs readable for the strict persona. Most flags in that track are appropriate for the stated audience.

---

## Fixes applied in this pass

### Editor track

**Every editor doc — replaced the "Stuck?" footer** ([10 files](for-editors/)).

Before:
```
- Email a tech volunteer or open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)
```

After:
```
- Ask your church's tech volunteer. They can sit next to you, share screens,
  or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: open a GitHub issue
  (this is the tech-volunteer route — your tech volunteer can help you do it if needed).
```

The friendlier route is listed first and explained in concrete terms (sit next to you, share screens). The GitHub option is preserved but framed as secondary.

### Tech-volunteer track

**[02-prerequisites.md](for-tech-volunteers/02-prerequisites.md)** — Added two `Important` / `Heads up` callouts:

- At the top of "Two paths — pick one": explicit guidance that **Path A is button-clicking and Path B requires typing in a terminal**, with a "choose Path A if you've never typed in a terminal" recommendation.
- At the top of "Path B": a "terminal required" callout that reinforces the alternative.

**[05-customize-branding.md](for-tech-volunteers/05-customize-branding.md)** — Added a code-editing gate before the deep customization sections:

> **Code editing starts here.** Everything below this point involves opening real code files (CSS, TypeScript, JSX) and changing values inside them. If your church's brand colors are *close* to one of the four palettes from `npm run setup`, **stop here — that's good enough**. Push the fine-tuning to a developer or skip it entirely.

This gives the volunteer permission to stop without feeling like they failed.

**[07-connect-domain.md](for-tech-volunteers/07-connect-domain.md)** — Added a panic-prevention callout before the "Remove conflicting records" step:

> **Don't panic about email.** Email and websites use completely different DNS record types. Email lives in **MX records** and (sometimes) **TXT records**. Websites live in **A records** and **CNAME records**. We're only touching the website records in this step. Your email will keep working as long as you don't touch the MX or TXT records.

The existing warning about MX records is kept, but the new lead-in defuses the fear before it becomes a give-up moment.

---

## What was deliberately not fixed (and why)

These were flagged in the raw findings but left alone:

### "kbennett2000/church-site-template" placeholders (~30 occurrences)
Used consistently in docs, scripts, configs. Will be find-and-replaced once a real GitHub repo URL exists. Fixing them now in the docs would create a divergence with the scripts that also use this placeholder. Better to handle as a single sweep at template-publish time.

### "Decap" name used without re-explaining (multiple docs)
The first occurrence in each doc usually has a parenthetical ("Decap, the editor") but subsequent occurrences drop it. Rewriting to "the editor" everywhere would be invasive. The persona could Google "Decap" if confused. Future style pass.

### Git/SSH/PAT jargon in tech-volunteer troubleshooting
SSH keys, personal access tokens, `git rebase`, `git revert HEAD`, CORS, webhooks. These are appropriate for the semi-technical audience the track is written for. A non-technical reader would call a developer at this point, which is the right outcome.

### Day-of-week-number issue (0=Sunday)
In [06-add-an-event.md](for-editors/06-add-an-event.md), the editor types `0` for Sunday, `1` for Monday, etc. — because that's how the underlying data model works. The doc already has a `Tip` callout acknowledging it ("Sunday is `0`, not `7`. The numbering starts at zero — that's a computer thing"). Fixing this properly would require **adding friendly day labels to the Decap dropdown** in `public/admin/config.yml` — a code change, not a docs change. Logged as a future improvement.

### ASCII flow diagrams in publishing-changes.md
The persona might find them confusing. But they help visual learners. Net positive. Kept.

### Photo pixel dimensions
The persona may not know how to determine a photo's pixel dimensions before uploading. The doc already says "if you're unsure, just upload it and see how it looks." Reasonable trade-off.

---

## Patterns worth preserving (the "good" flags)

The agent surfaced ~15 places where the docs handle the persona well. These are templates to repeat in future docs:

1. **Inline definitions** — "`CMS` (Content Management System — a fancy term for…)". Already pervasive; keep doing this.
2. **"This is the part most people get stuck on, so go slowly"** — humanizes the doc and primes patience.
3. **"You'll never see code, type any commands, or break anything that can't be undone"** — explicit reassurance early in the editor track.
4. **The "Common Mistakes" section** — surfaces real-world snags that even a careful reader makes.
5. **Concrete examples (numbers, names, URLs)** rather than abstract placeholders, wherever possible.

---

## Recommendations for the next pass

In order of cost vs. impact:

1. **Replace "Decap" with "the editor" across editor track.** ~30-min sweep. High impact — eliminates a recurring confusion point.
2. **Add friendly day labels to the events recurrence dropdown** in `public/admin/config.yml`. ~15 min. Eliminates the "0 = Sunday" cliff entirely.
3. **Capture the screenshots in [SCREENSHOTS_NEEDED.md](SCREENSHOTS_NEEDED.md).** The persona is a visual learner; some of the flagged "give-up risks" would self-resolve with a clear screenshot of the relevant button.
4. **Add a video for the highest-anxiety task** (logging in for the first time). Script already exists at [video-scripts/login-and-tour.md](video-scripts/login-and-tour.md).
5. **Sweep `kbennett2000/church-site-template` placeholders** when the template publishes to a real GitHub URL.

---

*Want to flag a usability issue we missed? [Open a doc-feedback issue](https://github.com/kbennett2000/church-site-template/issues/new?template=documentation-issue.yml&title=Usability:%20...).*
