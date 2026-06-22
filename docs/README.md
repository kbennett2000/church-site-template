---
type: reference
audience: all
---

# Documentation map

Pick the track that matches what you're trying to do. The three tracks never assume knowledge from each other — start anywhere.

## 📝 For editors

You update content (sermons, staff bios, events) using the CMS in your browser. You never touch code.

- [01 Getting started](for-editors/01-getting-started.md) — log in and take a tour
- [02 Add a sermon](for-editors/02-add-a-sermon.md) — the most common task
- [03 Edit a page](for-editors/03-edit-a-page.md) — change "Our Story" and similar
- [04 Add a staff member](for-editors/04-add-a-staff-member.md) — with photo
- [05 Update service times](for-editors/05-update-service-times.md) — when the schedule shifts
- [06 Add an event](for-editors/06-add-an-event.md) — recurring or one-off
- [07 Upload photos](for-editors/07-upload-photos.md) — what makes a good photo
- [08 Publishing changes](for-editors/08-publishing-changes.md) — what "publish" actually does
- [Troubleshooting](for-editors/troubleshooting.md) — "I clicked publish but…"
- [Editor glossary](for-editors/glossary.md) — plain-English terms

## 🤝 For successors (inheriting a running site)

You weren't the one who set this up, but you're the one maintaining it now. Start here.

- [Successor runbook](for-tech-volunteers/successor-runbook.md) — service inventory, access handoff, first 60 minutes, ongoing rhythm

## 🛠️ For tech volunteers

You're the one semi-technical person at the church. You handle initial setup and deployment, then hand off to editors. (If you're *inheriting* the site instead of setting it up, the **Successors** track above is what you want.)

- [01 Overview](for-tech-volunteers/01-overview.md) — the 30-minute adoption journey, in plain English
- [02 Prerequisites](for-tech-volunteers/02-prerequisites.md) — what to install (or skip with Codespaces)
- [03 Use this template](for-tech-volunteers/03-use-this-template.md) — make your church's own copy of the template
- [04 First-time setup](for-tech-volunteers/04-first-time-setup.md) — run `npm run setup`
- [04a Customize with the setup script](for-tech-volunteers/04a-customize-with-setup-script.md) — what each prompt means
- [05 Customize branding](for-tech-volunteers/05-customize-branding.md) — logo, photos, colors, fonts
- [06 Deploy to Vercel](for-tech-volunteers/06-deploy-to-vercel.md) — every click, with screenshots
- [06a Set up TinaCloud](for-tech-volunteers/06a-setup-tinacloud.md) — connect the CMS so `/admin/` works
- [07 Connect your domain](for-tech-volunteers/07-connect-domain.md) — yourchurch.com
- [08 Grant editor access](for-tech-volunteers/08-grant-editor-access.md) — invite the secretary
- [09 Maintenance](for-tech-volunteers/09-maintenance.md) — monthly + quarterly tasks
- [10 Customize deeper](for-tech-volunteers/10-customize-deeper.md) — add a ministry, add a page, rearrange nav
- [Troubleshooting](for-tech-volunteers/troubleshooting.md) — when setup or deploy breaks

### Operational runbooks

For when something has broken in production, or when you're inheriting the site cold. Start with the symptom that matches.

- [Successor runbook](for-tech-volunteers/successor-runbook.md) — you didn't build this site; now what?
- [Runbook — site is down](for-tech-volunteers/runbook-site-down.md) — blank page, 404, 500, domain not resolving
- [Runbook — emails stopped sending](for-tech-volunteers/runbook-emails-stopped.md) — subscribers not receiving, Resend dashboard quiet
- [Runbook — rotate a leaked secret](for-tech-volunteers/runbook-rotate-secret.md) — committed `.env.local`, leaked API key, departed volunteer

## 💻 For developers

You're customizing the template, maintaining a church's adopted instance, or contributing back.

- [Architecture](for-developers/architecture.md) — project layout, template-vs-instance, and why
- [Content model](for-developers/content-model.md) — how `/content/` flows to pages
- [Adding a page](for-developers/adding-a-page.md) — new route, walkthrough
- [Adding a CMS collection](for-developers/adding-a-cms-collection.md) — new editable type
- [Styling and theming](for-developers/styling-and-theming.md) — tokens, palette, type
- [Contributing](for-developers/contributing.md) — PR workflow; also: syncing template updates into a church instance
- [Decision log](for-developers/decision-log.md) — why Next.js, TinaCMS, Tailwind, the "Use this template" model, etc.

## 📚 Case studies

Real churches using this template — read these before adopting, and submit your own after launch.

- [Case studies overview](case-studies/README.md) — submission instructions and the featured list
- [Majestic View Church](case-studies/majestic-view-church.md) — the inaugural case study (and the prototype this template grew out of)
- [Submission template](case-studies/_TEMPLATE.md) — copy this when writing your own

## 📣 Marketing

For tech volunteers pitching the template internally to pastors, elders, or church boards.

- [One-pager](marketing/one-pager.md) — print or export to PDF for the next board meeting
- [Elevator pitches](marketing/elevator-pitch.md) — 15-, 30-, and 60-second versions for different audiences
- [Feature comparison](marketing/feature-comparison.md) — honest comparison against Wix, Squarespace, WordPress, and DIY

## 🎬 Examples

Alternate `/content/` configurations showing what real adopters look like.

- [Examples overview](../examples/) — how to use them
- [Small rural church](../examples/small-rural-church/) — minimal ministries, simple programming
- [Suburban family church](../examples/suburban-family-church/) — programmed, family-tiered ministries

## Across all tracks

- [FAQ](../FAQ.md) — questions any of the three audiences ask
- [Glossary](../GLOSSARY.md) — every technical term, defined plainly
- [Seed data checklist](../SEED_DATA.md) — placeholder data that needs replacing before launch
- [Changelog](../CHANGELOG.md) — what's changed in each template release
- [Screenshot gallery](screenshots/README.md) — a visual tour of every page and the browser-based editor
- [Screenshots needed](SCREENSHOTS_NEEDED.md) — every screenshot referenced in docs, ready for a single capture pass

## How docs are structured

Each guide is tagged with one of four types ([Diátaxis framework](https://diataxis.fr/)):

| Type | When to read it |
| --- | --- |
| **Tutorial** | Learning-oriented. "I'm new and want to understand by doing." |
| **How-to** | Task-oriented. "I have a specific job, show me steps." |
| **Reference** | Information-oriented. "I need to look up exact details." |
| **Explanation** | Understanding-oriented. "I want to know why." |
| **Case study** | Real-world example. "Show me how someone else solved this." |

Look at the frontmatter at the top of any doc to see its type.

---

*Was this map missing something? [Open an issue](https://github.com/kbennett2000/church-site-template/issues/new).*
