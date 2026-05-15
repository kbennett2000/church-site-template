---
title: "Giving Setup — Planning Center"
type: how-to
---

# Planning Center Giving

Planning Center Giving integrates with your existing Church Center app. It supports one-time and recurring gifts, fund designation, and giving statements.

## What you need

- A Planning Center account with Giving enabled.
- Your Church Center giving URL.

## Step 1 — Get your giving URL

1. Log in to [services.planningcenteronline.com](https://services.planningcenteronline.com).
2. Navigate to **Giving → Settings → Church Center**.
3. Copy your **Church Center Giving URL** — it looks like:
   ```
   https://giving.planningcenteronline.com/churches/XXXXX
   ```

## Step 2 — Choose modal or page mode

**Modal mode (recommended)** — a "Give" button appears in the site header and mobile nav. Clicking it opens an overlay on any page without leaving the site. Requires a small JavaScript snippet loaded automatically.

**Page mode** — the Give button links directly to your Church Center giving page in a new tab. Simpler, but takes the visitor off your site.

## Step 3 — Configure in TinaCMS

1. Go to `/admin` → **Settings → Online Giving**.
2. Set **Giving Platform** to **Planning Center Giving**.
3. Paste your Church Center URL into **Planning Center: Giving URL**.
4. Set **Planning Center: Display Mode** to **Modal** or **Page**.
5. **Save**.

## Verify

- Visit your site and click **Give** in the header.
- Modal mode: an overlay should appear on the current page.
- Page mode: a new tab should open to your Church Center giving page.

## Troubleshooting

**Modal doesn't open:** The Planning Center modal script loads lazily. Try scrolling the page first, or check your browser console for script errors. Make sure the URL you entered is the full `https://giving.planningcenteronline.com/churches/XXXXX` format, not just `giving.planningcenteronline.com`.

**"Give" button not showing in header:** The button only appears when a provider is configured. Make sure you've saved and the site has rebuilt (allow ~2 minutes after saving in TinaCMS).
