---
type: explanation
audience: developer
time: 5 minutes
---

# Design rationale

Where the visual language of the template comes from, and what to preserve vs. change when customizing.

## Tone

Warm, grounded, modestly editorial. Avoid corporate blue/indigo (feels like a SaaS landing page). Avoid pastel-cute (feels like a children's hospital). Avoid grunge or "edgy" (feels like a coffee shop trying too hard).

Reference points: small-publication editorial design, the kind of restraint you see at a serious book publisher or a thoughtful magazine. The site should feel like the kind of church where adults read and pray, where kids feel safe, and where neither is performed.

## Palette options shipped with `npm run setup`

The setup script offers four palettes. Each is built around a **warm** background, a **stable** primary, and a **distinctive** accent reserved for emphasis. All four meet WCAG AA contrast on body text and interactive states.

### Option A — Sandstone & Sage (default)

Warm cream foundation with a deep sage primary and a terracotta accent reserved for CTAs and emphasis.

| Token              | HSL                | Hex     | Use                              |
| ------------------ | ------------------ | ------- | -------------------------------- |
| background         | `38 30% 96%`       | #F8F4EC | Page background                  |
| foreground         | `30 12% 15%`       | #2A2520 | Body text                        |
| card               | `0 0% 100%`        | #FFFFFF | Card surfaces                    |
| primary (sage)     | `120 14% 32%`      | #475C49 | Primary buttons, brand accents   |
| accent (terracotta)| `15 55% 47%`       | #BB5A37 | Hero CTA, link hover, highlights |
| muted              | `36 24% 90%`       | #ECE4D6 | Subtle backgrounds, dividers     |
| muted-foreground   | `30 10% 40%`       | #6B635A | Secondary text                   |
| border             | `35 20% 84%`       | #DDD3C1 | Hairlines                        |

Sage as primary (rather than as accent) gives the brand more "personhood" than a brown-on-cream system. Terracotta as accent provides the warm punch a church homepage needs without crossing into Hallmark territory.

### Option B — Mountain Morning

Soft alpine cream with deep evergreen primary and a brass/amber accent. Slightly cooler than A. Fits churches in mountain or wooded regions.

- background `#F4F2EC` · foreground `#1F2622` · primary `#2F4A3A` (evergreen) · accent `#B8842F` (brass)

### Option C — High Desert

Warmer still, with burnt sienna primary and olive accent. Most "high plains" feeling. Risks looking rustic if not paired with restrained typography — keep the default serif heading font (Fraunces) rather than swapping for something more decorative.

- background `#FBF6EE` · foreground `#2B221A` · primary `#A24A2A` (sienna) · accent `#7A7B3F` (olive)

### Option D — Coastal

Soft sand background with deep navy primary and warm orange accent. The most modern of the four. Fits coastal or urban churches better than rural ones.

- background `#FAF6F0` · foreground `#1F2937` · primary `#1E3A5F` (navy) · accent `#D97706` (orange)

## Type

- **Sans:** [Inter](https://fonts.google.com/specimen/Inter) for UI and body. Neutral, sober, screen-optimized.
- **Serif:** [Fraunces](https://fonts.google.com/specimen/Fraunces) for display headings (hero, section titles). Adds editorial warmth without feeling vintage. Variable axes (SOFT, WONK) tuned for warmth on large sizes.

Both load via `next/font/google` — self-hosted, no layout shift, no third-party connection at runtime.

If you change fonts, keep the **sans + serif pairing** — one of each is the visual anchor. Two sans or two serif quickly looks generic.

## Density

Generous vertical rhythm. Sections separated by 80–120px on desktop, 56–72px on mobile. Cards use 24–32px padding. Letting things breathe is a deliberate signal that we're not a startup landing page.

If you find yourself pushing density tighter to fit more on screen — resist. Empty space is part of the brand.

## Component-level decisions

A few specific choices worth preserving when you customize:

- **Buttons** are bold (`font-medium` minimum) and have visible hover states. Subtle ghost buttons get lost on warm backgrounds.
- **Cards** use single soft borders (`border-border`) rather than drop shadows by default. Shadows show up on hover or open state.
- **Section headings** alternate display serif (h2, h3) with sans subheads. Don't make every heading a serif — the contrast is the point.
- **Hero images** use a warm-toned overlay (`bg-foreground/65`) so light text reads cleanly. Without the overlay, photos tend to fight the type.

## Mobile-first

Every component was designed for the 375-pixel screen first, then scaled up. About 70% of visitors to a typical church website arrive on a phone. The desktop view is the bonus, not the baseline.

When you add new pages or components, design for mobile first. Use Tailwind's mobile-first defaults (no `sm:` prefix means it applies to mobile and up). Only add `md:` / `lg:` modifiers for changes that need a larger viewport.

## What to change vs. leave alone

**Change freely** to match your brand:

- All color tokens in `app/globals.css`.
- Font choices in `app/layout.tsx`.
- Hero photo and ministry photos.
- The logo (or stick with the dynamic-text fallback).

**Resist changing** without a clear reason:

- The vertical rhythm. Don't tighten section spacing.
- The serif/sans pairing. Don't use two sans-serif fonts.
- The card-vs-shadow pattern. Don't replace cards with shadows by default.
- The mobile-first design intent. Don't add desktop-only features.

These are the bits that keep the template from feeling like "a free template" and start to feel like a real, thoughtful design.
