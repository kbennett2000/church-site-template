---
title: "Giving Setup — Choose a Provider"
type: how-to
---

# Online Giving: Choose a Provider

The `/give` page supports seven giving platforms. You set one up; the others are ignored.

## Supported platforms

| Platform | Best for | Cost |
|---|---|---|
| **Planning Center Giving** | Churches already on Planning Center | Free–$149/mo |
| **Tithe.ly** | Simple setup, common in evangelical churches | ~2.9% + 30¢ per gift |
| **Subsplash** | Churches using the Subsplash app bundle | Subscription |
| **Givelify** | Faith communities, strong mobile app | ~2.9% + 30¢ per gift |
| **PayPal** | Absolute minimum — most people already have it | ~2.9% + 49¢ per gift |
| **Generic Iframe** | Any platform that provides an embed URL | Varies |
| **External Link** | Anything else — just link out | Varies |

## How to configure

1. Open TinaCMS at `/admin` on your live site (or `localhost:3000/admin` locally).
2. In the left sidebar, click **Settings → Online Giving**.
3. Set **Giving Platform** to your chosen provider.
4. Fill in only the fields for that provider — ignore the rest.
5. Click **Save**. The site rebuilds in about two minutes.

## What "not configured" looks like

If **Giving Platform** is set to **External Link** and the **External Link URL** field is empty, the `/give` page shows a polished placeholder telling visitors that online giving isn't set up yet. All the alternative methods (mail, in-person) still display.

## Provider-specific guides

- [02 — Planning Center Giving](02-planning-center.md)
- [03 — Tithe.ly](03-tithely.md)
- [04 — Subsplash](04-subsplash.md)
- [05 — Givelify](05-givelify.md)
- [06 — PayPal](06-paypal.md)
- [07 — Generic Iframe](07-generic-iframe.md)
