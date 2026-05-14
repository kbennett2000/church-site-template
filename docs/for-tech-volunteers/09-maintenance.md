---
type: explanation
audience: tech-volunteer
time: 10 minutes (per month)
---

# Maintenance

**Who this is for:** Tech volunteers maintaining the site after launch.
**What you'll accomplish:** Know what to check monthly, quarterly, and annually — plus how to back up content and handle staff turnover.
**You'll need first:**
- The site live and editors trained. See [Grant editor access](./08-grant-editor-access.md).

---

## Monthly tasks (10-15 minutes)

### 1. Approve pending pull requests

**Open** your repository's **Pull requests** tab on GitHub.

**Review and merge** any pending changes from editors. See [Grant editor access](./08-grant-editor-access.md) step 8 for the approval flow.

> **Tip:** If a pull request has sat open for more than a couple days, it's worth pinging the editor to ask if they're still waiting on it.

### 2. Accept dependency upgrade pull requests

GitHub's automated tools (Dependabot, if enabled, or your own check) periodically open pull requests to update software libraries with security fixes.

To check for updates manually, in your terminal:

```
npm outdated
```

You should now see a table of packages with available updates.

To apply the safe (minor and patch) updates:

```
npm update
```

To apply the bigger (major) updates one at a time:

```
npm install <package-name>@latest
```

After updating, test the site:

```
npm run build
npm run start
```

If the build succeeds and the site looks normal, commit and push:

```
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

> **Warning:** Major version updates (e.g. `next` going from `15.x` to `16.x`) sometimes have breaking changes. Read the package's release notes before updating, or stick with minor updates only.

### 3. Check Vercel for failed deploys

**Open** your Vercel dashboard.

**Click** your project.

**Click** **Deployments**.

You should see a list of recent deploys, mostly green. If any are red:

- **Click** the failed deploy.
- **Read** the build log to find the error.
- **Fix** the underlying issue (usually a content typo or a code bug).

If nothing has failed, you can skip this step until next month.

### 4. Run the doctor script (optional health check)

In your terminal:

```
npm run doctor
```

This verifies everything is still wired up correctly — config files exist, content folders aren't empty, and so on.

---

## Quarterly tasks (every 3 months)

### Review editor access

**Open** GitHub → your repo → **Settings** → **Collaborators**.

For each name in the list, ask yourself: "Does this person still need access?"

If someone has left their role at the church:

**Click** **Remove** next to their name.

> **Tip:** Set a recurring calendar event titled "Review church site collaborators" for the first day of each quarter.

### Rotate the OAuth client secret (if used long-term)

If you set up a Decap OAuth proxy that uses a GitHub OAuth App, regenerate the **Client Secret** every 6-12 months:

1. **Open** the GitHub OAuth App you created.
2. **Click** **Generate a new client secret**.
3. **Update** the new secret in your OAuth proxy (Cloudflare Worker or wherever it's deployed).
4. **Delete** the old secret from the OAuth App page.

This limits damage in case the secret ever leaks.

---

## Annual tasks (once a year)

### Doctrinal statement and leadership review

**Open** the CMS and ask the pastor or elders:

- Is the **What We Believe** content still current?
- Are all **Staff** and **Elders** still in their roles?
- Is the **Our Story** prose up to date?

Have an editor update what's stale. You approve the resulting pull requests.

### Domain renewal

Your domain registrar charges annually. Make sure:

- Auto-renewal is on, OR
- You have a calendar reminder a month before expiration.

A church losing its domain because of a missed renewal payment is heartbreaking and avoidable.

### Vercel account check

**Log in** to Vercel and confirm:

- The account is still owned by someone who'll be the volunteer for the next year.
- Usage is well within the free tier (Vercel emails if you're close).

---

## Backups

### The good news: GitHub is the backup

Every piece of content (every sermon, staff entry, photo, page) is stored in your GitHub repository. GitHub maintains its own backups, and you have a full history of every change.

If a file gets deleted accidentally, you can restore any earlier version through GitHub's history.

### Exporting content (just in case)

If you want a local copy:

**Open** your repository on GitHub.

**Click** the green **Code** button.

**Click** **Download ZIP**.

This downloads everything — code, content, photos — as a ZIP file. Save it somewhere safe (an external drive, cloud storage).

> **Tip:** Do this annually. It's an "in case GitHub goes away" insurance policy, which is unlikely but cheap to have.

### Restoring a deleted entry

If an editor deletes a sermon (or any other content) by mistake:

#### Option 1: Recover from the open pull request

If the deletion hasn't been merged yet:

1. **Open** the pull request on GitHub.
2. **Click** **Close pull request without merging**.

The deletion is discarded. The original is still there.

#### Option 2: Revert from history

If the deletion is already live:

1. **Open** the repo on GitHub.
2. **Click** the **Commits** link.
3. **Find** the commit that deleted the entry (the message will say "Remove sermons 'xyz'").
4. **Click** **Revert** at the top of the commit page.

This creates a new commit that undoes the deletion. You approve and merge it, and the entry comes back.

---

## When someone leaves

**Within 24 hours** of a volunteer or editor leaving the church (or transitioning out of their role):

1. **Remove** them as a GitHub collaborator (Settings → Collaborators).
2. **If they had Vercel access**, remove that too.
3. **If they had access to the domain registrar**, change the password or remove their account.

---

## Common Mistakes

- **`npm update` ran but no updates happened.** Check `npm outdated` — if it's empty, you're already up to date.
- **`npm run build` fails after updating.** A package introduced a breaking change. Roll back the change: `git checkout package.json package-lock.json`, then `npm install`. Investigate one package at a time.
- **Failed Vercel deploy shows "module not found".** A package upgrade may have removed a dependency the site still uses. Run `npm install` locally and push the updated `package-lock.json`.
- **You can't find a deleted entry to restore.** Use GitHub's file history: navigate to the folder (e.g. `content/sermons/`) on GitHub, click **History** at the top of any file, and look through past commits.

---

## What's next?

- [Troubleshooting](./troubleshooting.md) — keep this open as a reference for the day something breaks.

## Stuck?

- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Maintenance).*
