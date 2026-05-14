---
type: how-to
audience: tech-volunteer
time: 25 minutes
---

# Grant editor access

**Who this is for:** Tech volunteers ready to invite the church's editors (secretary, pastor's spouse, etc.) so they can update the site through `/admin/`.
**What you'll accomplish:** Editors can sign in to the CMS with their GitHub account, draft changes, and submit them for your approval.
**You'll need first:**
- Site deployed to Vercel. See [Deploy to Vercel](./06-deploy-to-vercel.md).
- Domain working (or the `*.vercel.app` URL ready to use). See [Connect a domain](./07-connect-domain.md).
- The GitHub usernames of every editor you want to invite.
- About 30 minutes — most of which is the Decap OAuth setup.

---

## What "editor access" actually involves

Two things have to happen for an editor to log in:

1. **They need to be a collaborator on the GitHub repository.** This gives them permission to read and write the church's content files.
2. **The CMS at `/admin/` needs an OAuth (authentication) proxy** so that Decap can talk to GitHub on their behalf without exposing your church's credentials.

You'll do both in this guide.

---

## Steps

### 1. Update the CMS config with your real GitHub repo path

Open `public/admin/config.yml` in your code editor.

Find the lines near the top that look like:

```yaml
backend:
  name: github
  repo: your-org/your-repo
  branch: main
```

Change `your-org/your-repo` to the actual path of your church's repo. For example:

```yaml
backend:
  name: github
  repo: kbennett-org/church-site
  branch: main
```

> **Tip:** Find your repo path by looking at the URL of your GitHub repository: `https://github.com/kbennett-org/church-site` → the path is `kbennett-org/church-site`.

**Save** the file.

**Commit and push** to GitHub:

```
git add public/admin/config.yml
git commit -m "Point CMS at our GitHub repo"
git push
```

Vercel will rebuild the site automatically.

### 2. Run the doctor script to verify

In your terminal:

```
npm run doctor
```

Look for the line **CMS connected to a real GitHub repo**. It should now show a green checkmark. If it still shows red, the config.yml change didn't save correctly — re-open and re-check.

### 3. Invite editors as GitHub collaborators

**Open** your GitHub repository in a browser: `https://github.com/your-username/church-site`.

**Click** **Settings** (top right of the repo page).

**Click** **Collaborators** in the left sidebar (under Access).

You may be asked to confirm your GitHub password.

![GitHub collaborators page](/docs/screenshots/tech-volunteer/grant-editor-access-collaborators.png)

**Click** **Add people**.

**Type** the editor's GitHub username, email, or full name.

**Click** the matching result in the dropdown.

**Click** **Add `<username>` to this repository**.

GitHub sends them an invitation email. They have to click **Accept invitation** in that email before they can log in to the CMS.

**Repeat** for each editor.

> **Tip:** Tell editors to watch for the GitHub invitation email — it sometimes lands in spam.

### 4. Set up Decap OAuth (the authentication proxy)

The CMS uses GitHub for login. But Decap can't talk to GitHub directly from a static site — it needs a small middleman service called an **OAuth proxy**.

There are several options, ranked by ease:

| Option | Effort | Cost | Notes |
| --- | --- | --- | --- |
| Netlify Identity (no longer recommended) | — | — | Being deprecated. Skip. |
| Cloudflare Workers | Low | Free | Recommended. About 10 minutes. |
| Vercel-hosted serverless function | Low | Free | Use if you're avoiding Cloudflare. |
| Self-hosted OAuth server | High | Varies | Only for unusual setups. |

The full setup steps differ for each option and Decap maintains the canonical instructions, so:

**Open** [Decap CMS: External OAuth Clients](https://decapcms.org/docs/external-oauth-clients/) in your browser.

**Pick** an option from the list (Cloudflare Workers is the most popular for small churches).

**Follow** the steps in their docs.

The short version of what you'll do:

1. **Register** a new **GitHub OAuth App** at [github.com/settings/applications/new](https://github.com/settings/applications/new).
   - **Application name:** something like "ChurchName Site CMS"
   - **Homepage URL:** your site URL (e.g. `https://yourchurch.org`)
   - **Authorization callback URL:** the URL of the OAuth proxy you'll deploy.
2. **Note down** the **Client ID** and generate a **Client Secret** — both are shown only on the GitHub OAuth App page. Save them somewhere safe (a password manager works).
3. **Deploy** the OAuth proxy (Cloudflare Worker or whatever you picked) and configure it with your Client ID and Secret.
4. **Update** `public/admin/config.yml` with the OAuth proxy URL if Decap's instructions require it.

Decap's docs are authoritative; we don't copy them here because they change.

### 5. Test the editor login

**Open** `https://yourchurch.org/admin/` (or the `*.vercel.app` URL).

**Click** **Login with GitHub**.

**Authorize** the CMS to access your account.

You should now see the CMS dashboard.

If you see "Not Authorized" or a stuck-loading screen, see [troubleshooting](./troubleshooting.md).

### 6. Walk an editor through their first login

Once you've confirmed your own login works, schedule 15-20 minutes with each editor.

Walk them through:

1. **Opening** `https://yourchurch.org/admin/`.
2. **Clicking** **Login with GitHub** and authorizing.
3. **The dashboard** — what each collection is.
4. **Adding a test sermon** (which they'll publish, and you'll approve to demonstrate the flow).

Point them at the [editor track docs](../for-editors/01-getting-started.md) and tell them which collection is theirs to maintain.

### 7. Set up your own notifications

So you know when an editor publishes a change to review:

**Open** your GitHub repository.

**Click** **Watch** at the top right of the repo page (next to Star).

**Click** **Custom**.

**Check** **Pull requests**.

**Click** **Apply**.

You'll now get an email every time an editor submits a change for your review.

### 8. Practice the approval flow

To approve a pull request from an editor:

1. **Click** the email notification link, or **go to** your repo's **Pull requests** tab.
2. **Click** the open pull request.
3. **Click** **Files changed** to see exactly what changed.
4. If it looks good, **click** **Merge pull request** at the bottom → **Confirm merge**.
5. Vercel automatically rebuilds the site within 1-3 minutes.

That's the whole maintenance loop — and it's the bulk of your job from here on.

---

## What's running where (mental model)

```
Editor's browser ── login ──► /admin/ (Decap CMS)
                                  │
                                  │  (uses your OAuth proxy)
                                  ▼
                              GitHub repo
                                  │
                                  │  (you approve PR)
                                  ▼
                              Vercel builds
                                  │
                                  ▼
                            yourchurch.org (live site)
```

---

## Common Mistakes

- **Editor sees "Not Authorized" after clicking Login with GitHub.** They were added to the repo but haven't accepted the invitation email. Tell them to find the GitHub invitation in their inbox and click **Accept invitation**.
- **Editor sees a stuck loading spinner after authorizing.** The OAuth proxy is misconfigured. Re-check your OAuth App's callback URL matches what your proxy expects. See the Decap docs.
- **Login window opens but immediately closes with no message.** Pop-up blocker. Tell the editor to allow pop-ups for the church's site.
- **Login works but they see no collections.** You forgot to update `public/admin/config.yml` to point at your real repository. Fix it, commit, push.
- **You used a private repository, and the OAuth flow asks editors to upgrade to GitHub Pro.** Private GitHub repos require everyone to have a GitHub account in good standing — for free accounts that's fine. The Pro nag may be misread; double-check the exact error.

---

## What's next?

- [Maintenance](./09-maintenance.md) — your monthly and quarterly tasks.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- [Decap CMS GitHub backend docs](https://decapcms.org/docs/github-backend/) — the canonical reference.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Grant%20Editor%20Access).*
