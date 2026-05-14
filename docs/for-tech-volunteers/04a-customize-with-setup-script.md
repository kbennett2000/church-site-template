---
type: how-to
audience: tech-volunteer
time: 10 minutes
---

# Customize the template with `npm run setup`

**Who this is for:** Tech volunteers running `npm run setup` for the first time.
**What you'll accomplish:** Understand what each prompt is asking for and what gets written where, so you can give good answers and re-run the script confidently if you need to.
**You'll need first:**
- The template copied to your account and opened in Codespaces or cloned locally. See [Use this template](./03-use-this-template.md).
- About 5 minutes of focused time and the basic church info handy.

> **This doc is the conversational companion to [04-first-time-setup.md](./04-first-time-setup.md).** That doc walks through running the command. This one explains what each prompt means, why it's being asked, and how your answers shape the final site.

---

## Run the script

In your project folder, type:

```
npm run setup
```

After the dependencies install (1–3 minutes the first time), you'll see the script's welcome banner and a series of prompts. Each one is documented below.

---

## The prompts, one by one

### Step 1 — "Church name"

**What it asks:** the full official name of your church.

**Examples:** `Grace Community Church`, `First Baptist Church of Springfield`, `St. Andrew's Lutheran Church`.

**Where this goes:** `content/site.json` → `church.name`. Used in the site header (next to the logo), the footer, page metadata (browser tab title, social previews), and prose throughout the site.

**Tips:**
- Use the name you'd put on a sign, not an acronym.
- Include the denomination or distinctive word if it's part of your real name ("First **Baptist** Church"). The site is denomination-agnostic — your name leads.
- This can be changed any time later through the CMS (Site Settings → Full Church Name).

---

### Step 2 — "Short name / acronym"

**What it asks:** a 2–4 letter abbreviation of the church name.

**Examples:** `GCC` for Grace Community Church, `FBC` for First Baptist Church, `SAL` for St. Andrew's Lutheran.

The script auto-suggests one by taking the first letter of each major word. Press Enter to accept its suggestion or type your own.

**Where this goes:** `content/site.json` → `church.shortName`. Shown in two places:

1. The single letter inside the round "G" avatar that appears when no logo image is uploaded (uses the first letter of the short name).
2. Some compact UI like screenshots reduces to the short name when the full name doesn't fit.

**Tips:**
- The avatar circle uses just the **first letter** of this value, so "GCC" and "GC" produce the same look.
- If your church already uses an acronym in conversation ("FBC", "RHCC", "OBC"), use that — it's what people search for.

---

### Step 3 — "Street address", "City", "State", "ZIP"

**What it asks:** your physical church address.

**Examples:**
- Street: `123 Main Street`
- City: `Springfield`
- State: `IL` (two-letter postal code)
- ZIP: `62701`

**Where this goes:** `content/site.json` → `church.address.{street, city, state, zip}`. Used in:

- The site footer.
- The "Plan a Visit" page.
- The embedded Google Map on the visit page (auto-generated from the address).
- Page metadata (browser tab title at root, e.g. "Grace Community Church — Springfield, IL").
- Schema.org structured data (helps Google show your church in local search results).

**Tips:**
- Use the address you'd want on a business card. If you meet in a school auditorium, use that address — it's where visitors go on Sunday.
- The state must be a **two-letter postal code** — `IL` not `Illinois`, `CA` not `California`.
- This can be changed later in the CMS without code edits.

---

### Step 4 — "Phone number"

**What it asks:** the church's main phone number — usually the church office.

**Examples:** `(555) 123-4567`, `555-123-4567`. Either format works.

**Where this goes:** `content/site.json` → `church.phone`. Shown in the footer, contact page, and visit page. Auto-converted to a tap-to-dial `tel:` link.

**Tips:**
- Use a number a real human (or voicemail) answers. The footer puts this front and center.
- If your church doesn't have a dedicated phone, use the senior pastor's mobile or the office manager's number.

---

### Step 5 — "General email address"

**What it asks:** the church's main contact email — usually a shared inbox.

**Examples:** `hello@grace-community.org`, `office@firstbaptist.org`, `info@yourchurch.org`.

**Where this goes:** `content/site.json` → `church.email`. Shown in the footer, contact page, and as a "Contact via church office" fallback wherever a specific staff email is missing. Auto-converted to a `mailto:` link.

**Tips:**
- Don't use a personal inbox. Set up a shared one like `hello@` or `office@` so the role outlives the person.
- If you don't have a custom domain email yet, a free `firstbaptistspringfield@gmail.com` works for now — easy to update later.

---

### Step 6 — "Main Sunday service time"

**What it asks:** when your primary Sunday service starts.

**Examples:** `10:00 AM`, `9:30 AM`, `6:00 PM`.

**Where this goes:** `content/site.json` → `church.services[0]` (the first service entry, marked as `primary: true`). Shown in:

- The homepage hero ("Sundays · 10:00 AM").
- Page metadata description (so when someone shares the link, the time shows in the preview).
- The visit page.
- The footer.

**Tips:**
- Format: hour, colon, minutes, space, AM or PM. The script accepts variations, but `10:00 AM` is the safest.
- If you have **multiple Sunday services** (e.g. traditional + contemporary), the setup script captures only the primary one. After setup, open the CMS (Site Settings → Services) to add additional services. Mark exactly one as the primary — that's the one shown in the hero.
- If your main service isn't Sunday (Saturday vigil, Wednesday evening), still enter the day and time — you can adjust the day field in the CMS afterward.

---

### Step 7 — "Pick a color palette"

**What it asks:** one of four built-in palettes.

```
  1) Sandstone & Sage     warm cream + sage green + terracotta
  2) Mountain Morning     soft alpine + evergreen + brass
  3) High Desert          warm white + burnt sienna + olive
  4) Coastal              soft sand + deep navy + warm orange
```

**Where this goes:** `app/globals.css` → the CSS variables for `--primary`, `--accent`, `--background`, etc. These cascade through every Tailwind component on the site.

**Tips:**
- Don't agonize. You can change palettes by re-running the script, or fine-tune any of the 7 color tokens manually after setup. See [Customize branding](./05-customize-branding.md).
- If your church has a logo with a distinct color, pick the palette closest to that color — you can adjust the exact hex later.
- The four palettes are warm-leaning by design (church sites tend to feel cold when they go heavy on neutral grey). If you want cool tones, you'll fine-tune in [Customize branding](./05-customize-branding.md).

---

### Step 8 — "Saving your settings"

The script confirms what it wrote:

```
✓ Saved church info → content/site.json
✓ Applied "Sandstone & Sage" → app/globals.css
✓ Generated placeholder logo → public/images/placeholders/logo.svg
```

That's the end of the prompts.

---

## What got changed

The script modified exactly two files (and may have generated a third):

| File | What changed |
|---|---|
| `content/site.json` | Your church's name, short name, address, phone, email, primary service. |
| `app/globals.css` | The CSS variables for the palette you picked. |
| `public/images/placeholders/logo.svg` *(if not present)* | A placeholder logo with your church's initials. You'll replace this later with a real one. |

All other files (page layouts, components, content collections, ministry seed data) are unchanged. You can re-run `npm run setup` at any time to update the basics without losing other customizations — when prompted, press Enter to keep existing values.

---

## What's still placeholder after this script

A lot. The setup script handles the church's basic identity. The rest is content you'll fill in later:

- **Beliefs** — the template ships with 8 example doctrinal statements clearly marked for replacement. See `/content/beliefs.json` or the CMS (What We Believe).
- **Staff and elders** — 3 example staff and 1 example elder with placeholder bios. Edit via the CMS (Staff / Elders).
- **Ministries** — 7 example ministries with generic descriptions. Edit via the CMS (Ministries).
- **Sermons** — 6 example sermons. Replace via the CMS (Sermons).
- **Recurring events** — 5 example weekly/monthly events. Edit via the CMS (Recurring Events).
- **Story / About page** — placeholder prose. Edit via the CMS (Pages → Our Story).
- **Photos** — gradient SVG placeholders for hero, ministries, and staff avatars. Swap for real photos.

The full checklist of placeholder content is in [SEED_DATA.md](../../SEED_DATA.md) at the repo root.

---

## Re-running the script

You can re-run `npm run setup` any time:

- To change the church name or address.
- To switch color palettes.
- After someone else cloned your repo and needs the same setup applied locally.

When prompted with existing values in `[brackets]`, press Enter to keep them. Type new values for what you want to change.

The script is idempotent — running it twice with the same answers produces no changes.

---

## Common Mistakes

- **"Setup script failed: Node.js 16 — we need 18 or newer."** Reinstall the latest Node.js from [nodejs.org](https://nodejs.org/) (LTS version).
- **"npm: command not found."** Node.js isn't installed correctly. Close your terminal, open a new one, and try again. If that doesn't work, reinstall Node.js.
- **Colors didn't change after re-running with a different palette.** Stop the dev server (Ctrl+C) and start it again (`npm run start`). Browser caching may also be hiding the change — press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) to reload.
- **The placeholder logo shows the wrong initials.** Re-run `npm run setup` and provide the correct short name. Press Enter to accept defaults for everything else.

---

## What's next?

- [Customize branding](./05-customize-branding.md) — replace placeholder logo and photos with real ones, fine-tune colors, change fonts.
- [Deploy to Vercel](./06-deploy-to-vercel.md) — put the site on the internet.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new).*
