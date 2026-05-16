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

## Common operational issues

When something is broken in production, **go to the relevant runbook before reading the rest of this page** — these are decision-tree guides built for finding the problem fast under pressure:

- **The site is down** (blank page, 404, 500, domain not resolving) → [runbook-site-down.md](./runbook-site-down.md).
- **Emails stopped sending** (subscribers not receiving, Resend dashboard quiet) → [runbook-emails-stopped.md](./runbook-emails-stopped.md).
- **A secret has been exposed** (committed `.env.local`, leaked API key, departed volunteer) → [runbook-rotate-secret.md](./runbook-rotate-secret.md).

The rest of this page is for routine maintenance, not incident response.

---

## Monthly tasks (10-15 minutes)

### 1. Check the GitHub repository for any open pull requests

Editors' changes go directly to the `main` branch via TinaCloud, so there's no approval step in normal operation. However, if a developer has opened a pull request for a code change or template update, check:

**Open** your repository's **Pull requests** tab on GitHub.

**Review and merge** any open pull requests.

> **Tip:** If you see unexpected pull requests from an account you don't recognize, check TinaCloud → Users to make sure only authorized editors have access.

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

> ⚠️ **Important — read first:** Editor CMS access is controlled in **TinaCloud**, not GitHub. Removing someone from GitHub Collaborators does **NOT** revoke their CMS access — they can still sign in at `/admin/` and edit the site. Always revoke via TinaCloud first.

There are up to **three** places someone might have access. Review each:

**1. TinaCloud (the CMS — the one that actually matters for editors).** This is where editors sign in to update sermons, events, staff, etc.

- **Open** [app.tina.io](https://app.tina.io) → your project → **Users**.
- For each user, ask yourself: "Does this person still need to edit the site?"
- If someone has left their role, **click** their row → **Remove user**.

See [Grant editor access](./08-grant-editor-access.md) for the canonical add/remove procedure.

**2. The admin allowlist** (if you set up Google sign-in for the custom admin pages — `/admin/digest`, `/admin/devotionals`).

- **Open** the CMS at `/admin/` → **Admin Access**.
- Remove anyone who shouldn't be on the admin list any more.

See [Managing admin access](../for-editors/managing-admin-access.md) for details.

**3. GitHub Collaborators** (only relevant if you gave someone direct repository access — usually only other developers/tech volunteers, not editors).

- **Open** GitHub → your repo → **Settings** → **Collaborators**.
- Remove anyone who shouldn't have repo-level access any more.
- Note: this is *separate* from CMS access. Removing from GitHub does not revoke CMS access; you must also do step 1.

> **Tip:** Set a recurring calendar event titled "Review church site access" for the first day of each quarter. Include all three checks above so nothing gets skipped.

---

## Annual tasks (once a year)

### Doctrinal statement and leadership review

**Open** the CMS and ask the pastor or elders:

- Is the **What We Believe** content still current?
- Are all **Staff** and **Elders** still in their roles?
- Is the **Our Story** prose up to date?

Have an editor update what's stale. Changes go live automatically when they click Save.

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

If an editor deletes a sermon (or any other content) by mistake, TinaCMS commits the deletion immediately — there's no open PR to cancel. Use the git history to restore it:

1. **Open** the repo on GitHub.
2. **Click** the **Commits** link.
3. **Find** the commit that deleted the entry (the message will say something like "Delete sermon 'xyz'").
4. **Click** **Revert** at the top of the commit page.

This creates a new commit that undoes the deletion. Merge it and the entry comes back within 2-3 minutes.

---

## When someone leaves

**Within 24 hours** of a volunteer or editor leaving the church (or transitioning out of their role), revoke access in the right places. CMS editor access lives in TinaCloud, not GitHub — make sure step 1 happens.

1. **TinaCloud** ([app.tina.io](https://app.tina.io) → your project → **Users** → Remove). This is the one that actually stops them editing the site.
2. **Admin allowlist** (CMS → **Admin Access** → delete their row), if Google sign-in is enabled for the custom admin pages.
3. **GitHub collaborators** (Settings → Collaborators → Remove), if they had repo-level access.
4. **Vercel team members**, if they had Vercel access.
5. **Domain registrar account**, if they had access there.

> ⚠️ **Remember:** removing a GitHub collaborator does **not** revoke CMS access. An editor whose TinaCloud access is still active can keep signing in to `/admin/` and editing the site even after losing the GitHub role. Always start with TinaCloud.

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
