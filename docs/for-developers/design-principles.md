---
type: explanation
audience: developer
time: 10 minutes
---

# Design principles

**Who this is for:** Anyone making a change to this template. The principles below are the values that have been quietly shaping decisions in this codebase. Writing them down makes the implicit explicit, so future calls can be made consistently without re-litigating each argument.

**How this relates to [decision-log.md](./decision-log.md):** the decision log records *what* we chose. This doc records the *values* underneath — patterns we tend to reach for, and patterns we tend to avoid. These principles are descriptive, not aspirational, unless noted. They were extracted from the code and recent commit history.

---

## A. Connection over institutional channels

When designing contact, staff, and visitor-facing patterns, prefer ones that encourage individual human contact over centralized institutional channels. A generic `info@` form works, but it feels like shouting into a void. When the institutional pattern is necessary (privacy, spam, pastoral capacity), it should be the church's *deliberate choice*, not the *default the template imposes*.

**Evidence:** This is the principle most aspirational of the set. The current footer renders a single `churchInfo.email` ([site-footer.tsx:90](../../components/site-footer.tsx#L90)) and `/connect/contact` posts to one inbox. The instinct shows up in the per-staff bio pattern in [content/staff/](../../content/staff/) — each staff member is their own document, not flattened into a roster — but optional per-staff contact links and role-routed forms are future work.

**Implication:** when adding contact-related surface, default to the per-person variant and make the institutional one the opt-in. Carry the *we want you to reach out* signal in design and language even before any address is exposed.

## B. Derived, not declared

Where a data relationship already exists in the content, derive it. Don't create a parallel schema collection to express it. Fewer fields to maintain in sync, no "empty of content" states, and the data stays its own source of truth.

**Evidence:** Sermon series are derived from the `series` string field on each sermon — there is no Series collection ([content/sermons-series.ts](../../content/sermons-series.ts)). The social-media row derives visible icons from each entry's `platform` field rather than maintaining a separate "which platforms are enabled" toggle ([lib/social.ts:100-142](../../lib/social.ts#L100-L142)). The footer's "made in {city}" line reads city from the address that already exists.

**Implication:** before adding a new collection or flag, look for the relationship already implicit in existing data. If you can derive it cheaply at build time, do.

## C. No broken links, no useless interactions

Never render UI that leads nowhere or fails silently. An absent thing should be *absent* in the rendered DOM — not present as a broken vestige (empty container, flex gap, link to nowhere).

**Evidence:** `SocialLinks` returns `null` when the list is empty ([social-links.tsx:26](../../components/social-links.tsx#L26)); entries with a blank URL are filtered before render ([lib/social.ts:113-114](../../lib/social.ts#L113-L114)). The watch page renders the series chip and the "Browse by series →" link conditionally ([app/watch/page.tsx:96-100](../../app/watch/page.tsx#L96-L100), [:155-162](../../app/watch/page.tsx#L155-L162)). The series index renders an empty state rather than 404ing. The doctor script prints dashboard URLs as plain text rather than auto-opening browsers, which behave unpredictably across operating systems.

**Implication:** when adding a feature that depends on optional content, write the empty/absent path first. The "no content yet" rendering is a real state, not an oversight.

## D. Help, don't enforce

When adding structure to free-form editor input, help the editor reach canonical form — don't reject non-canonical input. Be a useful assistant, not a strict validator. The exception is closed option lists, where the value set is genuinely finite and constraining input is honest structure, not enforcement.

**Evidence:** The scripture field's `ui.parse` autoformat expands `Jn. 3:16` to `John 3:16` on save but passes `Doug 8:14` through unchanged ([tina/config.ts:258-339](../../tina/config.ts#L258-L339), including the explicit "Help, not enforce" comment). The calendar-date parse/format normalizes representation without rejecting unfamiliar input shapes ([tina/config.ts:49-83](../../tina/config.ts#L49-L83)). Conversely, the sermon `book` field *is* a closed dropdown of 66 canonical books — the value set is finite, so a dropdown is honest, not coercive.

**Implication:** ask whether the value set is genuinely finite. If yes, constrain with a closed list. If no, accept what the editor typed and improve it where you confidently can.

## E. Provider-agnostic abstraction

For any third-party capability the template integrates, abstract over providers rather than hardcoding one. A small church changes providers far less often than a SaaS bundler imagines, but when they do, the template shouldn't be the reason they can't.

**Evidence:** The giving integration supports seven providers (Planning Center, Tithe.ly, Pushpay, Subsplash, Stripe, custom URL, offline-only) selected via config — see the discriminated `GivingProvider` union and `getGivingHref` switch in [lib/giving.ts](../../lib/giving.ts). The Resend integration sits behind [lib/resend.ts](../../lib/resend.ts)'s lazy `getResend()` factory; [ADR-011](./decision-log.md#adr-011-resend-for-transactional-email) notes the abstraction is small enough to swap providers in a day.

**Implication:** route every external capability through a thin abstraction in `lib/`. The cost is small; the optionality it preserves for adopters is large.

## F. Coordinated changes are first-class design objects

Some changes touch more than one system at once. A TinaCMS schema change has a known protocol: modify `tina/config.ts`, regenerate `tina-lock.json`, commit and push both atomically before TinaCloud reindexes from GitHub. Skip a step and the local schema, the lock, and TinaCloud's index end up in three different states — no single reindex resolves the divergence.

**Evidence:** The standing rule at the top of [CLAUDE.md](../../CLAUDE.md) is exactly this protocol. Recent schema-change commits document it inline — `3886115` ("Schema change → tina-lock regenerated"), `3a9db90` ("tina-lock.json regenerated and committed atomically per the standing rule from the date-fix saga"), `d766bbe` ("Carries tina-lock regen + a cheap TinaCloud reindex on MVC").

**Implication:** when a change requires coordination across multiple systems, treat the protocol as part of the design and write it down — commit body or runbook — so the next person doesn't rediscover it the hard way.

## G. Trust but verify against reality

Where it's cheap, verify against the actual current state instead of memory of what the state was.

**Evidence:** The doctor script inspects content shape, not just env-var presence — it catches `logoUrl` values pointing at `localhost` that would render as broken images in real inboxes ([scripts/doctor.js:231-251](../../scripts/doctor.js#L231-L251)), and skips checks when the relevant feature flag is off rather than warning spuriously. The date-fix commit (`d766bbe`) verified its "no schema-level change" claim by diffing the generated `schema.gql` and `types.ts` byte-for-byte before and after, rather than asserting it from inspection.

**Implication:** before shipping a change that depends on a current-state assumption, check the current state. A grep, a build, or a byte-level diff beats remembering what was true last week.

---

## This document is meant to be amended

These principles were extracted from today's code; they are not a contract. Add a section when a new pattern proves itself; refine or strike one when it stops describing the code.

The relationship with [decision-log.md](./decision-log.md): an ADR is a snapshot of a choice and its alternatives at one moment. A design principle is the value that informed the choice and that we expect to apply again next time. New ADRs should land consistent with these principles, or amend them on the way through.

Two candidates were considered and dropped for thin evidence: *calmness over alarms* (real but possibly just one author's voice), and *one instance, proven first* (a development-stage observation, not a governing principle). Revisit if either crystallizes.

## What's next?

- [Decision log](./decision-log.md) — the specific choices these principles informed.
- [Architecture](./architecture.md) — how the codebase is laid out.
- [Contributing](./contributing.md) — how to propose changes.

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Design%20Principles).*
