---
title: "Giving Setup — Generic Iframe"
type: how-to
---

# Generic Iframe Embed

Use this option if your giving platform provides an embed URL that isn't one of the named options. Many platforms — Pushpay, Vanco, Stripe-based solutions — offer an iframe embed link.

## What you need

- An embed URL from your giving platform (the URL you put inside an `<iframe src="...">` tag).
- The recommended height for the iframe (check your platform's documentation; 700px is a good default).

## Step 1 — Get your embed URL

Check your giving platform's documentation or support team for an "embed URL" or "iframe URL." It is different from the regular giving page URL — it's specifically designed to be embedded inside another page.

Common examples:
- Pushpay: ask your account rep for the embed URL
- Vanco: available in your dashboard under Embed Options
- Custom Stripe: the URL of your hosted payment page

## Step 2 — Configure in TinaCMS

1. Go to `/admin` → **Settings → Online Giving**.
2. Set **Giving Platform** to **Generic Iframe Embed**.
3. Paste the embed URL into **Iframe: URL**.
4. Set **Iframe: Height (px)** to the height your platform recommends (default: 700).
5. **Save**.

## Verify

Visit `/give` and confirm the embedded giving form appears and works correctly. Adjust the height if the form is cut off or has excessive blank space at the bottom.

## Troubleshooting

**Form doesn't load / blank iframe:** Some platforms block iframe embedding from external domains. Check your browser console for "Refused to display in a frame" errors — if you see that, the platform doesn't support embedding and you should use the **External Link** option instead.
