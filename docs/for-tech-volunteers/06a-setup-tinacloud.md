---
type: how-to
audience: tech-volunteer
time: 10 minutes
---

# Set up TinaCloud

**Who this is for:** Tech volunteers who've just deployed the site to Vercel and now need to connect the CMS so editors can update content.
**What you'll accomplish:** A working `/admin/` page on your live site that your editors can sign in to, edit content with, and publish from — without ever touching code or filing a ticket with you.
**You'll need first:**
- The site already deployed to Vercel and reachable at a `*.vercel.app` URL. See [Deploy to Vercel](./06-deploy-to-vercel.md).
- Your church's GitHub repository (the one Vercel is connected to).
- Two browser tabs handy: one for [app.tina.io](https://app.tina.io), one for your Vercel dashboard.

You don't need your code editor for this step — everything happens in a browser.

---

## Why this step exists

You just deployed a working website to Vercel. Visit it and it looks great. Visit `your-site.vercel.app/admin/` though, and you'll get an error or a blank screen — the CMS isn't connected yet. That's what this step fixes.

**TinaCloud** is the service that lets the people at your church who *aren't* developers (pastor, pastor's spouse, secretary, ministry leaders) update the website by clicking and typing in their browser instead of editing code. It handles their sign-in, commits their saved changes to your GitHub repository, and triggers a Vercel rebuild — all behind the scenes, without anyone needing a GitHub account or a terminal.

Without it, `/admin/` doesn't work and every content update has to come back through you. With it, editors are independent and you step back to the small monthly maintenance role.

TinaCloud is **free** for the size and pace of edits a small church needs (more on the cost note at the end). The whole setup takes about 10 minutes.

---

## Steps

### 1. Create a TinaCloud account

**Open** [app.tina.io](https://app.tina.io) in a new browser tab.

**Click** the **Sign in with GitHub** button.

GitHub will ask you to authorize TinaCloud to read information about your account and your repositories. **Click** the green **Authorize** button.

You should now land on the TinaCloud dashboard. The first time you arrive, it's mostly empty — you'll see a heading, possibly a welcome message, and a button to create a new project. The exact wording varies but it's the prominent call-to-action on the page (look for "Create New Project", "New Project", or a "+" button).

### 2. Start a new project

**Click** the **Create New Project** button (or whatever the equivalent call-to-action is on your dashboard).

TinaCloud will offer one or more ways to set up a project. You're looking for the option that says something like **"Connect existing repository"**, **"Existing Tina project"**, or **"I already have a Tina-configured repo"** — wording varies, but the meaning is *"my GitHub repo is already set up; just connect to it."* Pick that option.

If TinaCloud offers a wizard for new projects (creating a fresh repo from a template, scaffolding a new site), that's not what you want — your repo already exists and already has `tina/config.ts` in it.

### 3. Select your church repository

You'll see a form asking which GitHub repository to connect.

**Pick** your church's website repository from the list.

If your repo isn't in the list, TinaCloud needs broader GitHub permissions:

- Look for a link or button like **"Configure GitHub App"** or **"Adjust GitHub permissions."**
- **Click** it and grant TinaCloud access to either all your repositories or specifically the church site repo.
- Return to TinaCloud — the repo should now appear.

### 4. Fill in the project details

The new-project form asks a few questions:

- **Branch:** pick **`main`** (your repo's default branch — almost always `main`).
- **Framework / framework preset:** pick **Next.js**.
- **Path to Tina config / root directory:** leave this as the default (usually blank or `/`). The template's `tina/config.ts` lives at the repo root, which is what TinaCloud expects out of the box.

**Click** the button to create or continue. TinaCloud will validate your repository, read its `tina/config.ts`, and provision a new project. This takes about 30 seconds.

When it finishes, you should land on a project overview page — your church's project, with its name across the top and a sidebar of options (Overview, Users, Tokens, Settings — exact labels vary).

### 5. Find your Client ID

Inside your new project, find the **Client ID** (sometimes labeled **Project ID** — it's the same value, different name).

- Look on the project's **Overview** screen first — it's often shown prominently there.
- If you don't see it on Overview, check **Settings** in the left sidebar.

The Client ID is a long string of letters, numbers, and dashes (something like `abc12345-6789-def0-1234-567890abcdef`). It looks like a UUID.

**Copy** this value to a temporary scratch place — a text editor, a sticky note, or a password manager. Don't paste it into the repository, a chat window, or anywhere it could leak publicly.

### 6. Generate a read-only token

Still in your TinaCloud project, find the **Tokens** section (in the left sidebar) — or look for **API Keys** if Tokens isn't visible.

You're creating a **read-only token** that the public-facing website uses to fetch content. (TinaCloud also has tokens with broader permissions for the editor's sign-in flow, but the read-only token is what goes into Vercel.)

- **Click** the button to create a new token.
- **Pick** the **read-only** scope if asked.
- **Click** **Create** (or **Generate**).

You should now see your new token — another long string of characters.

> ⚠️ **Critical:** the token is shown **only once**, in the dialog that appears right after you create it. If you close that dialog without copying the token, you cannot get it back — you'll have to generate a new one and replace it in Vercel. **Copy it now**, before you close anything.

**Copy** the token to the same scratch place as your Client ID. Treat it like a password — don't commit it to git, don't email it, don't paste it into a public chat.

### 7. Open your Vercel project in the other tab

Switch to your Vercel browser tab (or open [vercel.com/dashboard](https://vercel.com/dashboard) in a new tab).

**Click** the project for your church's site.

**Click** **Settings** at the top of the project page.

**Click** **Environment Variables** in the left sidebar.

You should now see a screen with a form at the top labeled something like **"Add new"** and a list below it of any environment variables already set on this project (likely empty at this point).

### 8. Add the Client ID environment variable

In the **Add new** form:

- **Name** (or **Key**): type `NEXT_PUBLIC_TINA_CLIENT_ID` exactly — including the underscores, all uppercase. Vercel is case-sensitive.
- **Value:** paste the Client ID you copied in step 5.
- **Environments:** check all three boxes — **Production**, **Preview**, and **Development**. The CMS needs to work the same in all of them.
- If Vercel offers a **Sensitive** checkbox or toggle, **check it**. This hides the value in the UI after saving.

**Click** **Save** (or **Add**).

You should now see `NEXT_PUBLIC_TINA_CLIENT_ID` appear in the list of environment variables below the form.

### 9. Add the read-only token environment variable

Repeat the same process for the token. In the **Add new** form:

- **Name:** type `TINA_TOKEN` exactly.
- **Value:** paste the read-only token you copied in step 6.
- **Environments:** check all three — **Production**, **Preview**, **Development**.
- **Sensitive:** check the box if Vercel offers it.

**Click** **Save**.

You should now see both `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` in the environment variables list.

> **Tip:** double-check there's no leading or trailing whitespace in either value. Paste each one into a plain text editor briefly if you're worried — a sneaky space at the end is a common cause of "I followed every step and it still doesn't work."

### 10. Trigger a fresh deployment

Vercel doesn't re-read environment variables automatically — your current live deploy was built without them. You need to redeploy to pick them up.

**Click** **Deployments** in the project's top navigation (you may need to leave Settings first).

You should now see a list of deployments, with the most recent one at the top marked **Ready**.

**Click** the **"⋯"** (three-dot) menu next to the most recent deployment.

**Click** **Redeploy** in the dropdown.

A confirmation dialog appears. **Uncheck** the box labeled **"Use existing Build Cache"** if it's checked — a fresh build picks up new environment variables more reliably than a cached one.

**Click** **Redeploy** to confirm.

The page updates live. You should see a new deployment appear at the top of the list, cycling through **Building** → **Deploying** → **Ready**. This takes 2-3 minutes.

### 11. Verify the CMS works

When the redeploy finishes and shows **Ready**:

**Open** `your-site.vercel.app/admin/` in your browser (replace `your-site` with whatever your actual Vercel URL prefix is — the same URL the homepage lives at, just with `/admin/` on the end).

You should now see a TinaCloud sign-in screen — a clean page with the TinaCloud or Tina branding and a **Sign in with GitHub** button (and possibly a Google or email option).

If you see an error message instead, jump to **Troubleshooting** below.

**Click** **Sign in with GitHub** and sign in with the same GitHub account that owns the repository.

You should now land on the CMS interface — a left sidebar listing content collections (Site Settings, Sermons, Staff, Ministries, Announcements, and so on) and a main panel for editing.

### 12. Test a real edit end-to-end

Before walking away from this, confirm the whole save-and-publish loop actually works.

**Click** **Site Settings** in the CMS sidebar.

**Click** the entry to open it.

**Find** a small, safe field to edit — the **Tagline** field is a good choice (a short subheading that appears on the homepage).

**Change** the value to something temporary like "Testing the CMS — please ignore."

**Click** the **Save** button at the top of the form.

You should now see a brief confirmation that the save succeeded.

Behind the scenes, TinaCloud just committed that change to your GitHub repository, and Vercel has detected the push and started rebuilding. Wait about 60–90 seconds.

**Open** your live homepage in a new tab (`your-site.vercel.app`, not `/admin/`).

**Press** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) to hard-refresh.

You should now see your temporary tagline ("Testing the CMS — please ignore.") on the homepage.

### 13. Revert your test edit

Go back to the CMS tab.

**Change** the Tagline back to whatever it was before.

**Click** **Save**.

Wait another 60–90 seconds and confirm the homepage shows the original tagline again. Now nobody will ever know you were here.

---

## Troubleshooting

### "I see an error at `/admin/` after redeploy"

Most likely: the environment variables are typed wrong, or the redeploy hasn't finished yet.

- **Check the deployment finished.** Go to Vercel → Deployments. The top deploy should say **Ready** with a green checkmark. If it's still **Building** or **Deploying**, wait.
- **Check the variable names.** Go to Vercel → Settings → Environment Variables. The names must be exactly `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` — uppercase, with underscores, no typos.
- **Check the values.** Click the eye icon (or **Edit**) next to each variable to reveal the value. Copy it into a plain text editor and look for trailing spaces or accidentally-included quotation marks.
- **Try a fresh redeploy without build cache.** Some env var changes don't take effect until the build cache is cleared. Deployments → "⋯" → Redeploy → uncheck "Use existing Build Cache" → Redeploy.

### "I made an edit and saved, but the homepage doesn't reflect it"

The save-to-live loop has three hops, and any one of them can stall briefly:

1. **TinaCloud commits the change to GitHub.** This is fast — under a second.
2. **GitHub notifies Vercel.** Also fast.
3. **Vercel rebuilds the site.** This is the slow one — 1 to 3 minutes.

If your change hasn't appeared after 3 minutes:

- **Check Vercel → Deployments.** You should see a deployment from `tina-cloud-app` (or similar) timestamped around when you saved. If you see one, check its status — if it's **Building**, wait. If it **Failed**, click into it and read the build log.
- **Hard-refresh your browser** (Ctrl+Shift+R / Cmd+Shift+R) — your browser may be showing a cached copy of the old page.
- **No new deployment at all?** The GitHub→Vercel connection may have broken. In Vercel → Settings → Git, confirm the right repository is still connected.

### "TinaCloud says my repository isn't accessible"

This usually means TinaCloud's GitHub permissions are out of date — either you switched accounts, or you renamed/transferred the repo.

- **Confirm the repository name and owner** match exactly what's connected in Vercel. They must be the same repo.
- **In TinaCloud → your project → Settings (or Configuration),** look for an option to reconnect or re-authorize GitHub. Click it and re-grant access.
- **If you forked the template into a different GitHub account or organization**, make sure TinaCloud is connected to *your* fork, not the original template repository.

### "I see the CMS but every field is read-only / I can't edit anything"

You're signed in with a GitHub account that doesn't have write access to the connected repository.

- **Sign out** and sign back in with the GitHub account that owns the repo.
- **Or, add the account you signed in with as a collaborator** on the GitHub repo (Settings → Collaborators on the GitHub repo page).
- **For inviting your church's editors** (who shouldn't need GitHub accounts at all), don't try to fix this with GitHub collaborators — use TinaCloud's own user-invite flow, covered in [Grant editor access](./08-grant-editor-access.md).

### "The read-only token I copied isn't working"

If you're sure the value is right and the variable name is `TINA_TOKEN` exactly, generate a fresh one:

- TinaCloud → your project → **Tokens** → create a new read-only token.
- Update `TINA_TOKEN` in Vercel with the new value.
- Redeploy.

The old token can sit unused (or you can delete it from TinaCloud). The new one will work for the same project.

---

## A note on cost

TinaCloud's free plan is generous and intended for projects like a church website:

- It doesn't expire.
- It doesn't require a credit card.
- It's fine for the editing volume of a small church (a few edits a week, occasionally more during a sermon-series launch or event).

You'd only need a paid plan if you had **many** active editors collaborating simultaneously, or if you crossed into thousands of edits per month — neither of which is the church-website use case. If TinaCloud ever shows you a usage warning in the dashboard, that's the signal to evaluate; until then, free is the right plan.

---

## What's next?

- [Connect a custom domain](./07-connect-domain.md) — point `yourchurch.org` at the Vercel site so editors and visitors aren't using `*.vercel.app`.
- [Grant editor access](./08-grant-editor-access.md) — invite your pastor, secretary, and ministry leaders as editors. They sign in with Google or email; no GitHub account needed.

If you want to test the editor experience yourself before inviting anyone, head to `your-site/admin/`, sign in, and try out a few edits while pretending to be the pastor's spouse. The [editor track](../for-editors/01-getting-started.md) is now the relevant set of docs.

---

## Stuck?

- [Troubleshooting](./troubleshooting.md) — broader setup issues.
- [TinaCloud's own docs](https://tina.io/docs/) — the canonical reference if our description of their UI has drifted from what you actually see.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Setup%20TinaCloud).*
