# Changelog

All notable changes to this project are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project
adheres loosely to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Remove the legacy-object branch in `normalizeSocial()` in
  [lib/social.ts](lib/social.ts) once all known instances have migrated their
  `content/site.json` `church.social` to the list shape (marked with a
  `TODO(next-release)` comment).

## [0.1.0] - 2026-06-22

The first public release — a complete, production-ready church website that a
non-technical volunteer can deploy for free and a staff member can keep updated
from their browser. 🌐 [Live demo](https://church-site-template-psi.vercel.app)

### Added

- **Mobile-first website** on Next.js 16 (App Router, React 19), Tailwind CSS,
  and TypeScript strict mode — with a semantic-token theme system, four ready
  color palettes, and Inter + Fraunces typography.
- **Browser-based editing** via TinaCMS + TinaCloud — staff sign in with Google
  and edit content; changes commit to `main` and the site rebuilds in ~2 min.
- **Homepage** — hero, "this week" events, latest sermon, ministries grid,
  announcements, a beliefs teaser, and a newsletter signup.
- **Sermon archive** filterable by series, speaker, scripture, and book of the
  Bible, with YouTube embeds, derived series pages, and inline sermon notes.
- **Events calendar** — recurring and one-off events with `.ics` export.
- **Ministries** (a page per ministry), **staff & elders**, **beliefs**,
  **about/story**, and CMS-managed **custom pages** at `/pages/[slug]`.
- **Connect** — small-groups finder, prayer-request form, volunteer/serve
  roles, and a contact form; plus **plan-a-visit** and **giving** pages.
- **Email** — five Resend-wired forms (visit, prayer, contact, newsletter,
  serve), plus daily-devotional and weekly-digest pipelines backed by a
  double-opt-in subscriber database.
- **Extensible social links** — `content/site.json` `church.social` is a list
  of `{ platform, url, label? }` entries with curated brand icons and an
  "Other / Website" option; blank entries are hidden. See
  [lib/social.ts](lib/social.ts).
- **Tooling & docs** — `setup`, `doctor`, and `deploy` CLI scripts; a
  three-track documentation set (editors, tech volunteers, developers); two
  example church configurations; and a case-study template.

### Known limitations

- `/connect` groups/serve/prayer data and the about-page prose are still partly
  inline; migrating them to `/content/` collections is on the v0.2 roadmap.
- No automated test suite yet (Vitest + Playwright planned for v0.2).

[Unreleased]: https://github.com/kbennett2000/church-site-template/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/kbennett2000/church-site-template/releases/tag/v0.1.0
