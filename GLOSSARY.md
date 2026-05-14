# Glossary

Plain-English definitions of the terms you'll see across this project's docs. Each definition assumes zero technical background. Where a term has a more precise developer meaning, the editor-friendly meaning is given first, followed by a "Technically…" note.

---

### Branch

A copy of your site's files where you can make changes without affecting the live site. When you save in the CMS, the change is committed to the main branch and goes live automatically after a short rebuild.

> **Technically:** A named pointer to a sequence of commits in Git.

### Build

The process of turning your site's source files into the final HTML, CSS, and JavaScript that's served to visitors. Vercel does this automatically every time you publish.

### CMS

Short for **Content Management System** — the editor you use in your browser at `/admin/`. Lets you update sermons, staff, etc. without editing files directly. This project uses **TinaCMS** specifically.

### Codespace / Codespaces

A development environment that runs entirely in your web browser, provided by GitHub. Lets you set up and edit a website without installing anything on your computer. GitHub gives every account 60 free hours per month.

### Collaborator

A person you've invited to your GitHub repository. Collaborators can edit content through the CMS. To make someone a collaborator, see [Grant editor access](docs/for-tech-volunteers/08-grant-editor-access.md).

### Collection

A category of content in the CMS. "Sermons" is a collection. "Staff" is a collection. Each collection is configured in `tina/config.ts`.

### Commit

A saved snapshot of changes to your site's files. Every time the CMS saves your work, it creates a commit on your behalf. Commits have a timestamp and an author so you can see who changed what, and when.

> **Technically:** A Git object recording a tree state, parent commit(s), author, message.

### TinaCMS

The content editor this site uses. Editors log in with their Google account at `/admin/` and save changes directly to GitHub — no separate database, no approval step needed. Hosted via TinaCloud (free for small-church usage).

### Deploy / Deployment

To "deploy" is to put your site (or an update) onto the internet so visitors can see it. Vercel handles this automatically every time a change is merged.

### DNS

Short for **Domain Name System** — the internet's phone book. When you type `yourchurch.com`, DNS tells the browser which server to talk to. You configure DNS at whoever sold you your domain (GoDaddy, Namecheap, etc.).

### Domain

The address of your website, like `yourchurch.org`. You buy a domain from a domain registrar; you can then point it at Vercel where your site lives.

### Editorial workflow

A publish process where each change is reviewed by a tech volunteer before going live. This template uses TinaCMS, which publishes directly to the site without a review step — changes are live within 2-3 minutes of saving.

### Field

One question on a CMS form. The Sermon collection has fields for Title, Speaker, Date, etc. Configured in `tina/config.ts`.

### Fork

To "fork" a project on GitHub means to make your own copy of someone else's repository. You can then change your copy without affecting theirs. Used when adopting this template for your church.

### Frontmatter

The block of settings at the top of a Markdown file, between two `---` lines. Holds metadata like title, date, etc. The CMS edits frontmatter through forms; you don't have to read or write it directly.

### Git

The system that tracks every change to your site's files. GitHub is built on Git. You won't usually use Git directly — the CMS does it for you.

### GitHub

The website (github.com) that stores your site's files, your edit history, and serves as the backbone of the CMS workflow. Free accounts are fine for church use.

### HSL

A way to describe a color using three numbers: **H**ue (color wheel position), **S**aturation (how vivid), **L**ightness (how bright). This project's colors are defined as HSL values in `app/globals.css`.

### JSON

A file format for storing structured data, like a recipe card with labeled ingredients. The site's settings live in JSON files (`content/site.json`, `content/beliefs.json`). The CMS edits them through forms.

### Markdown

A simple text format that lets you write bold, italics, lists, and links using punctuation marks. `**bold**` becomes **bold**. The CMS has a button-bar editor; you never have to type the punctuation yourself.

### Merge

To take the changes from a pull request and add them to your site's main files. A tech volunteer does this after an editor publishes. After a merge, the change goes live within 2-3 minutes.

### Next.js

The framework this site is built with. You'll see this name in technical contexts; editors don't need to know more than that.

### Node.js

The software needed to run this site on your computer for development. You install it once from [nodejs.org](https://nodejs.org/). If you use Codespaces, you don't need to install Node.js — it's already there.

### npm

The command for installing and running Node.js software. When you see `npm run setup` in the docs, that's a command you type into a terminal window.

### OAuth

A standard for letting you log in to one service using an account from another (like "Sign in with Google"). The CMS uses Google OAuth via TinaCloud — editors click "Continue with Google" to sign in.

### Pull request (PR)

A proposed change to a code repository, with the before/after laid out clearly. The CMS (TinaCMS) commits changes directly to the main branch without creating a pull request — changes go live automatically. PRs are used when developers contribute improvements to the template itself.

### Save / Publish

The final step in the CMS when you're done editing. Clicking **Save** commits your change directly to the website files. The site rebuilds automatically and your change is live within 2-3 minutes. See [What happens when you click Save](docs/for-editors/08-publishing-changes.md).

### Repository (repo)

The folder on GitHub holding all your site's files and edit history. Each church has its own repository.

### Tailwind

The styling system used in this project. Developers will encounter the name; editors won't.

### Terminal / Command line

A text-based window where you type commands instead of clicking buttons. On Mac it's called Terminal; on Windows it's called PowerShell or Command Prompt. This site's setup mostly avoids needing a terminal — Codespaces handles it.

### TypeScript

The programming language this site is written in. A version of JavaScript with extra safety checks. Developers will care; editors won't.

### Vercel

The service that runs your website on the internet. Free for small sites. Sometimes called "hosting" or a "host." Deployed via [Deploy to Vercel](docs/for-tech-volunteers/06-deploy-to-vercel.md).

### YAML

Like JSON, a format for storing structured data — but with less punctuation. Editors never touch YAML directly; the CMS schema is defined in TypeScript (`tina/config.ts`).

---

*Missing a term? [Suggest an addition](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Glossary:%20add%20term).*
