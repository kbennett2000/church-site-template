---
type: explanation
audience: tech-volunteer
time: 5 minutes
---

# Overview: adopting the template for your church

**Who this is for:** The semi-technical person at the church doing the initial template adoption and setup.
**What you'll accomplish:** Understand the whole journey before you start clicking, so nothing surprises you.
**You'll need first:** Nothing — this is a good starting point.

---

## What you're about to do

You're adopting a template for your church. Here's the whole journey:

1. **Make your own copy of the template repo** on GitHub (one click — the green "Use this template" button).
2. **Open it in your browser** (Codespaces) or on your computer (clone + Node.js).
3. **Run the setup script** — answers a handful of questions (church name, address, service time, colors) and writes them in.
4. **Customize the look** — drop in your church's logo and real photos, optionally fine-tune the colors.
5. **Deploy to Vercel** — free hosting that goes live in about 2 minutes.
6. **(Optional) Connect your domain** — point `yourchurch.org` at the new site.
7. **Invite your editors** — the people who'll keep the site updated long-term.

Once you've done all that, the editors at your church (pastor, secretary, ministry leaders) handle the day-to-day. You step back to a small monthly role: approving their edits as they come in.

---

## What the template gives you

You're not building a website from scratch. You're inheriting a complete, polished, mobile-first church website with:

- A modern, fast public site (Next.js).
- A browser-based editor (TinaCMS) so non-technical staff can update content — staff sign in with Google, no GitHub account required.
- Free hosting (Vercel) with automatic rebuilds whenever content changes.
- Wired-up forms: visit RSVPs, prayer requests, contact messages, and newsletter signups land directly in the church's inbox via Resend.

You'll customize the content, branding, and a few photos. You will not be writing code unless you want to.

---

## The whole journey, in order

| Step | What you do | Time | Doc |
| --- | --- | --- | --- |
| 1 | Install Node.js and Git — or skip with Codespaces | 0–15 min | [Prerequisites](./02-prerequisites.md) |
| 2 | Use "Use this template" to create your own repo | 2 min | [Use this template](./03-use-this-template.md) |
| 3 | Run the first-time setup script | 5 min | [First-time setup](./04-first-time-setup.md) |
| 3a | Walk through the setup script's prompts | (part of step 3) | [Customize with the setup script](./04a-customize-with-setup-script.md) |
| 4 | Customize branding — logo, photos, colors, fonts | 10–20 min | [Customize branding](./05-customize-branding.md) |
| 5 | Deploy to Vercel | 10 min | [Deploy to Vercel](./06-deploy-to-vercel.md) |
| 6 | Connect your custom domain (optional) | 10 min | [Connect domain](./07-connect-domain.md) |
| 7 | Invite editors and set up CMS authentication | 10 min | [Grant editor access](./08-grant-editor-access.md) |
| 8 | Routine maintenance (monthly) | 10 min/month | [Maintenance](./09-maintenance.md) |

**How long this actually takes:**

- **First-time tech volunteer, end-to-end:** plan for **roughly 90 minutes**. That includes installing Node.js (10–15 min) or picking Codespaces, finding the TinaCloud/Vercel credentials your first time, and waiting on DNS propagation for the custom domain (5–60 min, mostly waiting, not working). If anything goes sideways, allow a full afternoon.
- **Hands-on time only** (skipping installs and waits): **about 30 minutes.** That's the "steady-state" number you'll see in marketing copy — accurate if you've done this before, or if you skip the custom domain on day one and add it later.
- **First content pass** (replacing placeholder staff bios, ministries, beliefs, real photos): **a separate weekend afternoon.** See [SEED_DATA.md](../../SEED_DATA.md) for the full checklist.

The 30-minute number isn't a lie — it's the time the actual steps take with no waiting and no first-time fumbling. But on a real Saturday morning, with installs and DNS waits and looking-up-where-the-credentials-live, plan for 90 minutes and feel good if you finish faster.

> **Tip:** If anything goes wrong along the way, [troubleshooting](./troubleshooting.md) covers the common issues.

---

## What you'll have at the end

- **A live website** at a `*.vercel.app` URL (free) — and at your own domain like `yourchurch.org` if you set that up.
- **A CMS editor** at `https://yourchurch.org/admin/` where editors log in with GitHub.
- **A GitHub repository** that stores all the website's content. Every change is tracked.
- **Automatic rebuilds** — every time an editor publishes a change (and you approve it), the site rebuilds and goes live within a couple of minutes.

The church owns all of it. No vendor lock-in, no per-seat licensing, no contract. If you ever want to move hosts or even abandon this template, your content comes with you.

---

## Why each step exists (in plain English)

If you're the kind of person who wants to understand before you start clicking — here's the "why" for each step.

**Install Node.js and Git** — Node.js is the engine that builds and previews the site on your computer. Git is the version-control tool that talks to GitHub. **Or** you can skip both by using GitHub Codespaces, which runs everything in your browser.

**Use "Use this template"** — GitHub gives you a clean, independent copy of the template repo under your account. Unlike a fork, there's no link back to the original — your repo is genuinely your church's, with its own history. (Forking is still an option if you want to stay in sync with template updates, but most churches won't need that.)

**Run the setup script** — A friendly prompt that asks for the church's name, address, service time, and color scheme. It writes those into the right files so you don't have to.

**Customize branding** — Upload the church's logo, swap placeholder images for real photos, fine-tune colors. The setup script gives you four palettes; this step lets you go beyond those.

**Deploy to Vercel** — Vercel reads your GitHub repository, builds the site, and makes it accessible on the internet. Free for small-church traffic. The site rebuilds automatically every time content changes.

**Connect your domain** — Point `yourchurch.org` at Vercel by adding two DNS records at your domain registrar (the place you bought the domain).

**Grant editor access** — Invite editors to TinaCloud so they can log in with their Google account and manage content directly.

**Maintenance** — Every month or so, you'll accept routine dependency updates, review the site for anything broken, and handle any support questions from editors.

---

## What you need at your church

Before you start, make sure you have:

- **A computer** (Mac, Windows, or Linux). Or just a browser if you use Codespaces.
- **A GitHub account** (free — sign up at [github.com](https://github.com)).
- **The church's branding** — logo file, preferred colors, fonts (optional).
- **The basic church info** — name, address, phone, email, Sunday service time, social links.
- **A way to access the church's domain** — username and password at GoDaddy, Namecheap, Cloudflare, or wherever the domain is registered. (Optional — you can launch on a `*.vercel.app` URL first and add the domain later.)
- **Real photos for the site** — at minimum a hero photo (church exterior or a welcoming community shot) and headshots for staff. Until you have them, the template ships with clean SVG placeholders.

---

## What you don't need

- **A credit card** — everything in this guide is free.
- **A database** — there isn't one. All content is stored as files in GitHub.
- **A server** — Vercel runs it for you.
- **Programming experience** — you'll be running a few commands and clicking buttons. The tutorials walk through each one.
- **A long-term commitment to the template maintainers** — your repo is independent. If we vanish, your site keeps working.

---

## What happens after launch

Once everything's set up, here's the routine:

- **Editors** log into the CMS at `/admin/` and edit content in their browser.
- **You** get a notification every time an editor publishes a change. You click a button to approve it. The site rebuilds automatically.
- **Once a month or so**, you'll check for software updates and apply them.

Total time per month, after launch: **about 10–15 minutes** of clicking through change approvals, plus 10 minutes of running updates.

---

## What's next?

- [Prerequisites](./02-prerequisites.md) — install Node.js and Git, or skip to Codespaces.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new).*
