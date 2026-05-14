<!--
  Case study: Majestic View Church (the inaugural case study for the Church Site Template).

  Screenshots needed (TODO — capture and commit to /docs/case-studies/screenshots/mvc/):
  - mvc-old-homepage.png       — the old WordPress homepage
  - mvc-old-mobile.png         — the old WordPress homepage on a phone (375px wide)
  - mvc-old-events.png         — the old events / calendar page
  - mvc-new-homepage.png       — the new template-based homepage
  - mvc-new-mobile.png         — the new homepage on a phone (375px wide)
  - mvc-new-calendar.png       — the new calendar with month view
  - mvc-cms-dashboard.png      — the Decap CMS dashboard as MVC editors see it

  Quote needed: a short testimonial from a member of MVC's pastoral or admin staff about
  the transition. Suggested prompt: "What's one thing the new site lets you do that you
  couldn't do before?" Aim for 2–3 sentences. Replace the TODO block below.
-->

---
type: case-study
audience: all
time: 5 minutes
---

# Case study: Majestic View Church

> The inaugural case study for the Church Site Template. MVC was the prototype that became this template.

**Church:** Majestic View Church
**Location:** Kiowa, Colorado (Elbert County, USA)
**Size:** ~150–200 weekly attendance
**Tradition:** Evangelical, non-denominational, independent Baptist heritage
**Live site:** [mvckiowa.com](https://mvckiowa.com/)
**Adopted:** 2026

---

## Background

Majestic View Church was planted in 1996 in Kiowa, Colorado — a small town about 50 miles southeast of Denver in Elbert County. The congregation describes itself as a "small-town church with a wide-open welcome" and runs the typical complement of programs you'd find at a healthy small church: Sunday worship at 9:00 AM, Awana for kids on Wednesday nights, a women's Bible study, a monthly men's breakfast at the American Legion Hall in Elizabeth, a young adults group, and an Overcomers (Christ-centered recovery) ministry.

By 2025, MVC had outgrown its existing website — a long-running WordPress install that had served the congregation well for several years but was getting hard to maintain. The site looked dated on mobile (where most visitors arrived), edits required logging into a CMS that hadn't been updated in years, and the staff member who'd originally set it up had moved on. The pastoral team wanted a fresh start.

---

## The starting point

The old WordPress site looked like this:

![Old MVC homepage — WordPress](./screenshots/mvc/mvc-old-homepage.png)
<!-- TODO: Capture screenshot of the old WordPress homepage and commit to /docs/case-studies/screenshots/mvc/mvc-old-homepage.png -->

On mobile (where ~70% of visitors arrived):

![Old MVC site on mobile](./screenshots/mvc/mvc-old-mobile.png)
<!-- TODO: Capture screenshot at 375px wide -->

The events page:

![Old MVC events page](./screenshots/mvc/mvc-old-events.png)
<!-- TODO: Capture screenshot of the old calendar / events page -->

Specific pain points the team called out:

- **Mobile experience.** Layout broke at narrow widths; service time and address weren't visible without scrolling.
- **Editing friction.** Updating a sermon meant logging into WordPress, hunting through the admin, and dealing with a deprecated rich-text editor. A typo could nuke the formatting.
- **No sermon archive.** Sermons were posted to YouTube but not catalogued on the site. Visitors had no way to find past series.
- **Visitor friction.** The "Plan a Visit" page was three clicks deep and didn't have a phone-tappable phone number.
- **Hosting cost.** WordPress hosting was ~$15/month with a managed provider — small money, but real.
- **Staff turnover risk.** No one currently on staff felt confident maintaining the WordPress install if anything broke.

---

## What we built

The new site is a fresh Next.js application with Decap CMS as the editor — what eventually became the [Church Site Template](https://github.com/kbennett2000/church-site-template).

![New MVC homepage](./screenshots/mvc/mvc-new-homepage.png)
<!-- TODO: Capture screenshot of the new homepage -->

On mobile:

![New MVC site on mobile](./screenshots/mvc/mvc-new-mobile.png)
<!-- TODO: Capture screenshot at 375px wide -->

The new calendar:

![New MVC calendar](./screenshots/mvc/mvc-new-calendar.png)
<!-- TODO: Capture screenshot of the new month-view calendar -->

The Decap CMS dashboard, as MVC editors see it:

![MVC CMS dashboard](./screenshots/mvc/mvc-cms-dashboard.png)
<!-- TODO: Capture screenshot of the Decap CMS dashboard -->

---

## What changed and why

### Mobile-first design

The old site was a desktop-first layout with mobile responsiveness bolted on. The new site flips that: every component is designed for the 375-pixel screen first, then scales up. The biggest visible win is the homepage — service time, address, and "Plan Your Visit" CTA all sit above the fold on a phone.

### A real sermon archive

Sermons now live on the `/watch` page with filters by series, speaker, scripture, and book of the Bible. Each sermon has its own URL, embeds the YouTube video, links to audio if available, and can carry notes (PDF). Twelve seasons of sermons came over from the YouTube channel into the new structure during the migration; new ones go in via the CMS in about 90 seconds each.

### Editorial workflow

Every edit in the new CMS becomes a pull request that the tech volunteer reviews before merging. This was non-negotiable for MVC — the staff didn't want a typo to nuke the homepage at 11:55 AM on a Sunday morning. The PR-based flow catches typos and broken images before they're live, and gives a complete audit trail.

### Visitor-funnel improvements

- **Plan-a-visit page** with the timeline of a typical Sunday morning (8:45 doors open, 9:00 worship begins, etc.).
- **Tap-to-call phone number** in the header and footer.
- **Tap-to-map address** linking to Google Maps directions.
- **First-time visitor form** — captures name and Sunday date so MVC's welcome team can greet visitors by name.

### A real small-groups finder

Replaced the old static list with a filter-by-day-and-life-stage finder. Groups self-describe in the CMS; visitors filter to what fits.

### Recovery ministry, plainly named

The site features MVC's recovery ministry (Overcomers Outreach — a 12-step Christ-centered support group) prominently. The page is clear about what it is, when it meets, and who can come — the most quietly powerful ministry at the church now matches its visibility on the website.

### Cost went to zero

Vercel's free tier handles MVC's traffic comfortably (thousands of weekly visitors before it'd hit any limit). GitHub hosts the content for free. The only ongoing cost is the domain renewal — ~$12/year. Down from ~$180/year on the old WordPress host.

---

## What was harder than expected

A few things took longer than the team initially budgeted:

- **Photo collection.** Getting good photos of staff, ministries, and the building took multiple weekends. The team eventually ran a "photo Sunday" between services and got most of what they needed in one session.
- **Doctrinal statement update.** The old site's beliefs page hadn't been touched in 8+ years. The team used the migration as an excuse to revisit the language with the elder board — useful in itself, but added 2 weeks to the timeline.
- **Migrating sermon metadata.** Twelve seasons of sermons existed as YouTube videos with inconsistent titles and descriptions. Normalizing series names, scripture references, and dates took about 4 hours of one person's time.

None of these are template limitations — they're the fixed costs of taking a church's web presence seriously.

---

## What the team says

<!--
  TODO: Collect a quote from MVC pastoral or admin staff. Aim for 2–3 sentences answering:
  "What's one thing the new site lets you do that you couldn't do before?"
  Replace the placeholder block below once collected.
-->

> *[Quote pending — to be collected from a member of MVC's pastoral or administrative staff. Likely candidates: the lead pastor, the office manager, or whoever currently keeps the site updated.]*
>
> — *[Name and role pending]*

---

## Lessons for adopting churches

A few things MVC's experience suggests for other small churches considering this template:

1. **Carve out one weekend afternoon for photos.** Phone-camera photos in good outdoor light beat stock photos every time. Don't ship with placeholder avatars — but do ship even if you only have half the photos. You can add the rest as you go.
2. **Use the migration as a doctrinal audit.** When was the last time your beliefs page was reviewed? The migration is a natural moment to ask.
3. **Set up the editorial workflow before you need it.** The PR-based review catches typos, but it also catches the more dangerous category: well-meaning edits that change meaning. Don't disable it to "save time."
4. **Start the sermon archive even if it's empty.** Future-you will be glad it's there. New sermons take 90 seconds to add; building up a year's worth in arrears is a Saturday.
5. **Adopt the template, don't fork it.** Use the "Use this template" button — it gives you a clean, independent repo with no fork relationship. You'll diverge from the template within a week anyway.

---

## Links

- **Live site:** [mvckiowa.com](https://mvckiowa.com/)
- **Template repo:** [github.com/kbennett2000/church-site-template](https://github.com/kbennett2000/church-site-template)
- **All case studies:** [docs/case-studies/](./)
- **About the template:** [README.md](../../README.md)

---

*Want your church featured here? See [the case-studies README](./README.md) for the submission template.*
