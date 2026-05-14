---
type: reference
audience: tech-volunteer
length: 5 minutes
companion: /docs/for-tech-volunteers/06-deploy-to-vercel.md
---

# Video: Deploy to Vercel

**Length:** 5 minutes
**Audience:** Tech volunteer putting the site on the internet for the first time.
**Companion guide:** [06 Deploy to Vercel](../for-tech-volunteers/06-deploy-to-vercel.md)

## Open with (30 sec)
**Say:** "In this video I'll walk you through deploying your church's site to Vercel — putting it on the internet so people can actually visit it. It's free for small sites and takes about five minutes. You'll need: your code already pushed to GitHub, and a few minutes."

## Steps (4 min)

### 1. Sign up for Vercel (40 sec)
[Open vercel.com/signup in browser.]
[Click **Continue with GitHub**.]
[On GitHub authorization page, click **Authorize Vercel**.]

**Say:** "Open vercel.com/signup. Click Continue with GitHub. Sign in if needed, then click Authorize. Vercel just needs to read your GitHub to import your project."

### 2. Import the project (50 sec)
[Vercel dashboard opens.]
[Click **Add New** → **Project**.]
[Find your church-site repository in the list.]
[Click **Import** next to it.]

**Say:** "On the Vercel dashboard, click Add New, then Project. Find your church site repository in the list. Click Import."

### 3. Review the settings (1 min)
[Project configuration page appears.]
[Scroll through showing framework auto-detected as Next.js.]

**Say:** "Vercel detects this is a Next.js site and fills in all the build settings automatically. Leave everything exactly as it is — don't change anything in this section."

### 4. Click Deploy (1 min 10 sec)
[Click the green **Deploy** button at the bottom.]
[Build progress page appears with logs.]

**Say:** "Click Deploy. Vercel will build your site — this takes one to three minutes."

[Wait. Show logs scrolling.]
[Confetti animation when done.]

**Say:** "When it's done, you'll see confetti and a celebration page with your live URL."

### 5. Visit your live site (20 sec)
[Click the URL on the celebration page.]
[Browser opens to the church homepage.]

**Say:** "Click the URL to visit your live site. That's it — your church is on the internet."

## Wrap (30 sec)
**Say:** "Two things to do next: connect your custom domain like `yourchurch.org` — there's a separate guide for that — and invite your editors so they can use the CMS. Both linked below."

## Captions
- 0:00 — Title: "Deploying your church site to Vercel"
- 0:30 — Caption: "You'll need: GitHub repo with your code"
- 1:00 — On-screen: vercel.com/signup
- 1:30 — "Continue with GitHub"
- 2:30 — "Vercel auto-detects Next.js — don't change settings"
- 3:00 — Highlight the green Deploy button
- 4:00 — "Wait 1-3 minutes for build"
- 4:40 — End card: "Next: Connect your custom domain"

## Things to watch out for
- Vercel's free tier has limits (small sites are fine). Mention this if relevant to viewer audience.
- If the deploy fails, the most common cause is a typo in `public/admin/config.yml` — link viewers to the troubleshooting doc.
- Don't show your church's full repo URL on screen if it reveals private information.
