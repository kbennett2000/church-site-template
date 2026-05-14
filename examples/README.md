# Examples — alternate content configurations

The template ships with generic seed data ("Grace Community Church" — a fictional placeholder). These examples show what the same template looks like once a real church adopts and customizes it.

Each example is a complete drop-in replacement for the data files under [`/content/`](../content/). The TypeScript loader files (`content/*.ts`) are identical to the main template — you don't replace those, only the JSON and Markdown.

## Available examples

### 🌾 [`small-rural-church/`](./small-rural-church/) — Prairie Community Church

A ~60-person rural Nebraska church with simple programming:

- **One Sunday service** at 9 AM, plus a Wednesday Bible study and monthly potluck.
- **Four ministries** — Kids' Sunday School, Men's Breakfast, Women's Bible Study, Missions. (No youth ministry, no recovery, no young adults — the rural demographic doesn't always need all seven slots.)
- **One pastor**, two elders, two example sermons.
- **Tone:** plain, neighborly, anchored in long-standing relationships.

Read this example if your church has fewer than 100 people, simple programming, and a tone closer to "you'll know everyone by name" than "we have a program for every life stage."

### 🏘️ [`suburban-family-church/`](./suburban-family-church/) — Oakbridge Community Church

A ~400-person suburban Texas church with full family-tier programming:

- **Two Sunday services** (Traditional 9 AM, Contemporary 11 AM), Wednesday discipleship night, Friday youth night, weekly women's and men's groups.
- **All seven ministry slots** — Kids (age-tiered: Nursery, Preschool, Lower/Upper Elementary), Youth (middle/high), Young Adults, Women, Men, Recovery (Celebrate Recovery), Missions.
- **Five staff** (Lead Pastor, Worship Pastor, Kids Director, Youth Pastor, Office Admin), three elders.
- **Tone:** organized, programmed, family-focused — built around "there's a place for every age and stage."

Read this example if your church has more than 200 people, age-tiered programming, multiple Sunday services, and a tone closer to "well-resourced family ministry" than "small-town simple."

---

## How to use an example

You can either **browse the files to see what realistic content looks like**, or **swap one in wholesale** to preview how the site renders with that data.

### Option 1: Just browse

Open the files in `/examples/<name>/content/` directly. You'll see real-feeling site copy, ministry descriptions, beliefs statements, and event configurations. Reading them gives you a model for writing your own.

### Option 2: Swap one in temporarily

To see the site render with one of these examples:

1. **Back up your existing content folder first.** From the project root:
   ```bash
   mv content content.backup
   ```
2. **Copy the example's content folder over:**
   ```bash
   cp -r examples/small-rural-church/content ./content
   ```
   (Or `suburban-family-church`, whichever you want to try.)
3. **Copy the loader files back.** The examples don't ship the TypeScript loaders — they're identical to the main template. Copy them back from your backup:
   ```bash
   cp content.backup/*.ts content/
   ```
4. **Run the site** with `npm run start` and visit `http://localhost:3000` to see how it looks.

To restore your original content:

```bash
rm -rf content
mv content.backup content
```

### Option 3 (Windows PowerShell)

Same steps, different syntax:

```powershell
Move-Item content content.backup
Copy-Item -Recurse examples\small-rural-church\content content
Copy-Item content.backup\*.ts content\
# When done:
Remove-Item -Recurse -Force content
Move-Item content.backup content
```

---

## What's NOT in the examples

To keep file sizes reasonable, each example contains:

- ✅ `site.json` (church identity + service times)
- ✅ `story.md` (about-page prose)
- ✅ `beliefs.json` (doctrinal statements)
- ✅ `events.json` (recurring events)
- ✅ A representative subset of ministries, staff, elders, sermons, and announcements

But **NOT**:

- ❌ The TypeScript loader files (`content/*.ts`) — these are identical to the main template.
- ❌ Full sermon archives (just 2 example sermons per example church).
- ❌ Real photos — the examples use the same SVG placeholders as the main template.
- ❌ Logo files — both examples leave `logo: ""` to use the dynamic-text header fallback.

---

## Heads-up: ministry-slug ordering

The number of ministries differs between examples:

- The main template ships 7 ministries (Kids, Youth, Young Adults, Women, Men, Recovery, Missions).
- The `small-rural-church` example ships 4 (Kids, Men, Women, Missions).
- The `suburban-family-church` example ships 7 (same slugs as the main template).

If you swap in the small-rural-church example, the `SLUG_ORDER` array in [`content/ministries.ts`](../content/ministries.ts) will still reference the 7 default slugs. Slugs that don't have a matching `.md` file are simply skipped, so the site won't break — but you may want to trim `SLUG_ORDER` to match.

Edit `SLUG_ORDER` to keep only the slugs you actually use:

```ts
const SLUG_ORDER = [
  "kids",
  "men",
  "women",
  "missions",
];
```

And update the navigation in [`lib/church-info.ts`](../lib/church-info.ts) the same way — keep only the ministry nav entries you actually have. See [`docs/for-tech-volunteers/10-customize-deeper.md`](../docs/for-tech-volunteers/10-customize-deeper.md) for the full walkthrough.

---

## Got your own?

Once your church has been running on the template for a few months, consider adding your own example to this folder via pull request. Same structure: a `content/` subfolder with the data files, a short description above. We may include selected examples in the next release.

For full case studies (not just data), see [`docs/case-studies/`](../docs/case-studies/).
