# Frequently asked questions

Questions a church leader, tech volunteer, or staff member is most likely to ask about adopting and running this template.

If you don't see your question here, check the [Glossary](GLOSSARY.md) or the audience-specific [troubleshooting docs](docs/README.md).

---

## Before you adopt the template

### How much does this cost?

The template itself is **free** (MIT license — keep it forever, no royalties).

What you'll actually pay for:

| Item | Cost | Required? |
|---|---|---|
| The template code | $0 | — |
| GitHub account (unlimited private repos) | $0 | Yes |
| Vercel hosting (free "Hobby" tier) | $0 | Yes |
| TinaCMS + TinaCloud (the editor) | $0 | Yes |
| A custom domain (`yourchurch.org`) | ~$10–$15/year | No (optional — you can launch on a free `*.vercel.app` URL) |
| Vercel Pro tier (analytics, larger teams) | ~$20/month per editor | No |

A typical small church spends **$12 a year** total (a domain) and nothing else.

### Can we use this if we're not technically inclined?

Yes, but with one important caveat: **someone at your church needs to spend about 30 minutes doing the initial setup**. That person doesn't need to be a developer, but they need to be comfortable following technical instructions (clicking buttons in GitHub, running a few commands in a terminal, copying URLs between sites). If you've ever set up a Squarespace site, you have plenty of skill.

Once setup is done, the people editing the site day-to-day **never touch code or the terminal**. They use a browser-based editor that looks like Squarespace or WordPress.

If your church genuinely has no one in that "comfortable following technical instructions" category, ask around. The college kid who built a Discord server. The board member who builds spreadsheets. The retired engineer in the back pew. Most churches have someone.

See [the tech-volunteer overview](docs/for-tech-volunteers/01-overview.md) for what the 30-minute setup actually looks like.

### Is this only for evangelical churches?

**No.** The template is generic. The default seed content is written in a style that aligns with mainstream evangelical/non-denominational Christianity because that's the tradition the original prototype came from, but every piece of it is meant to be replaced.

Specifically:
- The **beliefs page** has 8 example doctrinal statements with a prominent note instructing you to replace them with your church's actual statement of faith. If you're Catholic, Anglican, Methodist, Presbyterian, Reformed, Orthodox, or anything else, drop in your own statements.
- The **ministry names** (Kids, Youth, Young Adults, Women, Men, Recovery, Missions) are common across many traditions but easy to rename, remove, or replace.
- The **page structure** (Visit, Watch, About, Connect, Calendar, Give) maps to almost any congregational church.
- The **tone** of the prose (welcoming, plain-spoken, low-jargon) is intentional but neutral enough to fit most traditions.

Liturgical or sacramental churches may want to add pages the template doesn't ship with (Mass times, sacraments page, prayer to saints, etc.) — a developer can do that in a day. Same goes for non-Christian faith communities adapting it; the architecture is generic.

### What if our church has different ministries than the template shows?

The template ships with seven example ministries (Kids, Youth, Young Adults, Women, Men, Recovery, Missions). You can:

- **Rename one** — change `content/ministries/missions.md` to `content/ministries/spanish-service.md`, update the title, done.
- **Delete one** — just delete the markdown file. The page disappears from the site.
- **Add one** — create a new markdown file with the same structure. The CMS supports this through the browser ("New Ministry").
- **Reorder** — edit the `SLUG_ORDER` array in `content/ministries.ts`.

There's no hard cap. Some churches will use 3 ministries; others 12. The homepage grid and navigation menu adapt.

Detailed instructions in [the editor guide](docs/for-editors/01-getting-started.md) and the [seed data checklist](SEED_DATA.md).

### What if we want to switch back to our old site?

You can. Two ways:

- **Soft revert** — point your domain's DNS back at your old host. The new site keeps existing at `*.vercel.app` but isn't your "main" anymore. Reversible at any time.
- **Hard revert** — delete the Vercel project. Your old site is unaffected; the new template repo on GitHub still exists if you want to come back later.

Because the template doesn't replace any of your existing infrastructure (it's a new, separate website), you can run both in parallel during a transition period — link from your old site to the new one until you're confident in the new one, then cut over.

### How do we get help?

Tiered, by complexity:

- **First**: search the [docs](docs/README.md). They cover the common cases.
- **Editor questions** ("how do I add a sermon"): the [editor guides](docs/for-editors/) and [editor troubleshooting](docs/for-editors/troubleshooting.md).
- **Setup or deploy issues**: the [tech-volunteer guides](docs/for-tech-volunteers/) and [tech-volunteer troubleshooting](docs/for-tech-volunteers/troubleshooting.md).
- **Bugs or features**: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues/new).
- **A developer at your church**: they can read the [architecture doc](docs/for-developers/architecture.md) and dive in.
- **You want to hire help**: any freelance Next.js or React developer can work in this codebase. Expect $50–$150/hour and a 1–4 hour engagement for typical customizations.

This template is maintained as open-source — there's no support contract or SLA. For a free template, the docs are unusually thorough; for paid support, you'd hire a developer.

### What happens if you stop maintaining this template?

Your church's site **keeps working**. Here's why:

- **Your repo is independent.** When you used "Use this template," GitHub gave you a clean copy with no link back to ours. If we abandoned the upstream tomorrow, your repo wouldn't change.
- **The dependencies are mainstream.** Next.js, React, Tailwind, TinaCMS — all actively maintained projects. They'll outlive us.
- **The architecture is portable.** Content is plain Markdown and JSON. If the template approach fundamentally broke down, a developer could migrate your content to any other system in a few hours.

The realistic worst case: in 3–5 years, dependencies have major version updates that need attention. A developer (yours, or one you hire briefly) handles the upgrade. Your content survives.

We aim to keep the template alive and well, but the goal is that your church's site doesn't *depend* on us.

### How do we keep the site secure?

A few good practices, none unusual:

- **Keep dependencies updated.** Run `npm audit` periodically; merge GitHub's Dependabot PRs when they appear. The [maintenance guide](docs/for-tech-volunteers/09-maintenance.md) walks through this.
- **Use strong passwords and 2FA on GitHub.** This is the only place a developer-level attacker would target — there's no admin login on the church site itself; editors authenticate through TinaCloud (using a Google account or email address — no GitHub account required).
- **Limit who has editor access.** The tech volunteer invites editors through TinaCloud. Add people thoughtfully; remove them when they leave the church.
- **Don't commit secrets.** No API keys, no passwords, no private data in the repo. The `.gitignore` already excludes `.env.local` and similar.
- **Vercel and GitHub handle the rest.** TLS certificates, DDoS protection, server patching — all automatic.

The template has no database, no user-facing login — which removes the most common attack surfaces. Form submissions (visit, prayer, contact, newsletter, serve) are sent via Resend to the church's email inbox and are not stored server-side.

---

## After you adopt the template

### How do I add a sermon?

In the CMS: click **Sermons** → **New Sermon**, fill in the form, click **Publish**. Full walkthrough: [Add a sermon](docs/for-editors/02-add-a-sermon.md).

### Can I add a new ministry myself, or do I need a developer?

You can add one in the CMS. Click **Ministries** → **New Ministry** and fill in the form. The new ministry gets its own page automatically. You can also reorder, edit, or delete ministries the same way. (Reordering currently requires a tech-volunteer's help — see [the ministries note](SEED_DATA.md#4-ministries--7-slots-all-generic).)

### What happens when I click "Save"?

Your edit goes live automatically — TinaCMS saves it as a commit directly to the main branch. Vercel picks it up and the change appears on the site within about 2 minutes. There is no review step.

Detailed flow: [Publishing changes](docs/for-editors/08-publishing-changes.md).

### How fast does my change appear on the live site?

About 2 minutes from clicking **Save**. Vercel rebuilds the site automatically whenever TinaCMS commits a change. If your change still isn't showing after 3 minutes, press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) to force a fresh load.

### Who can edit the site?

Anyone the tech volunteer has invited to the GitHub repository as a collaborator. To add an editor, see [Grant editor access](docs/for-tech-volunteers/08-grant-editor-access.md).

There's no built-in role system — every collaborator can edit everything. For most small churches that's fine. If you need finer-grained roles, talk to a developer about extending the workflow.

### Can I undo a change?

Yes. Two ways:

- **If you haven't published yet:** just edit again. Drafts don't show on the public site.
- **If you've already published:** open the same entry in the CMS, edit it back, and publish again. Every change has a full history (in GitHub) that a developer can roll back to if needed.

### What if I break something?

Take a breath — mistakes are easy to fix:

- Editor mistakes: just edit and save again. Changes go live in 2 minutes, and fixes do too.
- Bigger mistakes: every change has a complete history. A developer can roll back to any prior version with one command.

In practice, the worst-case scenario is "the change goes live with a typo and we fix it 10 minutes later."

### How do I add a new staff member?

In the CMS: **Staff** → **New Staff Member** → fill in name, role, email, photo, display order, and bio → publish. [Walkthrough](docs/for-editors/04-add-a-staff-member.md).

### Can we change the colors? The fonts?

**Colors:** yes. The first-time setup includes 4 palette options. After that, your tech volunteer can edit the HSL values in `app/globals.css` to match your brand exactly. See [Customize branding](docs/for-tech-volunteers/05-customize-branding.md).

**Fonts:** yes, but it requires a developer. Fonts are loaded in `app/layout.tsx` via Google Fonts.

### Is the site mobile-friendly?

Yes, designed mobile-first. ~70% of visitors to typical church sites are on phones, so this template is built to look great on a small screen first, then adapts up for desktops.

### Do we need to back the site up?

GitHub IS the backup. Every change to your site is stored as a permanent snapshot on GitHub's servers. You can roll back to any prior state. Even if Vercel disappeared overnight, your site would still exist on GitHub and could be redeployed elsewhere in an hour.

If you want a paranoid-level backup, a developer can run `git clone` to download a full copy.

### Can people contact us through the site? What about email?

Yes — the **Contact**, **Visit**, **Prayer**, and **Serve** pages all have forms that send email directly to the church's inbox via Resend. A tech volunteer sets three environment variables in Vercel (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CHURCH_EMAIL`) and form submissions start arriving immediately. See [the deploy guide](docs/for-tech-volunteers/06-deploy-to-vercel.md) for setup steps.

### How do I add a newsletter signup?

The homepage already has a newsletter signup section, and it's wired to Resend — submissions send an email notification to the church inbox. To additionally add the subscriber to a mailing list platform like Mailchimp or Brevo, a developer can extend the newsletter API route (`app/api/submit/newsletter/route.ts`).

### What if our church changes its name? Service time? Address?

Editors update these in the **Site Settings** collection in the CMS. The new value appears everywhere on the site (homepage, footer, plan-a-visit page, etc.) without anyone touching code.

### Can multiple people edit at the same time?

Yes. Conflicts are rare for small churches because people usually edit different things. If two editors save changes to the same entry at the same time, the second save wins — coordinate with other editors for frequently-updated entries like Site Settings.

### The prayer request wall shows real requests — that's a privacy issue, right?

Yes — and it's an important one. The template ships with example anonymized requests. In production, you have three options:

1. **Don't show the wall.** A developer can hide the section with a feature flag.
2. **Show only requests where the submitter explicitly opted into public sharing.** Add this to the form and filter.
3. **Curate manually.** Pastor team picks which requests to share, manually edits the wall content.

This is one of the most important decisions to make before launching. Talk to your pastoral team.

### What if Vercel or GitHub goes away one day?

Your site is portable. GitHub stores your source code; Vercel runs the site. If either service shut down:

- Your **content** is safe — Markdown and JSON files in your GitHub repository, easy to move anywhere.
- Your **hosting** can move — Netlify, Cloudflare Pages, or any Next.js host could pick this up with minor configuration changes.

The architecture deliberately avoids lock-in: no proprietary database, no service-specific APIs. A developer could migrate your whole site in a couple of hours.

---

## Still didn't find your question?

- **Editors:** [editor troubleshooting](docs/for-editors/troubleshooting.md)
- **Tech volunteers:** [setup troubleshooting](docs/for-tech-volunteers/troubleshooting.md)
- **Developers:** open a [GitHub issue](https://github.com/kbennett2000/church-site-template/issues)

---

*Question we should add? [Suggest it via a GitHub issue](https://github.com/kbennett2000/church-site-template/issues/new).*
