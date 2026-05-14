---
type: reference
audience: tech-volunteer
time: as needed
---

# Tech volunteer troubleshooting

**Who this is for:** Tech volunteers who've hit a problem during setup, deployment, or maintenance.
**What you'll accomplish:** Find the cause and the fix for the most common problems, ordered by where in the setup process they tend to occur.
**You'll need first:** Nothing — this is a reference. Skim until you find your symptom.

> **Tip:** Always run `npm run doctor` first. It catches most setup-time problems and tells you exactly which fix applies.

---

## Setup script problems

### "Setup script failed: Node.js 16 — we need 18 or newer"

**Cause:** Your installed Node.js is too old.

**Fix:**
1. **Open** [nodejs.org](https://nodejs.org/).
2. **Download** the **LTS** version.
3. **Install** it (defaults are fine).
4. **Close and reopen** your terminal.
5. **Verify** with `node --version` — should show v18, v20, or higher.
6. **Re-run** `npm run setup`.

### "npm install failed" during setup

**Cause:** Usually network issues, file permission issues, or a corrupted package cache.

**Fix:**
1. **Delete** the `node_modules/` folder if it exists: `rm -rf node_modules` (Mac/Linux) or delete it via Explorer (Windows).
2. **Delete** the `package-lock.json` file in the project root.
3. **Run** `npm cache clean --force`.
4. **Re-run** `npm install`.

If it still fails, try a different network — corporate firewalls sometimes block npm.

### "Cannot find module 'gray-matter'" or similar when running setup

**Cause:** Dependencies didn't install fully.

**Fix:** Run `npm install`, wait for it to finish completely (no errors), then re-run `npm run setup`.

### Setup runs but `content/site.json` doesn't get updated

**Cause:** You pressed Enter through every prompt without typing values, accepting blank defaults.

**Fix:** Re-run `npm run setup` and **type a value** at each prompt before pressing Enter.

---

## "I can't push to GitHub"

### "Permission denied (publickey)"

**Cause:** You're trying to push using SSH, but you haven't set up SSH keys.

**Fix:** Switch the remote URL to HTTPS:
1. **Open** your repository on GitHub.
2. **Click** the green **Code** button.
3. **Copy** the HTTPS URL (e.g. `https://github.com/you/church-site.git`).
4. **Run:** `git remote set-url origin <the HTTPS URL>`.
5. **Try** `git push` again. You'll be prompted to log in to GitHub.

### "Authentication failed" when pushing

**Cause:** GitHub stopped accepting passwords in 2021. You need a **Personal Access Token** instead.

**Fix:**
1. **Open** [github.com/settings/tokens](https://github.com/settings/tokens).
2. **Click** **Generate new token** → **Generate new token (classic)**.
3. **Name** it "church-site-push".
4. **Pick** an expiration (90 days is fine).
5. **Check** the `repo` scope.
6. **Click** **Generate token**.
7. **Copy** the token (you'll see it only once).
8. When `git push` asks for your password, **paste the token** instead.

> **Tip:** Most modern Git installs use a credential helper. Once you paste the token, Git remembers it.

### "Failed to push some refs"

**Cause:** Someone (or something — like an automated bot) pushed to your repo while you weren't looking, so your local copy is behind.

**Fix:**
```
git pull --rebase
git push
```

If `git pull --rebase` shows conflicts, resolve them and continue with `git rebase --continue`.

---

## Vercel build failures

### "Module not found: Can't resolve 'X'"

**Cause:** A dependency wasn't installed before pushing, or `package.json` and `package-lock.json` are out of sync.

**Fix:**
1. **Locally**, run `npm install`.
2. **Commit** the updated `package-lock.json`.
3. **Push** to GitHub. Vercel rebuilds automatically.

### "Error: ENOENT: no such file or directory"

**Cause:** A file referenced by code doesn't exist on disk (often `/content/something.md`).

**Fix:**
1. **Read** the Vercel build log to find the missing file's path.
2. **Check** the file is committed to the repo.
3. **Pay attention to capitalization** — Vercel's build uses Linux, which is case-sensitive. A file named `Sermon.md` is different from `sermon.md`. Rename the file or fix the import to match.

### "Type error: Property 'X' does not exist"

**Cause:** TypeScript type mismatch — usually after you customized code.

**Fix:**
1. **Read** the build log for the file and line number.
2. **Open** that file locally.
3. **Either** fix the type or look at related code to understand what should be there.
4. **Test** locally with `npm run build` before pushing.

### Build hangs at "Collecting page data..." then times out

**Cause:** An infinite loop in a page's data loader, or a misconfigured async function.

**Fix:** Roll back your most recent code change with `git revert HEAD`, then investigate. Reduce the change to the smallest piece that reproduces the hang.

### Build succeeds but the published site shows the wrong content

**Cause:** Vercel may have deployed an old commit, or browser cache.

**Fix:**
1. **Check** the Vercel deployment list — verify the latest commit is what deployed.
2. **Hard-refresh** the browser with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).
3. **Visit** the site from an incognito/private window.

---

## CMS authentication issues

### Editor sees "Not Authorized" after signing in

**Causes (in order of likelihood):**

1. **Editor's email wasn't added in TinaCloud.**
   - **Fix:** Go to [app.tina.io](https://app.tina.io) → your project → Users → Invite User. Make sure the email matches exactly what the editor used to sign in.

2. **TinaCloud credentials (`NEXT_PUBLIC_TINA_CLIENT_ID` / `TINA_TOKEN`) aren't set in Vercel.**
   - **Fix:** Vercel → Settings → Environment Variables. Add both values from TinaCloud → your project → Overview. Then Vercel → Deployments → Redeploy.

3. **The Vercel project isn't connected to the correct TinaCloud project.**
   - **Fix:** In TinaCloud, confirm the project is pointing at the correct GitHub repository (organization/repo-name).

### The `/admin/` page returns 404 or blank

**Cause:** TinaCMS admin UI wasn't built yet.

**Fix:** The admin is generated at build time by `tinacms build`. Make sure `npm run build` (which runs `tinacms build && next build`) completed successfully. Check the Vercel build logs for errors.

### "Failed to fetch" errors in the CMS after a successful login

**Cause:** CORS misconfiguration on the OAuth proxy, or GitHub rate limiting.

**Fix:**
1. **Check** that the OAuth proxy's CORS settings allow your site's domain.
2. **Wait** 15 minutes (GitHub rate limits reset hourly) and try again.

---

## Custom domain issues

### "Invalid Configuration" stays red in Vercel for hours

**Cause:** DNS records aren't propagating, or values are wrong.

**Fix:**
1. **Check** [dnschecker.org](https://dnschecker.org/) — paste your domain, pick "A" record. Look for the IP Vercel showed you.
2. **If the IPs don't match**, recheck the A record at your registrar. Make sure you saved.
3. **If the IPs match but Vercel still shows red**, click the **Refresh** button on Vercel's Domains page.

### "Your connection is not private" SSL warning

**Cause:** SSL certificate hasn't been issued yet, or DNS hasn't fully propagated.

**Fix:** Wait 10-15 more minutes after DNS shows "Valid Configuration" in Vercel. The certificate auto-issues. If it still doesn't work after an hour, delete the domain from Vercel and re-add it.

### Email stopped working after DNS change

**Cause:** You accidentally deleted MX records when removing old A/CNAME records.

**Fix:**
1. **Check** your email provider (Google Workspace, Microsoft 365, ProtonMail, etc.) docs for the correct MX records.
2. **Add them back** at your registrar.
3. **Wait** 30 minutes for propagation.

---

## Editor's published change isn't showing up

### Pull request exists but no rebuild started

**Cause:** Vercel may have lost the GitHub webhook.

**Fix:**
1. **Open** Vercel → project → Settings → Git.
2. **Disconnect** GitHub.
3. **Reconnect** GitHub. Re-import the repo.

### Pull request merged but site didn't update

**Cause:** Build failed silently, or Vercel didn't trigger on the merge.

**Fix:**
1. **Open** Vercel → project → Deployments.
2. **Check** the most recent deployment status.
3. **If red**, read the build log and fix the underlying error.
4. **If no recent deployment**, manually trigger one: click **Redeploy** on the latest deployment.

---

## "The site is slow"

### Lighthouse or PageSpeed score is poor

**Causes:** Usually huge images.

**Fix:**
1. **Audit** `public/images/uploads/` and `public/images/imported/`.
2. **Identify** files over 1 MB.
3. **Shrink them** at [squoosh.app](https://squoosh.app/).
4. **Re-upload** through the CMS, or replace files directly and push.

---

## Something else?

- **Read the Vercel build logs** — they're verbose but accurate.
- **Run `npm run doctor`** — it diagnoses the most common setup issues.
- **Search the GitHub Issues tracker** — someone has probably hit the same thing.
- **Open a new issue** if you can't find an answer.

## What's next?

- [Overview](./01-overview.md) — refresher on the whole flow.
- [Maintenance](./09-maintenance.md) — the routine that keeps everything healthy.

## Stuck?

- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)
- [Vercel support](https://vercel.com/help) — for Vercel-specific problems.

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Tech%20Volunteer%20Troubleshooting).*
