# Changelog

All notable changes to the Church Site Template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Each release tag here corresponds to a Git tag on the template repository. Adopting churches can compare their starting tag against the latest to see what changed; see [`docs/for-developers/contributing.md` → Keeping a church instance in sync](docs/for-developers/contributing.md#keeping-a-church-instance-in-sync-with-the-template) for the sync approaches.

## [Unreleased]

### Added
- *Place entries here as you develop. Move them under a versioned heading on release.*

## [0.1.0] — 2026-05-14

### Added — Initial template release.

The first public version of the Church Site Template — a Next.js + Decap CMS starter for small churches.

#### Site features
- Mobile-first homepage with hero, "new here" cards, latest sermon, this-week calendar, newsletter signup, beliefs teaser.
- Plan-a-visit page with what-to-expect timeline, kids section, embedded map, and first-time-visitor form.
- Watch page with sermon archive — filter by series, speaker, scripture, book of the Bible.
- About page with our-story prose, beliefs grid, staff directory, elder team.
- Ministries — 7 example ministry pages (Kids, Youth, Young Adults, Women, Men, Recovery, Missions) with dynamic routing.
- Connect section — small groups finder, prayer requests, serve roles, contact form.
- Calendar — recurring weekly/monthly events with `.ics` export.
- Give page — multiple methods (online, text-to-give, mail, in-person), FAQ.
- Beliefs page — doctrinal statements with prominent "replace with your church's actual" guidance.

#### Editor (Decap CMS)
- Browser-based editor at `/admin/`.
- Collections: Sermons, Ministries, Staff, Elders, Site Settings, What We Believe, Recurring Events, Announcements, Pages.
- Editorial workflow — every edit becomes a pull request before going live.
- Local development mode (`npm run cms`) — no GitHub auth needed locally.

#### Adoption tooling
- "Use this template" support on GitHub for one-click adoption.
- `npm run setup` — interactive setup wizard for church name, address, contact info, primary service time, and color palette.
- `npm run start` / `npm run cms` / `npm run deploy` / `npm run doctor` wrapper scripts.
- Welcome script (`scripts/welcome.js`) that runs once after first `npm install` to orient new adopters.
- 16 SVG placeholders for hero, plan-a-visit, ministries, staff avatars, and logo — designed to be obviously fake so adopters know what to replace.
- Generic seed content (Grace Community Church) with `[Replace with…]` markers throughout.

#### Documentation
- Three-track docs (editors, tech volunteers, developers) following the Diátaxis framework.
- 30-minute adoption journey for tech volunteers, including a separate companion guide for the setup script prompts.
- Architecture doc with "Template vs. Instance" section covering the GitHub-template-not-fork model.
- Decision log with 9 architecture decision records.
- Contributing guide covering both PR workflow and syncing template updates into church instances.
- FAQ for adopting churches, restructured into "before adoption" and "after adoption" sections.
- Inaugural case study (Majestic View Church — the prototype this template grew out of) plus a submission template for adopters to add their own case studies.
- `SEED_DATA.md` checklist of every placeholder in the template.

#### Examples
- `/examples/small-rural-church/` — minimal-ministries content config showing template adoption for a community-focused rural church.
- `/examples/suburban-family-church/` — programmed-ministries content config showing template adoption for a larger suburban church with family-tiered programming.

#### Project meta
- MIT license.
- Code of conduct.
- Security policy.
- Issue templates for adopting churches needing help, template improvements, and template bugs.
- `FUNDING.yml` template (commented out — adopters and the template repo can enable independently).
- GitHub Codespaces config for zero-install adoption.

### Known limitations
- Forms (contact, prayer, newsletter, visit) are UI-only by default — they log to the browser console and need a developer to wire up to Resend / Formspree / Mailchimp / similar.
- Production GitHub OAuth flow for Decap CMS requires the adopter to set up an OAuth app or proxy; documented but not automated.
- No automated test suite yet (Vitest + Playwright planned).
- Some `/lib/` static data (small groups, prayer wall, serve roles) is not yet in the CMS — it's editable as TypeScript arrays.

[Unreleased]: https://github.com/kbennett2000/church-site-template/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/kbennett2000/church-site-template/releases/tag/v0.1.0
