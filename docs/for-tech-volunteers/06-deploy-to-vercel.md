---
type: how-to
audience: tech-volunteer
time: 15 minutes
---

# Deploy to Vercel

**Who this is for:** Tech volunteers ready to publish the site to the internet.
**What you'll accomplish:** Have the site live at a public `*.vercel.app` URL, with automatic re-deploys every time content changes.
**You'll need first:**
- A configured site (you've run `npm run setup`). See [First-time setup](./04-first-time-setup.md).
- The template copied to your GitHub account. See [Use this template](./03-use-this-template.md).
- A free Vercel account (you'll create one in this guide).

---

## Why Vercel

Vercel is built by the company that makes Next.js (the framework this site uses). For a static church site, the free tier is more than enough — no credit card needed.

Alternatives like Netlify or Cloudflare Pages work fine too, but the guides assume Vercel.

---

## Two paths to deploy

- **Path A:** Use the built-in `npm run deploy` walkthrough — interactive, step-by-step.
- **Path B:** Click through Vercel manually — read this whole doc.

Both produce the same result. Use Path A if you like terminal walkthroughs; Path B if you prefer reading.

---

## Path A: `npm run deploy` walkthrough

In your terminal, **type**:

```
npm run deploy
```

**Press** Enter.

The script walks you through every step with copy-pasteable commands and confirmations. Follow the prompts.

When the script finishes, your site is live. Skip the rest of this doc.

---

## Path B: Manual deployment

### 1. Push your local changes to GitHub

If you've been editing locally (not in Codespaces), you need to push your changes up to GitHub first.

**In your terminal**, run these one at a time:

```
git add .
git commit -m "Initial setup for our church"
git push
```

You should now see output like:

```
Enumerating objects: 50, done.
...
To https://github.com/your-username/church-site.git
   abc123..def456  main -> main
```

If git asks you to log in, sign in to GitHub.

> **Tip:** If you're in Codespaces, the source control panel on the left has the same buttons (Stage → Commit → Push) without typing commands. Or run the commands in the Codespaces terminal — they work identically.

### 2. Create a Vercel account

**Open** [vercel.com/signup](https://vercel.com/signup) in a new tab.

**Click** **Continue with GitHub**.

![Vercel signup page](/docs/screenshots/tech-volunteer/deploy-to-vercel-signup.png)

**Authorize** Vercel to access your GitHub repositories when GitHub prompts you.

You should now be on the Vercel dashboard at [vercel.com/dashboard](https://vercel.com/dashboard).

### 3. Create a new project

**Click** the **Add New...** button at the top right.

**Click** **Project** in the dropdown.

You should now see a list of your GitHub repositories.

![Vercel import repository list](/docs/screenshots/tech-volunteer/deploy-to-vercel-import-list.png)

### 4. Find your church site repository

If the repository isn't listed:

- **Click** **Adjust GitHub App Permissions** at the top of the list.
- **Authorize** Vercel to access more repositories (or all repositories).
- **Return** to the import screen — the list should now include your repo.

### 5. Click Import

**Click** the **Import** button next to your church site repository.

You should now see the **Configure Project** page.

![Vercel configure project](/docs/screenshots/tech-volunteer/deploy-to-vercel-configure.png)

### 6. Leave every setting at the default

Vercel auto-detected this as a Next.js project. **Don't change anything** on this page:

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./`
- **Build Command:** `next build` (auto)
- **Output Directory:** auto
- **Install Command:** `npm install` (auto)
- **Environment Variables:** none needed yet

### 7. Click Deploy

**Click** the big black **Deploy** button at the bottom.

You should now see a progress screen with logs scrolling by:

```
Cloning github.com/your-username/church-site
Installing dependencies...
Building...
```

This takes about 2-3 minutes the first time.

### 8. See your live site

When the build finishes, you'll see confetti and a celebration screen with a preview thumbnail.

![Vercel deployment complete](/docs/screenshots/tech-volunteer/deploy-to-vercel-success.png)

**Click** the **Continue to Dashboard** button (or the preview thumbnail).

On your project's dashboard, you'll see the live URL — something like:

```
https://church-site-xyz.vercel.app
```

**Click** the URL.

You should now see your live website — same one you previewed at `http://localhost:3000`, but now on the public internet.

> **Tip:** Bookmark this URL. Send it to the pastor or other volunteers to look at.

### 9. Understand the automatic rebuilds

From now on, every time something changes on the `main` branch of your GitHub repository, Vercel rebuilds and redeploys the site automatically. This happens when:

- An editor saves a change in the CMS (TinaCMS commits directly to `main` — no PR or merge step needed).
- You push code edits to GitHub.
- You merge any pull request.

Each rebuild takes 1-3 minutes. You'll see them in your Vercel dashboard under **Deployments**.

### 10. (Optional) Rename the default URL

Vercel gives you a `*.vercel.app` URL by default. You can change the prefix:

**In** your project's dashboard, **click** **Settings** → **Domains**.

Under the default `*.vercel.app` domain, **click** **Edit**.

**Type** a new prefix (e.g. `your-church-name.vercel.app`).

**Click** **Save**.

The new URL is active immediately.

---

## What's next?

Your site is live, but `/admin/` won't work yet — the CMS isn't connected. The next step sets up TinaCloud so editors can update content in their browsers without involving you.

- **[Set up TinaCloud](./06a-setup-tinacloud.md)** — required before editors can use `/admin/`.
- [Connect a custom domain](./07-connect-domain.md) — point `yourchurch.org` at Vercel. You can do this before or after TinaCloud; the two are independent.
- [Grant editor access](./08-grant-editor-access.md) — invite the church secretary and set up CMS authentication. Requires TinaCloud first.

---

## Common Mistakes

- **Vercel says "Build failed: Module not found."** Make sure you pushed all your local changes to GitHub. Run `git status` — if it lists modified files, run `git add .`, `git commit -m "Updates"`, `git push`.
- **The Deploy button is greyed out.** Vercel can't find the repository, usually a GitHub permissions issue. **Click** **Adjust GitHub App Permissions** and grant access to your church site repository.
- **The build succeeds but the site shows "404 - This page could not be found".** You probably deployed an empty repo (forgot to push) or the project root is wrong. Check your project's **Settings → General** and confirm the **Root Directory** is `./` (just a period and slash).
- **The site shows but content is wrong (still says "Grace Community Church" everywhere).** You forgot to run `npm run setup`, or you ran it but didn't push the changes to GitHub. Run setup, then commit and push.
- **"This Serverless Function has timed out."** Unusual for this template. Check the Vercel deployment logs for errors. Most likely the build is fine but a runtime error in one of the pages — see [troubleshooting](./troubleshooting.md).

---

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- [Vercel's support](https://vercel.com/help) — for issues specific to Vercel.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Deploy%20to%20Vercel).*
