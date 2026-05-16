---
type: explanation
audience: developer
time: 15 minutes
---

# Decision log

**Who this is for:** Developers wanting to understand why each piece of the stack was chosen, and what tradeoffs were considered. Also: successors inheriting a running site — the [successor runbook](../for-tech-volunteers/successor-runbook.md) refers them here for the "why" behind the current architecture.

**What you'll accomplish:** Have enough context to challenge an existing decision (or accept it) without having to re-litigate the original discussion.
**You'll need first:** Familiarity with the stack. See [architecture.md](./architecture.md).

> **Note for maintainers:** keep this doc current. The successor runbook depends on it being accurate — when a future tech volunteer reads "the answer is in decision-log.md," they need to actually find the answer. If you add a new external service or change a load-bearing technology choice, add or amend an ADR here.

Each entry below is an Architecture Decision Record (ADR) in lightweight form: context, decision, alternatives, consequences.

---

## ADR-001: Next.js (App Router) as the framework

**Status:** Accepted

**Context:**
We need a framework that supports static-site generation (free hosting), modern React patterns, and good DX. The target user is a small church with little to no developer time — long-term simplicity matters more than cutting-edge features.

**Decision:**
Use **Next.js 16 with the App Router**, defaulting every page to static export.

**Alternatives considered:**
- **Astro** — excellent for content-heavy sites; partial-hydration "islands" model. Rejected because the React ecosystem familiarity matters more than Astro's edge over a small page count. Fewer prebuilt UI primitives for shadcn-style design systems.
- **Remix** — server-first React framework. Rejected because it assumes a long-running server; static export is less of a first-class concern. Hosting is more involved.
- **Eleventy / Hugo / Jekyll** — pure static generators. Rejected because they trade away React entirely — limits component reuse and forces template languages we don't want to teach.
- **Gatsby** — first popular React static generator. Rejected because it's effectively in maintenance mode now and feels stagnant compared to Next.

**Consequences:**
- Pro: Big ecosystem; lots of tutorials, easy hiring/finding contributors.
- Pro: Vercel (the makers of Next.js) is the primary host — first-class integration.
- Pro: RSC + static export = zero JS by default, great for performance.
- Con: Tied somewhat to Vercel's release pace; major version upgrades require care.
- Con: App Router is newer than Pages Router; some libraries still assume Pages.

---

## ADR-002: Decap CMS (over Strapi, Sanity, Contentful, others)

**Status:** Superseded by ADR-010

**Context:**
We need a CMS that:
- Is free for small churches (no per-seat fees).
- Works for non-technical editors.
- Doesn't require a database or running server (operational burden).
- Doesn't lock content into a proprietary platform.

**Decision:**
Use **Decap CMS** (formerly Netlify CMS), git-based, with editorial workflow.

**Alternatives considered:**
- **Sanity** — beautiful editor, but free tier has user limits and hosted content is locked in their cloud. Vendor lock-in.
- **Contentful** — same vendor-lock concerns. Pricier than Sanity at scale.
- **Strapi** — self-hosted, requires running a database and server. Operational burden for a church.
- **TinaCMS** — git-based like Decap. Promising, but requires Tina Cloud for auth in production OR self-hosting a backend. Decap's OAuth proxy options are simpler.
- **Hand-edit Markdown via GitHub.com web UI** — viable but unfriendly. Editors won't tolerate looking at YAML frontmatter.
- **Forestry** — defunct (acquired by Tina).

**Consequences:**
- Pro: All content is plain files in the repo. Editors can see history, revert, etc. via GitHub.
- Pro: No database to backup, no server to keep up.
- Pro: Editorial workflow = automatic PR-based review.
- Con: Authentication setup requires either Netlify Identity (deprecating) or a self-hosted OAuth proxy. Adds tech-volunteer setup friction.
- Con: Decap's preview rendering can lag behind site rendering when content shapes change. Iterate carefully.
- Con: Active maintenance has been spotty since the Netlify → Decap rename. Worth monitoring.

---

## ADR-003: Tailwind CSS (over CSS Modules, styled-components, vanilla CSS)

**Status:** Accepted

**Context:**
We need a styling approach that is fast to write, easy to read in components, theme-able by editing a single file, and produces minimal CSS.

**Decision:**
Use **Tailwind CSS 3.4** with a **semantic-token system**: components reference `bg-primary`, `text-foreground`, etc. — never `bg-amber-600`.

**Alternatives considered:**
- **CSS Modules** — one stylesheet per component. Rejected because the file proliferation and lack of co-location with JSX hurts iteration speed.
- **styled-components / Emotion** — CSS-in-JS. Rejected because of runtime cost (parser in production), incompatibility with RSC, and Vercel's recommendation to avoid runtime CSS-in-JS.
- **Vanilla CSS** — one global stylesheet. Rejected because scaling is painful with no scoping.
- **UnoCSS / Panda CSS** — newer atomic-CSS competitors. Promising but smaller communities. Tailwind's familiarity wins.

**Consequences:**
- Pro: Theme tokens defined once in `globals.css` cascade everywhere.
- Pro: No runtime CSS-in-JS overhead.
- Pro: Atomic classes mean very small CSS bundles after purge.
- Pro: Massive community, lots of recipes.
- Con: HTML/JSX gets verbose with long class strings. Use `cn()` helper to manage.
- Con: Discipline required — banning `bg-amber-600` etc. takes review attention. See [styling-and-theming.md](./styling-and-theming.md).

---

## ADR-004: TypeScript strict mode

**Status:** Accepted

**Context:**
We want type safety to prevent runtime errors in code that volunteers maintain. We also want low friction for new contributors.

**Decision:**
Enable **TypeScript strict mode** (`"strict": true` in `tsconfig.json`). No `any` without a comment explaining why.

**Alternatives considered:**
- **No TypeScript / plain JS** — rejected because content-loader functions are exactly the place type safety pays off.
- **TypeScript without strict mode** — rejected because half-typed code is worse than no types: false sense of security.
- **JSDoc types in JS files** — middle ground. Rejected because the toolchain (`.tsx` files for React) makes full TS lower-friction.

**Consequences:**
- Pro: Refactor confidence — changing a content type breaks compile, not runtime.
- Pro: Editor autocomplete is excellent.
- Con: Slightly steeper learning curve for contributors not fluent in TS.
- Con: Some libraries have weak or missing types — occasional `as` casts.

---

## ADR-005: JSON + Markdown for content (over MDX)

**Status:** Accepted

**Context:**
Content is mostly:
- Structured data (sermons, events, staff) — best as JSON or YAML.
- Long-form prose (our story, beliefs) — best as Markdown.

We considered MDX (Markdown with JSX) for richer content authoring.

**Decision:**
Use **plain Markdown with frontmatter** (via `gray-matter`) for narrative content and **JSON** for highly structured content.

**Alternatives considered:**
- **MDX** — allows JSX inside Markdown (e.g., embedding a `<CalloutCard>` component in a sermon description). Powerful, but:
  - Requires editors to know JSX or expect it to render correctly.
  - Decap doesn't have first-class MDX support in its markdown widget.
  - Increases build complexity (MDX compiler integration).
- **YAML for everything** — rejected because YAML's indentation rules are unforgiving for non-technical editors.
- **JSON-only** — rejected because long-form prose in JSON strings is unreadable in diffs.

**Consequences:**
- Pro: Editors writing prose use the WYSIWYG editor; output is clean Markdown anyone can read.
- Pro: Frontmatter + body is exactly what `gray-matter` handles efficiently.
- Pro: Content files are diffable in PRs.
- Con: No inline JSX in editorial content. If a callout is needed, it's a fixed component referenced by an editor's signal field (e.g., `callout: true`).
- Con: Some Markdown features (footnotes, callouts) require a markdown renderer with the right plugins.

---

## ADR-006: `gray-matter` for frontmatter parsing

**Status:** Accepted

**Context:**
We need to parse Markdown files with YAML frontmatter at build time.

**Decision:**
Use **`gray-matter`** — small, battle-tested, widely used.

**Alternatives considered:**
- **`@parcel/markdown-extract`** — bundled feature, not a standalone library. Doesn't fit a build-time loader pattern.
- **Custom parser** — too much code for a solved problem.
- **`front-matter`** — alternative but less popular and feature-rich.

**Consequences:**
- Pro: One small dep that does one thing well.
- Pro: Returns `{ data, content }` — easy mental model.
- Con: gray-matter parses YAML strictly. Editors who write malformed YAML get cryptic errors. Mitigated by the Decap UI shielding editors from raw YAML.

---

## ADR-007: Editorial workflow (PR-based publishing, not auto-merge)

**Status:** Superseded by ADR-010

**Context:**
Editors are non-technical. They may publish typos or wrong dates by accident. We want a sanity-check step before live.

**Decision:**
Use Decap's **editorial workflow** mode: every editor change becomes a pull request that a tech volunteer manually reviews and merges.

**Alternatives considered:**
- **Auto-merge with notifications** — faster for editors, but no failure mode for typos.
- **Branch protection without editorial workflow** — Decap doesn't support this cleanly — editors would face Git mechanics directly.
- **CI-only checks (no human review)** — automated checks can catch broken Markdown but not "wrong service time".

**Consequences:**
- Pro: One person (the tech volunteer) sees everything that changes. Cheap insurance against mistakes.
- Pro: Full version history in PR comments and merge messages.
- Con: Latency — changes wait for the volunteer (typically same-day, sometimes longer).
- Con: Volunteer has a recurring task (approving PRs). See [for-tech-volunteers/09-maintenance.md](../for-tech-volunteers/09-maintenance.md).

---

## ADR-008: Vercel hosting (over Netlify, Cloudflare Pages)

**Status:** Accepted

**Context:**
Static-site hosts compatible with Next.js:
- **Vercel** — built by Next.js team.
- **Netlify** — built by Decap CMS team (originally Netlify CMS).
- **Cloudflare Pages** — generous free tier, great CDN.
- **Self-host on a VPS** — most control but most operational burden.

**Decision:**
Use **Vercel** as the default host.

**Alternatives considered:**
- **Netlify** — strong fit since Decap was originally Netlify CMS. Free tier is solid. The Netlify Identity feature (free OAuth proxy for Decap) was a big plus, but **Netlify Identity is being deprecated** — that key advantage is going away.
- **Cloudflare Pages** — slightly more limited Next.js feature support, especially around RSC and image optimization. Better as a "level up" choice for high traffic.
- **Self-host** — too much for a church without dedicated dev time.

**Consequences:**
- Pro: Best-in-class Next.js integration. New Next features work day one.
- Pro: Vercel's free tier ("Hobby") is enough for any small church.
- Pro: PR previews automatically deployed — tech volunteer can see exactly what an editor's PR looks like before merging.
- Con: Vercel is a venture-backed company; pricing/limits could change. Mitigation: the site is plain Next.js + static export, portable to any host.
- Con: Editors changing OAuth proxy choice (since Netlify Identity is dying) means tech volunteers have to set up their own — added friction in [grant-editor-access.md](../for-tech-volunteers/08-grant-editor-access.md).

---

## ADR-010: TinaCMS + TinaCloud (replacing Decap CMS)

**Status:** Accepted

**Context:**
ADR-002 chose Decap CMS based on its editorial workflow and zero-server model. Over time, two problems emerged:
- Netlify Identity (the simplest OAuth proxy for Decap) was deprecated, leaving tech volunteers to self-host an OAuth backend — a significant friction point for non-developers.
- The PR-based editorial workflow (ADR-007) added latency (changes waited for volunteer review) and created a recurring volunteer maintenance task. For small churches, the typo-prevention benefit rarely justified the delay.

Meanwhile, TinaCMS matured: TinaCloud provides managed auth (Google/email sign-in, no self-hosted proxy) and a clean schema-as-TypeScript model.

**Decision:**
Migrate from **Decap CMS** to **TinaCMS + TinaCloud**.

Key changes:
- Schema moved from `public/admin/config.yml` (YAML) to `tina/config.ts` (TypeScript, type-checked at build time).
- `public/admin/` is now generated at dev/build time and gitignored.
- Auth is handled by TinaCloud (Google or email — editors do not need GitHub accounts).
- Every Save in the editor commits directly to `main`; there is no PR or review step. Vercel rebuilds automatically.
- `npm run cms` = `tinacms dev -c "next dev"` (single command for local dev with CMS).
- `npm run build` = `tinacms build && next build` (requires TinaCloud credentials; use `npx next build` for local testing without credentials).

**Alternatives considered:**
- **Keep Decap with a different OAuth proxy (Netlify's deprecated proxy replaced by a self-hosted one)** — viable but adds operational burden for the tech volunteer. Rejected: the setup overhead of running an OAuth proxy is worse than TinaCloud's managed auth.
- **Sanity / Contentful** — vendor-locked cloud CMSes. Content no longer lives in the repo as plain files. Rejected: repo-based content is a core architectural value (portability, history, no per-seat fees).
- **No CMS (Markdown editing via GitHub.com web UI)** — works but hostile for non-technical editors. Rejected.

**Consequences:**
- Pro: Editors sign in with Google or email — no GitHub account required.
- Pro: No self-hosted OAuth proxy. TinaCloud handles auth at zero cost up to reasonable usage.
- Pro: Schema is TypeScript — type errors caught at build time rather than runtime.
- Pro: No volunteer review step — editors have direct publish. Mistakes are fixed by saving again (full history preserved in git).
- Con: TinaCloud is a third-party dependency. If TinaCloud changes pricing, churches can self-host Tina's backend or migrate CMS.
- Con: No built-in editorial review step. Churches that want a review step can configure GitHub branch protection rules as a separate layer.
- Con: `npm run build` requires `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`. Local Next.js testing uses `npx next build` instead.

---

## ADR-009: GitHub "template repository" (not fork) for church adoption

**Status:** Accepted

**Context:**
A small church adopts this codebase once. From that point on, they own a separate site that diverges immediately (real names, photos, content, design tweaks). The two repos are essentially unrelated after adoption — the only times the church might want to look upstream are:

- A security patch in the template they should pull in.
- A bug fix or feature they'd benefit from.
- Sending a fix back to the template that they discovered in their own work.

GitHub offers three mechanisms for "copy this repo and let the new owner customize it": **fork**, **template repository**, and **mirror**. Each has a different relationship between source and destination.

**Decision:**
Use **GitHub's "template repository" feature** as the primary onboarding path. Adopting churches click the green **Use this template** button, which creates a new independent repo with no Git history shared with the source. Forking remains documented as an alternative for the small subset of users who explicitly want upstream-tracking.

**Alternatives considered:**
- **Fork as the primary path** — gives downstream "Sync fork" support automatically. Rejected because:
  1. Forks carry the full upstream history into the church's repo — confusing when an editor later reads `git log` and sees commits from contributors they don't recognize.
  2. Forks display a "forked from..." badge on the church's repo page — visually subordinate to the template, which is the opposite of what the church should feel about their own site.
  3. The "Sync fork" button feels safer than it is: a sync can silently overwrite local customizations if the merge conflicts in subtle ways. Most adopting churches don't have the Git literacy to recover from that.
  4. Forks can't be made private if the source is public, locking churches into a public repo even when they'd prefer privacy.
- **Mirror with periodic re-base** — too operationally complex for non-developer churches.
- **Documented "manually copy the files"** — works, but no canonical workflow, no GitHub-supplied tooling, and no "I just adopted this" signal in the GitHub UI for users.
- **Distribute as a CLI generator (e.g. `npx create-church-site`)** — would work, but requires the church's tech volunteer to learn another tool. The "Use this template" button is a single click on a familiar GitHub page.

**Consequences:**
- Pro: Each church instance is a clean, independent repo. Their `git log` shows only their work. The repo page says "Your church website," not "Forked from kbennett2000/...".
- Pro: Adoption is a single click. No CLI tooling, no setup wizard before they even have code in their account.
- Pro: Churches can make their repo private without affecting the template.
- Pro: Pull requests against the template come from intentional contributors (people who specifically forked to contribute), not accidental ones (church-instance owners who didn't realize their commits would propose changes upstream).
- Con: No automatic "Sync fork" button. Churches that want template updates have to cherry-pick manually or use a tool like `git-template-sync`. Documented in [contributing.md](./contributing.md#keeping-a-church-instance-in-sync-with-the-template).
- Con: The release/changelog discipline of the template now matters: church instances will check it periodically to decide what to pull in. Lazy changelogs hurt adopters.
- Con: An adopting church can't easily contribute a fix back to the template — they have to fork the template separately. This is a deliberate friction: most church-instance changes are church-specific and shouldn't flow back. The fix workflow for genuinely-generic improvements is documented but slightly indirect.

---

## ADR-011: Resend for transactional email

**Status:** Accepted

**Context:**
The site needs to send transactional emails — contact-form notifications, prayer-request forwards, devotional emails (one per subscriber per day), and weekly digests. Requirements: a generous free tier, a clean Node.js SDK, deliverability help (DKIM/SPF/DMARC guidance), and reasonable per-email pricing if a church outgrows the free tier.

**Decision:**
Use **Resend** as the email provider.

**Alternatives considered:**
- **SendGrid (Twilio)** — robust but the free tier is more restrictive (100/day for the first 30 days only), the dashboard is dated, and Twilio's pricing has crept up.
- **AWS SES** — extremely cheap at scale, but requires AWS account setup, IAM configuration, and SES sandbox-to-production approval. Operational burden for a non-developer church is too high.
- **Postmark** — excellent deliverability, very clean product, but free tier is only 100 emails total (not per month) — far too small for a church mailing list.
- **Mailgun** — viable but the free tier has shrunk over time and the dashboard is unfriendly to non-engineers.

**Consequences:**
- Pro: 3000 emails/month free at the time of this decision — fine for a small church's devotional and digest combined.
- Pro: First-party React-email rendering integration — email templates live as JSX in `emails/`.
- Pro: Dashboard is the simplest of the alternatives; non-engineers can verify deliveries themselves.
- Pro: Webhooks for bounce / complaint handling are clean to wire up.
- Con: Resend is a younger company; pricing or limits could change. Mitigation: the email-send abstraction in `lib/resend.ts` is small enough to swap providers in a day.
- Con: Sandbox mode (`onboarding@resend.dev`) only delivers to the verified account owner. Documented as a gotcha in the runbooks and in `email-deliverability.md` because it bites people who don't realize they're still in sandbox.

---

## ADR-012: Postgres for subscriber data (over no database, SQLite, MongoDB)

**Status:** Accepted

**Context:**
The devotional and digest email features need durable, structured storage for: who is subscribed, what tags they have, what reading plans they're on, when they last received an email, and a send-log for idempotency. This data has to survive every site redeploy.

**Decision:**
Use a **Postgres database** for subscriber data.

**Alternatives considered:**
- **No database (store subscribers in a JSON file in the repo)** — would work for tiny lists but breaks at scale, can't handle concurrent writes from form submissions, leaks subscriber emails into git history publicly. Rejected.
- **SQLite** — file-based, simple. Rejected because Vercel's serverless functions don't have persistent local filesystem — every cold start would start fresh.
- **MongoDB / DynamoDB** — viable but the subscriber model is genuinely relational (subscribers ↔ plans ↔ send-log), and SQL is the right shape. The team will have an easier time querying Postgres than learning a document-DB query language.
- **A managed third-party "subscriber list" service like Mailchimp or Buttondown** — would offload the database problem entirely. Rejected because (a) per-subscriber pricing adds up, (b) we lose control of the schema and can't add per-church custom fields, (c) we'd still need a database for the send-log / idempotency.

**Consequences:**
- Pro: Mature ecosystem; Drizzle ORM gives type-safe queries from TypeScript.
- Pro: Migration tooling (`drizzle-kit migrate`) keeps schema changes reviewable in git.
- Pro: Subscribers are portable — a CSV export works from day one.
- Con: One more service to maintain. Mitigation: managed Postgres providers (Neon, Vercel Postgres) are very low operational burden.

---

## ADR-013: Neon (via Vercel Postgres) for managed Postgres

**Status:** Accepted

**Context:**
ADR-012 chose Postgres. Now: where to host it.

**Decision:**
Use **Neon** as the Postgres provider — either directly, or via **Vercel Postgres** (which is Neon under the hood with Vercel-flavored UX).

**Alternatives considered:**
- **Supabase** — solid alternative; the free tier is comparable. Rejected because the project's `@vercel/postgres` integration assumes Vercel-flavored connection strings, which Vercel Postgres provides automatically. Switching providers means changing connection-string handling; the abstraction is small but not zero.
- **AWS RDS** — mature but expensive, and requires AWS account familiarity. Operational burden too high for a non-developer church.
- **Self-hosted Postgres on a VPS** — most control, highest operational burden. Rejected for the same reason as ADR-008 (Vercel hosting).
- **PlanetScale** — was a serious contender at one point but PlanetScale uses MySQL, and dropped its free tier.

**Consequences:**
- Pro: Generous free tier — well within a small church's usage envelope.
- Pro: Vercel-native integration: adding a Postgres database from the Vercel Storage tab automatically sets `POSTGRES_URL` as an env var.
- Pro: Neon's branching model supports point-in-time recovery on the free tier — see [database-migrations.md](./database-migrations.md) for the recovery procedure.
- Con: Neon's free tier auto-suspends inactive databases. First request after a quiet period takes a few seconds to wake up. Imperceptible in practice but worth knowing about.
- Con: Tied to a specific provider; if Neon's terms change, churches would migrate. The `lib/db/index.ts` connection layer is small enough that swapping providers is feasible.

---

## ADR-014: Auth.js v5 (NextAuth) for admin Google sign-in

**Status:** Accepted

**Context:**
The custom admin pages (`/admin/digest`, `/admin/devotionals`, and the `/api/admin/*` routes) need authentication. Two modes are supported: a single shared password (Basic Auth) and per-person Google sign-in. The shared-password path is trivial and needs no library. The per-person Google path needs an auth library.

**Decision:**
Use **Auth.js v5** (formerly NextAuth) with the Google OAuth provider. JWT session strategy (no database session table). Allowlist sourced from `content/admin-access.json` (CMS-editable) plus `ADMIN_ALLOWLIST` env var (bootstrap-only).

**Alternatives considered:**
- **Clerk** — beautiful product, but the free tier has per-user-month limits and the per-seat economics aren't great for a small church with a handful of admins.
- **Auth0** — similar story to Clerk — designed for SaaS apps with paying users, overkill for a handful of church admins.
- **Lucia Auth** — lower-level, requires more wiring. Doesn't pay off for a single Google provider; Auth.js handles the OAuth dance with much less code.
- **Roll-your-own OAuth** — every detail (state, PKCE, callback handling) is a place to get security wrong. Rejected.
- **Skip Google entirely; use Basic Auth only** — fine for very small churches with one or two admins. Documented as an option ([admin-access-basic-auth.md](../for-tech-volunteers/admin-access-basic-auth.md)) but doesn't survive a successor transition well — see Part 6 of the successor runbook.

**Consequences:**
- Pro: Auth.js v5 has clean Next.js App Router integration; the `middleware.ts` integration is small.
- Pro: JWT strategy means no database query on every protected request — middleware runs in the Edge runtime.
- Pro: Standard Google OAuth flow — admins use accounts they already have.
- Con: JWT strategy has the "stale claim" gotcha: when an admin's allowlist status changes, their JWT keeps the old claim until expiry or sign-out. Documented as gotcha #1 in the successor runbook. Tracked as a follow-up in [admin-access-followups.md](./admin-access-followups.md).
- Con: Adds the Google Cloud Console as another service in the inventory. Documented in the successor runbook.

---

## How to propose a new decision

If you want to challenge an existing ADR or add a new one:

1. **Open an issue** describing the context and your proposed decision.
2. **Discuss** with maintainers and other contributors.
3. **If accepted**, append a new ADR to this file (or amend an existing one with a "Superseded by ADR-XXX" note).

Status values used here: `Accepted`, `Superseded by ADR-XXX`, `Deprecated`, `Proposed`.

---

## What's next?

- [Architecture](./architecture.md) — how these decisions are realized in code.
- [Contributing](./contributing.md) — how to propose changes.

## Stuck?

- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Decision%20Log).*
