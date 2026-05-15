---
title: "Giving Setup — Tithe.ly"
type: how-to
---

# Tithe.ly

Tithe.ly is a widely used church giving platform with strong recurring gift support and a mobile app.

## What you need

- A Tithe.ly account.
- Your Tithe.ly **church ID** (a numeric ID).

## Step 1 — Find your church ID

1. Log in to your Tithe.ly dashboard at [tithe.ly](https://tithe.ly).
2. Go to **Settings → General** or look in the URL when viewing your giving page.
3. Your church ID is the number in URLs like `give.tithe.ly/?c=XXXXXX`.

## Step 2 — Configure in TinaCMS

1. Go to `/admin` → **Settings → Online Giving**.
2. Set **Giving Platform** to **Tithe.ly**.
3. Enter your church ID in **Tithe.ly: Church ID**.
4. **Save**.

## How it works

The Tithe.ly v3 widget script loads on the `/give` page and renders their giving button automatically. Clicking it opens the Tithe.ly giving flow.

## Verify

Visit `/give` on your site. You should see the Tithe.ly give button rendered on the page. Click it to confirm the flow opens correctly.

## Troubleshooting

**Widget doesn't render:** Make sure your church ID is correct (numeric only, no letters). Check your browser console for script errors. The widget loads lazily — wait a moment after the page loads.
