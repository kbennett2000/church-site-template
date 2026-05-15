---
type: how-to
audience: tech-volunteer
time: 5 minutes
---

# First-time setup

**Who this is for:** Tech volunteers who've created their church's copy of the template and are ready to configure it.
**What you'll accomplish:** Run `npm run setup` and have the site filled out with the church's name, address, contact info, service time, and a chosen color palette.
**You'll need first:**
- The template copied to your account and opened in Codespaces or cloned to your computer. See [Use this template](./03-use-this-template.md).
- A terminal open and pointed at the project folder. (In Codespaces, the terminal is at the bottom of the browser editor. Locally, see [Prerequisites](./02-prerequisites.md) for how to open one.)
- The church's basic info: name, address, phone, email, Sunday service start time.

---

## What `npm run setup` does

It walks you through a series of prompts and:

1. Checks you have Node.js 18 or newer.
2. Installs the project's software dependencies (about 100 packages — runs once).
3. Asks for your church's name, address, phone, email, and service time.
4. Asks you to pick one of four color palettes.
5. Writes those answers into `content/site.json` and `app/globals.css`.
6. Generates a placeholder logo using the church's initials.
7. Prints instructions for what to do next.

You can run it again any time — the script remembers your previous answers and lets you press Enter to keep them.

---

## Steps

### 1. Make sure you're in the project folder

In your terminal, type:

```
ls
```

(On Windows native command prompt, use `dir` instead of `ls`.)

You should now see a list of files and folders including `package.json`, `content`, `app`, and `scripts`. If you don't, you're in the wrong folder — `cd` into the project folder first.

### 2. Run the setup script

**Type:**

```
npm run setup
```

**Press** Enter.

You should now see a welcome banner:

```
╔════════════════════════════════════════════╗
║  Church Site Setup                         ║
╚════════════════════════════════════════════╝
```

### 3. Wait for dependencies to install

The script first installs all the project's required software packages. The first time this runs, it takes 1-3 minutes. **You'll see a wall of text scroll by — that's normal.** Just leave the window alone and wait for the green checkmark. When it's done, you'll see a few lines of output ending with the checkmark:

```
Step 2 — Installing required software
  This may take a minute the first time...
  ✓ Dependencies installed
```

> **Warning:** Don't interrupt this step. If the install gets cut off halfway, the project won't work and you'll have to delete `node_modules/` and re-run setup.

### 4. Answer the church info prompts

The script then asks for each piece of information one at a time. **Type** each answer and press Enter.

```
Step 3 — Tell us about your church

  Church name:
  Short name / acronym (used in the logo circle):
  Street address:
  City:
  State (2 letters):
  ZIP code:
  Phone number:
  General email address:
  Main Sunday service time:
```

A few tips:

- **Church name:** Full official name. Example: `Grace Community Church`.
- **Short name / acronym:** The 2-3 letter version used inside the placeholder logo. The script auto-suggests one based on the church name's initials. Press Enter to accept the suggestion or type your own.
- **State (2 letters):** Two-letter postal code. `TX` for Texas, `NY` for New York, etc.
- **Phone number:** Format `(555) 123-4567` (or `555-123-4567` — either works).
- **Main Sunday service time:** Format `10:00 AM` (with capital AM/PM).

> **Tip:** If you press Enter without typing anything, the script keeps the existing default value (shown in square brackets after the prompt).

### 5. Pick a color palette

The script shows four palettes with color swatches:

```
Step 4 — Pick a color palette
  These shape the look of your site. You can change it later.

  1) ▮▮  Sandstone & Sage
     Warm cream, deep sage, terracotta accent (the default)
  2) ▮▮  Mountain Morning
     Soft alpine, evergreen primary, brass accent
  3) ▮▮  High Desert
     Warm white, burnt sienna primary, olive accent
  4) ▮▮  Coastal
     Soft sand, deep navy primary, warm orange accent

  Enter the number (1-4):
```

**Type** `1`, `2`, `3`, or `4` and press Enter.

> **Tip:** Don't fret over this. You can change the palette later, or fine-tune the exact colors. See [Customize branding](./05-customize-branding.md).

### 6. Wait for the script to save

The script writes your answers to disk and prints a green confirmation:

```
Step 5 — Saving your settings
  ✓ Saved church info → content/site.json
  ✓ Applied "Sandstone & Sage" → app/globals.css
  ✓ Generated placeholder logo → public/logo.svg (GCC)

All set
```

### 7. Start the site to preview it

**Type:**

```
npm run cms
```

**Press** Enter.

After about 15-30 seconds (TinaCMS compiles the editor UI on first run), you should see:

```
✓ Ready in 5.2s
- Local:        http://localhost:3000
```

### 8. Open the site in your browser

**Open** [http://localhost:3000](http://localhost:3000) in a browser.

You should now see your church's website — with the name, address, phone, and color palette you just entered.

> **Codespaces note:** In Codespaces, the URL is different — VS Code in the browser shows a small popup that says "Your application running on port 3000 is available." Click **Open in Browser**. Or click the **Ports** tab in the bottom panel and click the globe icon next to port 3000.

### 9. Stop the dev server when you're done

In the terminal, press **Ctrl+C** to stop the running site.

### 10. Optional: try the CMS locally

If you want to test the editing experience yourself before inviting editors:

1. With `npm run cms` running, open [http://localhost:3000/admin](http://localhost:3000/admin) in your browser.
2. In local mode, TinaCMS does not require a login. You'll land directly in the editor.
3. Edit something — a sermon, a staff bio — and refresh the public site to see the change.

Edits in local mode write directly to your `/content/` folder. They won't reach the live site until you commit and push the files.

For the production login experience (Google sign-in, real editors), see [Grant editor access](./08-grant-editor-access.md).

---

## What got changed

The setup script modified two files:

- **`content/site.json`** — your church's name, address, phone, email, service time.
- **`app/globals.css`** — the color palette values.

Plus it created:

- **`public/logo.svg`** — a placeholder logo with the church's initials. You'll replace this in [Customize branding](./05-customize-branding.md).

All other files (templates, components, page layouts) are unchanged. You can re-run `npm run setup` any time to update these basics without losing your customizations.

---

## Common Mistakes

- **"Setup script failed: Node.js 16 — we need 18 or newer."** Your Node.js version is too old. Reinstall the latest from [nodejs.org](https://nodejs.org/) (LTS version).
- **"npm: command not found."** Node.js isn't installed correctly. Close your terminal, open a new one, and try again. If that doesn't work, reinstall Node.js.
- **The dependencies install (Step 2) hangs forever.** Your internet connection is slow or blocked. Try a different network. As a last resort, delete the `node_modules/` folder and re-run `npm run setup`.
- **The placeholder logo shows the wrong initials.** You typed the wrong short name. Re-run `npm run setup` and provide the correct one — press Enter to accept defaults for everything else.
- **Colors didn't change after re-running setup with a different palette.** Stop the dev server (Ctrl+C) and start it again (`npm run start`). Browser caching may also be hiding the change — press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) to reload.

---

## What's next?

- [Customize branding](./05-customize-branding.md) — upload a real logo, fine-tune colors, change fonts.
- [Deploy to Vercel](./06-deploy-to-vercel.md) — put the site on the internet (you can also do this before customizing).

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20First-time%20Setup).*
