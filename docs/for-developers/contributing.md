---
type: explanation
audience: developer
time: 10 minutes
---

# Contributing

**Who this is for:** Developers who want to send a pull request to improve the template, OR developers maintaining a church's adopted instance who want to know how to sync template updates downstream.
**What you'll accomplish:** Understand the PR workflow for improving the template, the code-style expectations, what changes are welcome, and the mechanics of syncing changes between the template and church instances.
**You'll need first:** A GitHub account. For contributions to the template, you'll fork it (see "Fork and branch" below). For maintaining a church instance, see [for-tech-volunteers/03-use-this-template.md](../for-tech-volunteers/03-use-this-template.md).

---

## Two distinct workflows

This codebase plays two roles. Read [architecture.md → Template vs. Instance](./architecture.md#template-vs-instance) for the full context, but the short version:

1. **Improving the template repo** itself. This doc primarily covers that workflow — fork, branch, PR, the usual.
2. **Maintaining a church instance** — a real church's site that started life as a copy of this template. That's covered at the end of this doc under [Keeping a church instance in sync with the template](#keeping-a-church-instance-in-sync-with-the-template).

If you're doing both at the same time (a developer who maintains a specific church's instance AND wants to contribute fixes back), you'll wear different hats in different repos. Improvements to the template land in the template repo; church-specific work stays in the church's instance.

---

## What this project is

This is an **open-source starter template** for small-church websites. It's built on Next.js + TinaCMS and designed so:

- A non-technical editor can update content through a browser.
- A semi-technical volunteer can deploy and maintain it.
- A developer can fork it and customize it deeply.

The default seed content is generic ("Grace Community Church" — a fictional placeholder). It's meant to be replaced when a church adopts the template. The template grew out of a prototype redesign for Majestic View Church; see [the MVC case study](../case-studies/majestic-view-church.md) for that story.

---

## What changes are welcome

### Yes, please

- **Bug fixes.** Anything broken on a clean install, in a fresh deploy, or in a documented usage flow.
- **Accessibility improvements.** Better keyboard nav, screen-reader support, color contrast.
- **Performance improvements.** Smaller bundles, faster loads, fewer layout shifts.
- **Documentation fixes.** Typos, broken links, outdated steps, missing screenshots.
- **Generic features.** Things any small church would want — better calendar rendering, better sermon search, dark mode toggle, etc.
- **Better defaults.** A more accessible color palette, a clearer setup script prompt, better error messages.
- **New optional integrations.** Newsletter providers (Mailchimp, Buttondown), giving platforms (Tithe.ly, Pushpay), as opt-in feature flags.
- **i18n.** Localization to languages other than English, gated behind a config flag.

### Maybe — discuss first

- **Major dependency changes.** Switching CSS frameworks, swapping the CMS, etc. Open an issue first so the direction can be agreed.
- **New routes or sections.** Discuss whether they belong in the core template or as a documented extension.
- **Architectural changes.** ADRs welcome — see [decision-log.md](./decision-log.md) for examples.

### No, thanks

- **Church-specific features.** A scholarship program calculator, a denomination-specific liturgy renderer, etc. Fork it — these belong in a custom branch, not the upstream template.
- **Opinionated UX changes** that override existing design without discussion. The template tries to feel reverent, warm, and competent. Sweeping aesthetic rewrites should come through a design proposal first.
- **Vendor lock-in.** Tying the template to a specific paid SaaS provider as a requirement (rather than an optional integration).
- **Changes that hurt template-readiness.** Hardcoding church-specific data into components, bypassing the content layer, etc. The rule of thumb: would this make sense for *any* small church, or only for the church you're working with? See [architecture.md → Template vs. Instance](./architecture.md#template-vs-instance) for the full reasoning.

---

## PR workflow

### 1. Open an issue first (for non-trivial changes)

For anything bigger than a typo, **open an issue** describing what you want to change and why. This avoids you investing hours in a PR that gets rejected.

For typos and obvious bug fixes, skip straight to the PR.

### 2. Fork and branch

Fork the repo. In your fork:

```
git checkout -b fix/calendar-modal-keyboard
```

Branch naming convention:
- `fix/<short-description>` for bug fixes.
- `feat/<short-description>` for new features.
- `docs/<short-description>` for doc-only changes.
- `chore/<short-description>` for tooling, deps, refactors.

### 3. Make the change

- Keep PRs focused. One concern per PR.
- If you're touching multiple files, group related changes into commits.
- Run `npm run build` locally before pushing — make sure it passes.

### 4. Commit conventions

Conventional Commits:

```
fix(calendar): close modal on Escape key
feat(blog): add new blog collection
docs(editors): clarify YouTube ID extraction
chore(deps): update next to 16.2.6
```

Not strict — clarity matters more than the prefix.

### 5. Open the PR

PR title: short, descriptive. PR description should answer:

- **What changed** — what does the PR do?
- **Why** — what problem or improvement does it address?
- **How tested** — what did you verify works?
- **Screenshots** — if the change is visual.

### 6. Review

Maintainers will review within a week or two. Expect:

- Questions about why a change was made.
- Suggestions for naming, structure, or coverage.
- Sometimes a request to split into smaller PRs.

Be patient and responsive. The reviewer's job is to keep the template coherent.

---

## Code style

### TypeScript

- **Strict mode is on.** `tsconfig.json` has `"strict": true`. No `any` without a comment explaining why.
- **No unused variables.** ESLint catches them.
- **Prefer interfaces for object types.** `interface Foo {}` over `type Foo = {}` for plain object shapes.
- **Default to `const`.** Use `let` only when the variable is reassigned.
- **No `enum`.** Use string literal unions or `as const` arrays.
- **Async/await over `.then()`.** Cleaner stack traces.

### React

- **Server components by default.** Add `"use client"` only when needed.
- **Props typed inline or as interface.** Don't use `React.FC` (deprecated convention).
- **No prop drilling more than 2 levels.** Compose at the parent or use context.
- **Boolean props named affirmatively.** `isVisible`, not `notHidden`.

### Naming

- Files: kebab-case (`event-modal.tsx`).
- Components: PascalCase (`EventModal`).
- Functions and variables: camelCase.
- Constants: SCREAMING_SNAKE_CASE for module-level, camelCase otherwise.
- TypeScript types and interfaces: PascalCase.

### Tailwind

- Use the cn() helper from `lib/utils.ts` for conditional classes:
  ```tsx
  className={cn("p-4", isActive && "bg-primary")}
  ```
- Don't construct class strings dynamically (`bg-${color}`) — Tailwind can't see them.
- Order classes loosely: layout → spacing → typography → color → state. Not a hard rule, but consistency helps reviewers.

### Imports

- Absolute imports via `@/` alias for project files.
- Group: builtins, then npm packages, then `@/`, then relative.
- Type-only imports use `import type` when possible.

```ts
import { useState } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { getSermons } from "@/lib/sermons";

import type { Sermon } from "@/lib/sermons";
```

---

## Testing

Currently the project relies on **manual testing**. There's no automated test suite. This is a known gap.

Until tests exist:

- Run `npm run build` and verify it passes with no warnings.
- Run `npm run start` and click through the affected pages.
- For CMS changes, run `npm run cms` locally (starts TinaCMS dev mode).
- For setup script changes, run `npm run setup` end-to-end on a clean checkout.

Contributions adding a test framework (Vitest + Playwright likely) are welcome — open an issue first to align on approach.

---

## Adding a new dependency

Before adding a new npm package:

- **Is this needed?** Could a small helper function solve the problem?
- **Is it actively maintained?** Check the last release date on npmjs.com.
- **Is it widely used?** Weekly downloads matter — niche packages become maintenance burdens.
- **What's the bundle impact?** Check on [bundlephobia.com](https://bundlephobia.com/).
- **Is the license compatible?** MIT, Apache 2.0, BSD are fine. GPL and AGPL aren't (they restrict downstream use).

If yes to all of the above, add it. Mention the package in the PR description with a justification.

---

## Documentation expectations

- New features need docs in the right track (editors, tech volunteers, or developers).
- Bug fixes that change behavior should update existing docs.
- Use the Diátaxis frontmatter pattern. See existing docs for the format.
- Screenshots are aspirational paths — don't worry about creating images; they'll be captured later.

---

## Releases

The template is versioned with semantic versioning:

- **Major (1.0 → 2.0):** breaking changes that require existing churches to migrate.
- **Minor (1.0 → 1.1):** new features, backward-compatible.
- **Patch (1.0 → 1.0.1):** bug fixes and docs.

A changelog lives in `CHANGELOG.md` (to be added).

---

## Keeping a church instance in sync with the template

This section is for **developers maintaining a church's adopted instance** of the template — *not* contributors improving the template itself.

When a church clicks "Use this template" on GitHub, their new repo is **independent of the template** — there's no Git relationship between the two. That's deliberate (see [decision-log.md → ADR-009](./decision-log.md#adr-009-github-template-not-fork-for-church-adoption)) but it means template improvements don't automatically reach the church.

If a useful change lands in the template — a bug fix, a security patch, a new feature — and the church wants it, the developer has to bring it over manually. Three approaches:

### Approach A: Manual cherry-pick (simplest, most control)

Best when: you want one specific change, not a bulk catch-up.

1. **Read the template's recent commits** at [github.com/kbennett2000/church-site-template/commits/main](https://github.com/kbennett2000/church-site-template/commits/main). Or watch the repo's Releases page if the maintainers tag releases.
2. **Find the change** you want — usually a single commit or a small group of related commits.
3. **In your church-instance repo**, recreate the change. Easiest path: open the commit on GitHub, look at the diff, apply the same edits locally in your church repo, commit and push.
4. **Alternative**: use Git's cherry-pick after adding the template as a remote:
   ```bash
   git remote add template https://github.com/kbennett2000/church-site-template.git
   git fetch template main
   git cherry-pick <commit-sha>
   ```
   Resolve any conflicts. Test thoroughly — template code and your customizations may have drifted.

Works for any change, including ones that conflict with your customizations. Hands-on but predictable.

### Approach B: `git-template-sync` (or similar tool)

Best when: you want to bulk-sync many template changes at once, on a schedule.

A few open-source tools automate "pull non-conflicting changes from a template repo into a downstream copy":

- [`git-template-sync`](https://github.com/AndreyKozhev/git-template-sync) (community tool)
- [`fork-sync`](https://github.com/marketplace/actions/fork-sync) (GitHub Action — works on forks; less useful here since instances aren't forks)
- Custom scripts using `git diff` + `git apply --3way`

These tools add the template as a remote, identify the diff since the church last synced, and apply non-conflicting changes. They flag conflicts for human resolution.

Pros: low ongoing effort, catches most improvements automatically.

Cons: tools are third-party and not all are well-maintained. Conflicts on customized files (especially `content/site.json`, `app/globals.css`, `public/images/`) are common and need careful merge skills.

### Approach C: Don't sync (most common, often correct)

Best when: the church's site is working fine and nothing's broken.

Most adopting churches will fall into this category. The template version they started from is "good enough," dependencies update through Dependabot, security patches come from npm-level updates, and the church doesn't need newer template features.

The case for syncing is real but narrow: a critical bug, a security fix, or a genuinely-wanted new feature. Outside those, leave well enough alone.

### Known fixes worth syncing into church instances

If your church instance was created before any of these template fixes landed, apply them manually (Approach A above):

- **Turbopack workspace-root error** (`next.config.mjs`): Next.js 16 Turbopack can error with "couldn't find the Next.js package from the project directory" if `turbopack.root` is not set explicitly. The template fix adds `turbopack: { root: __dirname }` (where `__dirname` is derived from `import.meta.url`) to `next.config.mjs`. Also run `npm install` if you suspect a corrupted `node_modules/next` installation — a missing `node_modules/next/package.json` is the underlying trigger.

### When to push a change back to the template

If you discover a generic improvement while maintaining a church instance — a bug fix that applies broadly, a doc clarification, an accessibility improvement — contribute it back to the template:

1. **Fork the template repo** (not your church instance): [github.com/kbennett2000/church-site-template](https://github.com/kbennett2000/church-site-template).
2. **Branch and make the change** in the template fork, *not* in your church instance. The diff should be church-agnostic.
3. **Open a PR** to the template (see [PR workflow](#pr-workflow) above).

You'll be working in two repos for a moment. That's the price of decoupled template + instance.

---

## What's next?

- [Architecture](./architecture.md) — orientation to the codebase.
- [Decision log](./decision-log.md) — why each piece of the stack was chosen.

## Stuck?

- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new).*
