# Seed Data Checklist

This template ships with placeholder content for a fictional **Grace Community Church**. Everything in this file needs to be replaced before you launch.

You can either:

- Open `/admin` in your browser after running `npm run cms` (the **easy** path — TinaCMS UI), or
- Edit the files directly in your code editor (the **direct** path — useful for bulk changes).

Most editors should use the CMS. The "direct" file paths below are listed so developers know where each piece of content lives.

---

## 1. Core Identity — do these first

These ripple through the entire site. Get them right before customizing anything else.

| What | CMS location | Direct path | Placeholder |
|---|---|---|---|
| Church name | Site Settings → Church Info → Full Church Name | `content/site.json` `church.name` | `Grace Community Church` |
| Short name / acronym | Site Settings → Short Name | `content/site.json` `church.shortName` | `GCC` |
| Tagline | Site Settings → Tagline | `content/site.json` `church.tagline` | `A welcoming church in [Your Town]` |
| Address | Site Settings → Address | `content/site.json` `church.address` | `123 Main Street, Your Town, ST 12345` |
| Phone | Site Settings → Phone | `content/site.json` `church.phone` | `(555) 123-4567` |
| Email | Site Settings → Email | `content/site.json` `church.email` | `hello@example.church` |
| Office hours | Site Settings → Office Hours | `content/site.json` `church.officeHours` | `Mon–Thu, 9:00 AM – 4:00 PM` |
| Logo | Site Settings → Logo | `content/site.json` `church.logo` | `/images/placeholders/logo.svg` |
| Service time(s) | Site Settings → Services | `content/site.json` `church.services` | `Sundays at 10:00 AM` |
| Social media profiles | Site Settings → Social Media | `content/site.json` `church.social` | `[]` (empty — add one row per profile in the CMS) |

> **About social media:** `church.social` is a list. Add one entry per profile (Facebook, YouTube, Instagram, Twitter/X, LinkedIn, Twitch, or a Podcast feed) with its full URL. For platforms not in the curated list (TikTok, Spotify, Bluesky, your Substack), pick **Other / Website** and give it a label — it renders with a generic globe icon and the label you set. Entries with a blank URL are hidden — the social row never shows a broken or dead link. Multiple entries of the same platform are allowed.

> **Heads-up — placeholders are universal.** The phone `(555) 123-4567` and email `hello@example.church` are reserved/non-routable. Replace them before you ship: real visitors will see them and try to use them.

---

## 2. Homepage & About copy

| What | CMS location | Direct path | Placeholder |
|---|---|---|---|
| Homepage hero headline | Site Settings → Homepage → Headline | `content/site.json` `home.hero.headline` | `A welcoming community where you belong.` |
| About page hero headline | Site Settings → About Page → Headline | `content/site.json` `about.hero.headline` | `Following Jesus together — open to everyone.` |
| Our Story prose | Pages → Our Story | `content/story.md` | 4 short paragraphs about Grace Community Church |

The `/app/about/page.tsx` page also has a hardcoded version of the story prose inline — the CMS edits to `story.md` don't currently flow through. Fix the page to render the markdown, or update both places.

---

## 3. Staff & Elders

The template ships with **3 staff** and **1 elder** — clearly fictional names. Replace with your team.

### Staff (`/content/staff/`)

| File | Name | Role | Photo |
|---|---|---|---|
| `alex-morgan.md` | Pastor Alex Morgan | Lead Pastor | `/images/placeholders/staff/alex-morgan.svg` (AM initials avatar) |
| `jamie-rivera.md` | Jamie Rivera | Worship Director | `/images/placeholders/staff/jamie-rivera.svg` (JR avatar) |
| `pat-taylor.md` | Pat Taylor | Kids Ministry Director | `/images/placeholders/staff/pat-taylor.svg` (PT avatar) |

### Elders (`/content/elders/`)

| File | Name | Photo |
|---|---|---|
| `sam-chen.md` | Sam Chen | `/images/placeholders/staff/sam-chen.svg` (SC avatar) |

**Each bio currently ends with `[Replace with your team member's bio.]`** — find and replace that marker before launch.

The staff photos are initials-based SVG avatars on colored backgrounds. They're intentional placeholders — see "Photos" below for how to replace them with real headshots.

---

## 4. Ministries — 7 slots, all generic

The 7 ministry markdown files in `/content/ministries/` describe what each ministry typically does at a small church. Every description ends with `[Customize this description for your church.]` — replace those before launch.

| Slug | File | Title |
|---|---|---|
| `kids` | `content/ministries/kids.md` | Kids Ministry |
| `youth` | `content/ministries/youth.md` | Youth Ministry |
| `young-adults` | `content/ministries/young-adults.md` | Young Adults |
| `women` | `content/ministries/women.md` | Women's Ministry |
| `men` | `content/ministries/men.md` | Men's Ministry |
| `recovery` | `content/ministries/recovery.md` | Recovery Ministry |
| `missions` | `content/ministries/missions.md` | Missions |

Ministry images live at `/images/placeholders/ministry-{slug}.svg` (gradient placeholders). Replace with real photos via the CMS.

The display order is hardcoded in `/content/ministries.ts` (`SLUG_ORDER` constant). Reorder the array there, or rename ministries by:
1. Renaming the `.md` file (this changes the URL)
2. Updating `slug` in the frontmatter
3. Updating `SLUG_ORDER` in `content/ministries.ts`
4. Updating the nav in `/lib/church-info.ts` `nav` constant

---

## 5. Beliefs — generic, but verify alignment

`/content/beliefs.json` ships with 8 example doctrinal statements aligned with mainstream evangelical / non-denominational Christianity.

> **⚠️ Replace these with your church's actual doctrinal statements.** The JSON file has a `_note` field at the top reminding you of this. If your church belongs to a denomination, use their official statement of faith.

Editable via: **CMS → What We Believe → Doctrinal Statements**.

---

## 6. Events — 5 examples

`/content/events.json` has 5 recurring events:

1. Sunday Service (Sundays 10:00 AM)
2. Wednesday Bible Study (Wednesdays 7:00 PM)
3. Youth Night (Wednesdays 6:30 PM)
4. Women's Group (Tuesdays 9:30 AM)
5. Men's Breakfast (1st Saturday of the month, 8:00 AM)

Editable via: **CMS → Recurring Events**. Times, locations, and descriptions are all placeholder — update or delete entries to match your church's actual rhythm.

---

## 7. Sermons — 6 placeholder messages

`/content/sermons/` has 6 example sermons, all from a fictional series called **"Walking in Faith"** preached by **Pastor Alex Morgan** over the last 6 Sundays.

| Date | Title |
|---|---|
| 2026-04-05 | Walking in Faith — Part 1: Where Faith Begins |
| 2026-04-12 | Walking in Faith — Part 2: The God Who Sees |
| 2026-04-19 | Walking in Faith — Part 3: Faith and Doubt |
| 2026-04-26 | Walking in Faith — Part 4: Faith That Acts |
| 2026-05-03 | Walking in Faith — Part 5: Faith Under Pressure |
| 2026-05-10 | Walking in Faith — Part 6: Finishing Well |

Every sermon has `youtubeId: ""` and a `[Replace with your sermon description. TODO: add YouTube video ID and audio URL.]` placeholder. Adding the YouTube ID makes the embedded player work; until then the cards link to a placeholder thumbnail.

Editable via: **CMS → Sermons**.

---

## 8. Announcements — 3 examples

`/content/announcements/` has 3 placeholder announcements (welcome, fellowship invite, volunteer signups). Each ends with `[Customize this announcement.]`. Use the CMS to write your own — these are mostly there to demonstrate the format.

Editable via: **CMS → Announcements**.

---

## 9. Small Groups, Prayer Wall, Serve Roles

These three sections are **not yet in the CMS** — they live as TypeScript arrays in `/lib/`:

- `/lib/groups.ts` — 8 example small groups with generic neighborhoods and "Group Leader" placeholders.
- `/lib/prayer-wall.ts` — 5 example prayer requests (already generic — no church-specific content).
- `/lib/serve-roles.ts` — 8 example volunteer roles (greeter, kids check-in, worship team, etc.).

Edit these files directly until they're migrated to the CMS. The `[]` arrays are wired to `/connect/groups`, `/connect/pray`, and `/connect/serve`.

---

## 10. Photos

The template ships with **zero real photos**. Every image is either a gradient SVG placeholder (`/public/images/placeholders/*.svg`) or an initials-based avatar.

### Why no stock photos?

Stock-photo licensing on church websites is messy — even Unsplash's license has some restrictions, and using photos of real people (who didn't consent) for church staff cards is a non-starter. The SVG placeholders make it obvious which images haven't been replaced yet.

### How to replace placeholders with real photos

**Easy path (CMS):**

1. Run `npm run start` and `npm run cms` in two terminals.
2. Open http://localhost:3000/admin.
3. Edit a Staff, Ministry, or Sermon entry — use the image picker to upload.
4. Uploads land in `/public/images/uploads/` and the path is automatically saved to the markdown frontmatter.

**Direct path (filesystem):**

1. Drop your photo into `/public/images/` (or a subfolder like `/public/images/staff/`).
2. Update the relevant frontmatter or `content/site.json` field with the new path (e.g. `/images/staff/jane-smith.jpg`).

### Recommended photo specs

| Image | Aspect ratio | Min size | Notes |
|---|---|---|---|
| Homepage hero | 16:9 | 1600×900 | The /visit and /about pages also use this. |
| Plan-a-visit | 4:3 | 1200×900 | Used in the homepage "New Here" card and the /visit kids section. |
| Ministry hero | 4:5 | 900×1125 | The ministry card grid is portrait-oriented. |
| Staff headshot | Square | 600×600 | Cropped to a circle on the page. |
| Sermon thumbnail | 16:9 | 1280×720 | Same aspect as YouTube. |
| Logo | Wide or square | Either works | The site auto-scales — wordmark and icon logos both look fine. |

---

## 11. Online Giving

The giving system defaults to **Offline Only** so new adopters don't accidentally point donors at a placeholder account.

**Required before launch:** open the CMS → **Giving** and either:

- Configure your giving provider (Planning Center, Tithe.ly, Pushpay, Subsplash, Stripe, or Custom URL), **or**
- Keep it set to Offline Only and fill in your **Mailing Address** and **In-Person Giving Instructions**.

Also replace the bracketed placeholders in the **Giving FAQ** section with your church's real answers (especially the tax-deductibility and giving statement questions).

See [docs/for-editors/setup-online-giving.md](docs/for-editors/setup-online-giving.md) for a step-by-step walkthrough for each provider.

| What | CMS location | Direct path |
|---|---|---|
| Provider selection | Giving → Giving Provider | `content/giving.json` `provider` |
| Button label | Giving → Button Label | `content/giving.json` `callToAction` |
| Supporting message | Giving → Supporting Message | `content/giving.json` `supportingMessage` |
| Mailing address | Giving → Offline Giving → Mailing Address | `content/giving.json` `offlineGiving.mailingAddress` |
| In-person instructions | Giving → Offline Giving → In-Person Instructions | `content/giving.json` `offlineGiving.inPersonInstructions` |
| FAQ answers | Giving → Giving FAQ | `content/giving.json` `faq[]` |

---

## 12. Devotionals (optional feature)

The daily devotionals system is **off by default**. It requires setup before content appears on the site.

### Enable the feature

In the CMS: **Site Settings → Feature Flags → Daily Devotionals → toggle on**, then rebuild.

Or directly: set `"devotionals": true` in `content/site.json` under `"features"`.

Until enabled, `/devotionals` returns 404. The CMS "Reading Plans" collection is visible regardless — you can pre-populate plans before going live.

### Create your first plan

Two starter plans are in `content/reading-plans/_examples/`:

| File | Plan | Style | Length |
|---|---|---|---|
| `psalms-in-30-days.md` | Psalms 1–30 | Simple | 30 days |
| `gospels-in-90-days.md` | Matthew–John | SOAP | 90 days |

To use a starter plan:
1. Copy the file from `content/reading-plans/_examples/` to `content/reading-plans/`.
2. Update `startDate` and `endDate` to your intended schedule.
3. Open the plan in the CMS and verify the entries look correct.
4. Set `isActive: true` when ready to send emails.

### Configure the email sender

Before the email scheduler can send, fill in **Devotional Email Settings** in the CMS:

| Field | Placeholder in the template | What to replace with |
|---|---|---|
| Sender Name | `[Replace with your church name]` | Your church's full name |
| Sender Email | `[Replace with devotionals@yourchurch.org]` | A verified Resend sender address |
| Footer Text | `[Replace with your church name] · [Replace with your address] ...` | Your full mailing address + unsubscribe instructions |

The footer text is **required by CAN-SPAM law** — it must include your physical address.

### Bible translations

The example plans default to **WEB** (World English Bible — public domain, modern English). No API key needed.

To use ESV: add `NEXT_PUBLIC_ESV_API_KEY=your_key` to `.env.local` and change `defaultTranslation` in the plan frontmatter to `ESV`.
To use NIV/NLT/CSB/NKJV/NRSV: add `BIBLIA_API_KEY=your_key` to `.env.local`.

See `docs/for-developers/devotional-architecture.md` for the full translation table.

---

## 13. Weekly Digest (optional feature)

The weekly digest is **off by default**. It requires setup before it will send.

### Enable the feature

In the CMS: **Site Settings → Feature Flags → Weekly Digest → toggle on**, then rebuild.

Or directly: set `"digest": true` in `content/site.json` under `"features"`.

Until enabled, `/digest` returns 404.

### Configure the email sender

Fill in **Digest Email Settings** in the CMS:

| Field | Placeholder in the template | What to replace with |
|---|---|---|
| Sender Name | `Grace Community Church` | Your church's full name |
| Sender Email | `digest@example.church` | A verified Resend sender address |
| Footer Text | `[Replace with your church name and mailing address …]` | Your full mailing address + unsubscribe instructions |

The footer text is **required by CAN-SPAM law**.

### Writing the pastor's note

One note per week, via **Pastor's Notes (Digest)** in the CMS. Set status to **Ready** before the send time. After sending, mark it **Sent**.

An example note is in `content/digest-notes/_examples/2026-01-06.md` (status: draft — won't be sent).

If no note with status `ready` exists for a given week, the pastor's note section is omitted from that week's digest.

### Send schedule

Configure in **Digest Email Settings**: send day, hour, and timezone. The digest sends at one moment in the church's timezone (unlike devotionals, which send at each subscriber's local time).

---

## 14. CMS configuration

`/public/admin/config.yml` has a `backend.repo: kbennett2000/church-site-template` line that **must** be updated to point at your real GitHub repo before the production CMS will work. The local CMS (`npm run cms`) ignores this.

Also update:
- `site_url:` and `display_url:` — your deployed URL.
- `logo_url:` — the logo image path that shows in the CMS top bar.

---

## 14. The Sweep — find anything you missed

Before launching, run this from your project root:

```bash
grep -r "Grace Community" --include="*.md" --include="*.json" --include="*.tsx" --include="*.ts" .
grep -r "Your Town" --include="*.md" --include="*.json" --include="*.tsx" --include="*.ts" .
grep -r "555-123-4567\|555) 123-4567" --include="*.md" --include="*.json" --include="*.tsx" --include="*.ts" .
grep -r "example.church" --include="*.md" --include="*.json" --include="*.tsx" --include="*.ts" .
grep -r "Alex Morgan\|Jamie Rivera\|Pat Taylor\|Sam Chen" --include="*.md" --include="*.json" --include="*.tsx" --include="*.ts" .
grep -rn "\[Replace" .
grep -rn "\[Customize" .
grep -rn "TODO" --include="*.md" .
```

Each remaining match is a place you still need to update.
