---
type: how-to
audience: tech-volunteer
time: 20 minutes
---

# Grant editor access

**Who this is for:** Tech volunteers ready to invite the church's editors (secretary, pastor's spouse, etc.) so they can update the site through `/admin/`.
**What you'll accomplish:** Editors can sign in to the CMS with Google (or any email address) and publish changes directly. No GitHub account required.
**You'll need first:**
- Site deployed to Vercel. See [Deploy to Vercel](./06-deploy-to-vercel.md).
- **TinaCloud setup complete.** Without it, there's no CMS for editors to access — they'll hit an error at `/admin/`. See [Set up TinaCloud](./06a-setup-tinacloud.md) if you haven't done this yet.
- About 20 minutes.

---

## How editor access works with TinaCMS

Editors log in at `/admin/` on your church's website. TinaCloud handles the sign-in — editors use Google or an email/password link. **No GitHub account required.**

When an editor saves a change, TinaCloud commits it directly to your GitHub repository and Vercel rebuilds the site automatically — usually within 2 minutes.

```
Editor's browser ── login (Google/email) ──► /admin/ (TinaCMS)
                                                  │
                                                  │  (TinaCloud commits on their behalf)
                                                  ▼
                                              GitHub repo
                                                  │  (Vercel detects the push)
                                                  ▼
                                            yourchurch.org (live site)
```

---

## Steps

### 1. Open your TinaCloud project

**Go to** [app.tina.io](https://app.tina.io) and sign in.

**Click** the project for your church's site.

### 2. Add editor email addresses

**Click** **Users** in the left sidebar.

**Click** **Invite User**.

**Enter** the editor's email address.

**Select** the role — **Editor** is right for most staff.

**Click** **Send Invite**.

TinaCloud sends the editor a signup email. They don't need a GitHub account — just any email address.

**Repeat** for each editor.

> **Tip:** Tell editors to watch for the TinaCloud invite email and check spam if it doesn't arrive within a few minutes.

### 3. Have the editor accept the invite and set up their account

When the editor clicks the link in their invite email, they'll be asked to create a TinaCloud account or sign in with Google.

Once they're in, they can log in to your church's site directly at:

```
https://yourchurch.org/admin/
```

### 4. Test the editor login

**Open** `https://yourchurch.org/admin/` yourself.

**Click** **Sign in with Google** (or use the email/password option).

You should now land in the TinaCMS dashboard and see all the content collections.

If you see a login error, check that:
- `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` are set correctly in Vercel → Settings → Environment Variables.
- Your TinaCloud project is connected to the correct GitHub repository.

### 5. Walk an editor through their first login

Once your own login works, schedule 15 minutes with each editor.

Walk them through:

1. **Opening** `https://yourchurch.org/admin/`.
2. **Signing in** with Google or their email.
3. **The dashboard** — what each section is (Sermons, Staff, Announcements, etc.).
4. **Making a test change** — edit a sermon title or announcement and click **Save**.
5. **Viewing the live site** after Vercel rebuilds (takes about 2 minutes).

Point them at the [editor track docs](../for-editors/01-getting-started.md) and tell them which section is theirs to maintain.

### 6. Monitor changes (optional)

If you want to know when editors publish changes, you can watch your GitHub repository:

**Open** your GitHub repository.

**Click** **Watch** (top right) → **Custom** → check **Commits** → **Apply**.

You'll get an email notification whenever a change is pushed.

---

## Managing users

To remove an editor's access:

1. Go to [app.tina.io](https://app.tina.io) → your project → **Users**.
2. Find the editor and click **Remove**.

Their TinaCloud account is removed. They can no longer log in to your church's `/admin/`.

---

## Common Mistakes

- **Editor sees "You are not authorized" after signing in.** Make sure you added their exact email address in TinaCloud → Users. If they used Google, the email must match their Google account.
- **Editor can't find the invite email.** Ask them to check spam. If it's lost, remove and re-invite from TinaCloud.
- **Admin page returns 404 or blank.** The TinaCloud credentials (`NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`) may not be set in Vercel, or the site may need a redeploy after they were added. Go to Vercel → Deployments → **Redeploy**.
- **Changes published but site didn't update.** Vercel's rebuild triggered, but check the Vercel dashboard to make sure the build succeeded. If it failed, the Vercel build logs show the error.

---

## What's next?

- [Maintenance](./09-maintenance.md) — your monthly and quarterly tasks.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- [TinaCloud docs](https://tina.io/docs/tina-cloud/) — the canonical reference.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Grant%20Editor%20Access).*
