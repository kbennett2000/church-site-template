---
type: how-to
audience: tech-volunteer
time: 20 minutes
---

# Customize branding

**Who this is for:** Tech volunteers ready to replace the template's placeholder logos and photos with real ones, and to fine-tune colors and fonts.
**What you'll accomplish:** Have the church's real logo, real staff photos, a real hero photo, exact brand colors, and chosen typography on the site.
**You'll need first:**
- Setup complete. See [First-time setup](./04-first-time-setup.md).
- The church's logo as an image file (PNG or SVG, ideally with a transparent background).
- Headshots of staff and elders (one square photo each, ideally 600×600 or larger).
- A hero photo — a welcoming church exterior, an interior shot during a service, or a candid community moment.
- (Optional) Hex codes or names for the church's official brand colors.

---

## The placeholder situation

The template ships with **zero real photos** by design. Every image is one of:

- A **gradient SVG placeholder** (hero, plan-a-visit, ministry cards) — clearly fake so you can't accidentally ship them.
- An **initials-based SVG avatar** (staff and elders) — colored backgrounds with monogram letters, no real-person photos.
- An **icon-only logo** (a generic church symbol) — at `/public/images/placeholders/logo.svg`.

This avoids the two common ways a "free template" rots: copyrighted stock photos used past their license, and photos of strangers used as fake staff. You'll replace all of these with real assets.

---

## Steps

### 1. Replace the placeholder logo

By default, the site shows an avatar circle (the first letter of your church's short name) plus the church name text — no image file is loaded. To switch to a real logo image:

#### 1a. Prepare the logo file

Pick a format and shape:

- **SVG** is best — scales perfectly to any size, tiny file size, infinitely sharp.
- **PNG** with a transparent background is also fine. Aim for at least 400 × 400 pixels for a square logo, or 800 × 200 for a horizontal wordmark.

Both **square icon logos** and **wide wordmark logos** work — the site auto-scales to fit. If you have both, the wordmark usually looks better in the header.

If your logo is on a colored background, edit it to have a transparent background. [Photopea](https://www.photopea.com/) is a free browser-based editor that does this well. Budget **5–10 minutes** the first time you use it (learning where the magic-wand tool is, getting the edges clean) — it's faster on the second logo. Search YouTube for "Photopea remove background" if you want a walkthrough.

#### 1b. Add your logo to the project

Drop your file at `/public/images/logo.svg` (or `.png`). In Codespaces or VS Code, drag-and-drop the file from your desktop into the `public/images/` folder.

#### 1c. Point `site.json` at your logo

Open `content/site.json` and change:

```json
"logo": "",
```

to:

```json
"logo": "/images/logo.svg",
```

(Use the matching extension and filename for whatever you uploaded.)

Once `logo` is set to anything non-empty, the site replaces the avatar-circle-plus-text fallback in the header and footer with your logo image.

#### 1d. Verify

Run `npm run start` and **open** [http://localhost:3000](http://localhost:3000). The header and footer should now show your real logo.

> **Tip:** If you'd rather keep the avatar-circle look (especially before you have a finished logo), leave `logo` as `""` in site.json. The avatar circle uses the first letter of your short name on the primary color. It looks intentionally minimal and clean.

> **Warning:** Don't bake church-specific text *inside* the logo SVG file (e.g. a `<text>Grace Community</text>` element). The site's name comes from `content/site.json` — if your logo SVG has text baked in, it won't update when you change the church name. Use a logo with the name burned into the artwork as graphic design, or use the dynamic-text fallback.

---

### 2. Replace the placeholder staff avatars with real photos

The template ships with initials-based SVG avatars for the seed staff (Pastor Alex Morgan, Jamie Rivera, Pat Taylor) and elder (Sam Chen). Those are placeholders — you'll replace them with photos of your real team.

#### 2a. Photograph your team

If you don't have photos yet:

- **Use a phone camera with good light** — outdoor in shade, or near a window. Avoid harsh overhead lighting.
- **Square-ish framing**, headshot from the shoulders up. The site crops to a circle.
- **Natural expression** — a real smile beats a posed one.
- **Same lighting and background** for all staff if you can — makes the staff grid look cohesive.

You don't need a professional photographer. Phone photos in good light look great.

#### 2b. Crop and resize

Aim for **600 × 600 pixels** minimum, JPG or PNG. Larger is fine — the site won't load the whole file at full resolution.

Free crop tools:
- [Photopea](https://www.photopea.com/) (browser)
- macOS Preview (Tools → Crop)
- Windows Photos (Edit & Create → Crop)

#### 2c. Upload via the CMS (recommended) or place files manually

**Via the CMS** (once the site is deployed and CMS auth is set up):

1. Open `/admin` and sign in.
2. Click **Staff** → click a staff member → click the **Photo** field.
3. Use the **Upload** option to send the new photo. The CMS commits it to `/public/images/uploads/`.
4. Click **Publish**.

**Manually** (during initial setup, before CMS auth):

1. Save your photo as something like `/public/images/staff/jane-smith.jpg`.
2. Open the staff member's markdown file: `/content/staff/alex-morgan.md` (or whoever you're replacing).
3. Change the `photo:` line in the frontmatter:
   ```yaml
   photo: "/images/staff/jane-smith.jpg"
   ```
4. While you're there, update the `name`, `role`, and bio body.
5. Save the file.

Repeat for each staff member and elder. The placeholder SVGs (alex-morgan.svg, jamie-rivera.svg, etc.) can stay in `/public/images/placeholders/staff/` — they're inert once nothing points at them.

#### 2d. Add or remove staff entries

To remove a placeholder staff member entirely, delete their markdown file from `/content/staff/`. To add a new one, copy an existing file (e.g. `alex-morgan.md`), rename it (`/content/staff/new-name.md`), and edit the contents.

The display order is controlled by the `order: N` field in each markdown file — lower numbers appear first.

> **Tip:** Don't have all the staff photos yet? Leave the placeholder avatars in place. Staff with initials avatars look intentional, not broken — much better than a single "missing image" icon next to real photos. Replace them as you get photos.

---

### 3. Swap the placeholder hero photo for a real church photo

The homepage and several internal pages use a gradient SVG hero placeholder. A real photo here is the single biggest visual upgrade you can make.

#### 3a. Pick or take the photo

Good hero photo candidates, ordered by how compelling they typically are:

1. **Church exterior** — your sign, your front door, your building. Anchors the "this is a real place" feeling.
2. **A welcoming community moment** — people greeting each other after a service, a small group around a table. The best ones don't show faces clearly (avoiding consent issues).
3. **Interior during worship** — sanctuary lit warmly, congregation visible from the back. Avoid harsh shots from the front.
4. **A landscape near your church** — only if it's iconic for your area and you can't get a great building shot.

Avoid:
- Empty sanctuaries at high noon (cold and lifeless).
- Stock photos of strangers worshipping (uncanny and possibly unlicensed).
- Photos of identifiable individuals you don't have permission to feature publicly.

#### 3b. Aspect ratio and resolution

The hero stretches to fill its container with `object-fit: cover` — the site crops as needed. For best results:

- **16:9 aspect ratio** (e.g. 1920 × 1080, 1600 × 900, or larger).
- **At least 1600 pixels wide.** Larger is fine; the browser scales down.
- **JPG** at ~80% quality is the right format for photos (smaller files than PNG).
- Aim for **under 500 KB** per photo. Use [tinypng.com](https://tinypng.com/) to compress.

#### 3c. Upload and reference

Save the photo at `/public/images/hero.jpg` (or any filename you like).

Then update the references. The hero photo is used in several files — search for `/images/placeholders/hero.svg` in the codebase:

```bash
grep -rn "/images/placeholders/hero.svg" app/ components/
```

You'll find references in:

- `components/sections/hero.tsx` (the homepage hero)
- `app/about/page.tsx` (the about-page hero)
- `app/visit/page.tsx` (the visit-page hero)
- `content/sermons.ts` (the default sermon thumbnail)

Replace `/images/placeholders/hero.svg` with `/images/hero.jpg` in each file you want updated. You can use one photo for all of them or different photos for each page.

#### 3d. (Optional) Add ministry-specific photos

The template also ships gradient placeholders for each ministry (`/public/images/placeholders/ministry-{slug}.svg`). Replace these the same way — drop a photo at `/public/images/ministries/kids.jpg`, then update the `image:` field in `/content/ministries/kids.md`:

```yaml
image: "/images/ministries/kids.jpg"
```

Same pattern for `/content/ministries/youth.md`, `/content/ministries/women.md`, etc.

---

### 4. Fine-tune colors beyond the four setup palettes

#### The four palettes at a glance

If you ran `npm run setup`, you picked one of these. Here's what each one actually looks like:

| Palette | Background | Primary | Accent |
|---|---|---|---|
| **Sandstone & Sage** (default) | <img src="https://placehold.co/40x24/F8F2E8/F8F2E8.png" alt="warm cream" /> `#F8F2E8` warm cream | <img src="https://placehold.co/40x24/475C49/475C49.png" alt="deep sage" /> `#475C49` deep sage | <img src="https://placehold.co/40x24/BB5A37/BB5A37.png" alt="terracotta" /> `#BB5A37` terracotta |
| **Mountain Morning** | <img src="https://placehold.co/40x24/F6F1E4/F6F1E4.png" alt="soft alpine" /> `#F6F1E4` soft alpine | <img src="https://placehold.co/40x24/2F4A3A/2F4A3A.png" alt="evergreen" /> `#2F4A3A` evergreen | <img src="https://placehold.co/40x24/B8842F/B8842F.png" alt="brass" /> `#B8842F` brass |
| **High Desert** | <img src="https://placehold.co/40x24/FAF3E5/FAF3E5.png" alt="warm white" /> `#FAF3E5` warm white | <img src="https://placehold.co/40x24/A24A2A/A24A2A.png" alt="burnt sienna" /> `#A24A2A` burnt sienna | <img src="https://placehold.co/40x24/7A7B3F/7A7B3F.png" alt="olive" /> `#7A7B3F` olive |
| **Coastal** | <img src="https://placehold.co/40x24/F8F3E8/F8F3E8.png" alt="soft sand" /> `#F8F3E8` soft sand | <img src="https://placehold.co/40x24/2A4963/2A4963.png" alt="deep navy" /> `#2A4963` deep navy | <img src="https://placehold.co/40x24/C47438/C47438.png" alt="warm orange" /> `#C47438` warm orange |

> If the swatch images don't load, the hex codes alongside each one tell the same story — drop the hex into any color picker to see the shade.

> **Code editing starts here.** Everything below this point involves opening real code files (CSS, TypeScript, JSX) and changing values inside them. If your church's brand colors are *close* to one of the four palettes above, **stop here — that's good enough**. Push the fine-tuning to a developer or skip it entirely.
>
> If you do want to proceed, the changes are small and reversible (every edit is in git history — you can roll back).

To match your church's exact brand colors, edit the CSS variables in `app/globals.css`.

#### 4a. Understand the color system

The site uses **semantic color tokens** — names like `primary`, `accent`, and `background` instead of specific hex codes. This means a color change in one place flows automatically to every component that uses it.

The variables are HSL values (Hue, Saturation, Lightness). Each line in `globals.css` looks like:

```css
--primary: 120 14% 32%;
--accent: 15 55% 47%;
--background: 38 30% 96%;
```

The three numbers are:
- **Hue** (0-360): the color on the rainbow. 0 = red, 60 = yellow, 120 = green, 180 = cyan, 240 = blue, 300 = magenta.
- **Saturation** (0-100%): how vivid. 0% = grey, 100% = pure.
- **Lightness** (0-100%): how light. 0% = black, 50% = pure, 100% = white.

#### 4b. Pick your HSL values

Use a color picker that gives HSL output:

- [hslpicker.com](https://hslpicker.com/) — drag, get HSL.
- [coolors.co](https://coolors.co/) — generate a full palette.
- Most design tools (Figma, Photoshop) can switch between RGB and HSL.

For each color you want to change, write down the three HSL values.

#### 4c. Open `app/globals.css`

The file looks like this (excerpt):

```css
@layer base {
  :root {
    --background: 38 30% 96%;     /* page background */
    --foreground: 30 12% 15%;     /* main text color */

    --primary: 120 14% 32%;       /* main brand color — buttons, links */
    --primary-foreground: 38 30% 96%;  /* text on primary backgrounds */

    --accent: 15 55% 47%;         /* highlight color — CTAs, badges */
    --accent-foreground: 38 30% 96%;   /* text on accent backgrounds */

    --secondary: 36 24% 90%;      /* subtle background — cards, sections */
    --muted: 36 24% 90%;          /* even subtler background */
    --border: 35 20% 84%;         /* thin lines and borders */

    --ring: 120 14% 32%;          /* focus outline — usually matches primary */

    --radius: 0.625rem;           /* corner roundness */
  }
}
```

#### 4d. Edit the values you want to change

For example, to change the primary color to a deep navy:

```css
--primary: 215 60% 25%;       /* deep navy */
--primary-foreground: 0 0% 100%;  /* white text on navy */
--ring: 215 60% 25%;          /* match primary */
```

**Save** the file.

#### 4e. Preview

Run `npm run start` (or refresh the dev server if it's running). Buttons, links, and accent areas immediately reflect the new color.

> **Tip:** Always update both the color AND its `-foreground` partner. The `-foreground` is the text color shown on top of that color — it needs enough contrast to read.

> **Warning:** Don't put hex codes (`#ff0000`) directly into `globals.css`. Stick with HSL triplets — that's what the rest of the site expects. If you've only got a hex code, convert it to HSL at [hslpicker.com](https://hslpicker.com/).

---

### 5. Change fonts

By default, the site uses:

- **Inter** — modern sans-serif, used for body text and UI.
- **Fraunces** — friendly serif, used for headings (h1, h2, h3, h4).

Both load from [Google Fonts](https://fonts.google.com/) via Next.js.

#### 5a. Pick new fonts

Browse [fonts.google.com](https://fonts.google.com/) and pick:
- One **sans-serif** for body (recommended: Inter, Source Sans, Roboto, DM Sans, Nunito).
- One **serif** for headings (recommended: Fraunces, Lora, Merriweather, Source Serif, EB Garamond).

Or use the same font for both — that's fine too.

#### 5b. Open `app/layout.tsx`

Near the top of the file, you'll find the font imports. They look like this:

```ts
import { Inter, Fraunces } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});
```

#### 5c. Replace with the new font names

For example, swapping Fraunces for Lora:

```ts
import { Inter, Lora } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-fraunces",  // keep the variable name so other files don't break
});
```

> **Tip:** Keep the variable names (`--font-inter` and `--font-fraunces`) the same even when swapping fonts. Tailwind config and CSS reference these names; changing them would mean editing more files. The font *value* changes; the *variable* doesn't.

#### 5d. Preview

Run `npm run start` and refresh — the new font should appear on headings.

---

### 6. Update favicon (the little icon in browser tabs)

The favicon lives at `app/favicon.ico`. To replace it:

#### 6a. Convert your logo to an ICO file

Use a free converter like [favicon.io](https://favicon.io/) — upload your logo, download the ICO file.

#### 6b. Replace `app/favicon.ico`

Drag the new file into `app/`, overwriting the existing favicon.

#### 6c. Hard-refresh to see the change

Browsers cache favicons aggressively. **Press** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) to see the new icon.

---

## Which files actually changed

After all this, you'll have edited:

- `content/site.json` — pointed `logo` at your logo image.
- `public/images/logo.svg` (or `.png`) — the church's real logo.
- `public/images/staff/*.jpg` — real staff photos.
- `public/images/hero.jpg` (and any per-page hero variations) — real church photos.
- `public/images/ministries/*.jpg` (optional) — real ministry photos.
- `content/staff/*.md` — pointed the `photo:` frontmatter at the new photos.
- `content/ministries/*.md` — same.
- `app/globals.css` — color tokens for the church's brand.
- `app/layout.tsx` — font imports if you changed fonts.
- `app/favicon.ico` — the browser-tab icon.
- `components/sections/hero.tsx`, `app/about/page.tsx`, `app/visit/page.tsx`, `content/sermons.ts` — hero image references (if you swapped the hero photo).

These are the only files that drive site-wide branding. Everything else is content (editable through the CMS) or layout (which you generally shouldn't need to touch).

---

## Common Mistakes

- **Colors look right in code but didn't change on the site.** The dev server may need to restart. Stop it with Ctrl+C and run `npm run start` again. Then hard-refresh the browser (Ctrl+Shift+R).
- **The new logo looks pixelated.** Use a higher-resolution PNG (400×400+) or, ideally, an SVG. SVG scales to any size without losing quality.
- **The new logo only shows the avatar circle, not the image.** You added the file to `/public/images/` but didn't update `content/site.json` to point at it. The `logo` field must be non-empty for the image branch to render.
- **The placeholder text "Grace Community" appears inside the logo.** You kept the old text-based placeholder logo SVG. Replace `/public/images/placeholders/logo.svg` (or point `site.json` elsewhere). Don't bake church-name text into a logo SVG — let the dynamic header render it.
- **Staff photos are different sizes / aspect ratios.** Crop all photos to the same square aspect ratio (1:1) before uploading. The site crops to a circle either way, but consistent input avoids inconsistent crops.
- **Text is unreadable on the primary color (white on light-yellow, etc.).** Your `-foreground` value doesn't have enough contrast against the background color. Use [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) to verify a 4.5:1 contrast ratio.
- **Hex codes in CSS don't work.** The site uses HSL triplets without `hsl()` wrappers — Tailwind composes them automatically. Convert hex to HSL.

---

## What's next?

- [Deploy to Vercel](./06-deploy-to-vercel.md) — put the site on the internet.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new).*
