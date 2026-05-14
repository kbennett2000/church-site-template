---
type: reference
audience: developer
time: 15 minutes
---

# Styling and theming

**Who this is for:** Developers building UI or changing the look of the site.
**What you'll accomplish:** Use the theme tokens correctly, add new colors when needed, and avoid the patterns that break theming.
**You'll need first:**
- Familiarity with Tailwind CSS. Reference: [tailwindcss.com](https://tailwindcss.com/docs).

---

## The system at a glance

The site uses **semantic theme tokens** defined as CSS variables in `app/globals.css`, mapped to Tailwind utility classes via `tailwind.config.ts`.

You write:

```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
```

Tailwind translates that to:

```css
.bg-primary { background-color: hsl(var(--primary)); }
.text-primary-foreground { color: hsl(var(--primary-foreground)); }
```

And `--primary` is defined once in `globals.css`:

```css
--primary: 120 14% 32%;
```

A church changes their brand colors by editing **one file** (`globals.css`). Every component that uses `bg-primary`, `text-primary`, `border-primary`, etc. updates automatically.

---

## The full set of tokens

Defined in `app/globals.css`:

| Token | Used for | Tailwind class examples |
| --- | --- | --- |
| `background` | Page background | `bg-background` |
| `foreground` | Main text color | `text-foreground` |
| `card` | Card background | `bg-card` |
| `card-foreground` | Text on cards | `text-card-foreground` |
| `popover` | Dropdown/popover bg | `bg-popover` |
| `popover-foreground` | Text on popovers | `text-popover-foreground` |
| `primary` | Brand color (CTAs, links) | `bg-primary`, `text-primary`, `border-primary` |
| `primary-foreground` | Text on primary bg | `text-primary-foreground` |
| `secondary` | Subtle background | `bg-secondary` |
| `secondary-foreground` | Text on secondary bg | `text-secondary-foreground` |
| `muted` | Even subtler background | `bg-muted` |
| `muted-foreground` | De-emphasized text | `text-muted-foreground` |
| `accent` | Highlight color (badges, eyebrows) | `bg-accent`, `text-accent` |
| `accent-foreground` | Text on accent bg | `text-accent-foreground` |
| `destructive` | Error/delete states | `bg-destructive`, `text-destructive` |
| `destructive-foreground` | Text on destructive bg | `text-destructive-foreground` |
| `border` | Thin lines and borders | `border-border` |
| `input` | Input field borders | `border-input` |
| `ring` | Focus outlines | `ring-ring`, `focus-visible:ring-ring` |
| `radius` | Corner roundness | `rounded` (uses var via Tailwind config) |

Every token has a `-foreground` partner where it matters — that's the text color expected to appear *on top of* that background.

---

## Tailwind theme integration

`tailwind.config.ts` maps each CSS variable to a Tailwind color name:

```ts
// excerpt from tailwind.config.ts
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      // ... others
    },
  },
}
```

This is why `bg-primary` and `text-primary-foreground` work as a pair.

---

## Typography

Two fonts are loaded via `next/font/google` in `app/layout.tsx`:

- **Inter** — sans-serif, applied to body text via `font-sans` (default).
- **Fraunces** — serif, applied to headings via `font-serif`. Used on `h1`–`h4` via a global rule in `globals.css`:

```css
h1, h2, h3, h4 {
  @apply font-serif tracking-tight;
}
```

Both fonts are exposed as CSS variables (`--font-sans`, `--font-serif`) so Tailwind can pick them up.

To change fonts, see [for-tech-volunteers/05-customize-branding.md](../for-tech-volunteers/05-customize-branding.md).

---

## How to: add a new semantic color

Suppose you need a "warning" color (amber-ish) that's used in a few places.

### 1. Add the variable in `globals.css`

```css
--warning: 38 92% 50%;        /* amber */
--warning-foreground: 30 12% 15%;  /* dark text on amber */
```

### 2. Add to Tailwind config

In `tailwind.config.ts`:

```ts
colors: {
  // ... existing
  warning: {
    DEFAULT: "hsl(var(--warning))",
    foreground: "hsl(var(--warning-foreground))",
  },
}
```

### 3. Use it

```tsx
<div className="bg-warning text-warning-foreground">Heads up...</div>
```

> **Important:** When adding new tokens, also add the corresponding `-foreground` partner. Contrast matters. Use [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) to verify at least 4.5:1 for body text.

---

## How to: change a brand color

In `globals.css`, edit the HSL value of the relevant token. Save. The site reloads with the new color.

Example — switch from sage green to deep navy primary:

```css
/* Before */
--primary: 120 14% 32%;

/* After */
--primary: 215 60% 25%;
--ring: 215 60% 25%;  /* match primary */
```

Always check that the `-foreground` partner still has enough contrast.

---

## The DO NOT list

These patterns break the theme system. Code review should reject them.

### Don't use raw Tailwind colors

```tsx
// BAD — breaks theming
<button className="bg-amber-600 text-white">

// GOOD — uses tokens
<button className="bg-accent text-accent-foreground">
```

`bg-amber-600` is hardcoded to a specific amber shade. A church with a non-amber brand would have to find and replace every occurrence. The token system exists to prevent this.

### Don't use hex codes in components

```tsx
// BAD
<div style={{ backgroundColor: "#475c49" }}>

// GOOD
<div className="bg-primary">
```

Hex codes in components are completely unthemeable.

### Don't use `style={{ ... }}` for theme colors

Use Tailwind utility classes. The exceptions are:
- One-off values that aren't a theme concept (specific shadow offsets).
- Dynamic values that depend on runtime data (rare — usually solvable via class composition).

### Don't add custom CSS files for component styles

Stick to Tailwind classes inline. The only CSS files in this project are `globals.css` (theme + base styles) and Tailwind's generated output. Adding a `styles/buttons.css` etc. fragments the design system.

### Don't use `dark:` variants without a dark theme

The project doesn't ship a dark theme. `dark:bg-primary` does nothing. If you want to add dark mode, do it once and globally — define `--background`, `--foreground`, etc. under `.dark` in `globals.css` and add a toggle.

---

## How to: build a card

The site uses a consistent card pattern. Copy from any existing card-using component:

```tsx
<div className="rounded-xl border border-border bg-card text-card-foreground p-6">
  <h3 className="font-serif text-xl">Card title</h3>
  <p className="mt-2 text-muted-foreground">Card description.</p>
</div>
```

Key tokens for cards: `bg-card`, `text-card-foreground`, `border-border`. The radius (`rounded-xl`) is a 12px corner; for smaller pieces use `rounded-lg`, `rounded-md`.

---

## Spacing and layout

Use Tailwind's spacing scale (`p-4`, `mt-8`, `gap-6`). Common patterns:

- **Page container:** `<main className="container mx-auto px-4 py-12">`.
- **Section vertical padding:** `py-12` for normal sections, `py-20` for hero-ish sections.
- **Card padding:** `p-6` standard, `p-8` for more breathing room.
- **Vertical rhythm between sections:** `mt-12` between top-level sections.

---

## Responsive design

Mobile-first. Always start with the smallest screen and add breakpoint prefixes for larger:

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
```

Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px). Use sparingly — most layouts only need `md:` adjustments.

---

## Common Mistakes

- **Color doesn't change site-wide after editing `globals.css`.** Restart the dev server. Hot-reload sometimes misses CSS variable changes.
- **`bg-primary` class doesn't apply.** Check that the file is included in `content:` in `tailwind.config.ts`. Tailwind's purge needs to see the class string somewhere.
- **A class works in dev but not in production.** Tailwind's JIT can miss dynamically-constructed class strings (`bg-${color}`). Use complete class names with `cn()`:
  ```ts
  const isError = condition;
  className={cn("p-4", isError ? "bg-destructive" : "bg-card")}
  ```
- **Text is unreadable on a custom background.** You used a background token without its matching foreground. `bg-primary` should pair with `text-primary-foreground`.

---

## What's next?

- [Adding a page](./adding-a-page.md) — apply these styles to a real page.
- [Architecture](./architecture.md) — refresher on where styles fit in the system.

## Stuck?

- [Tailwind docs](https://tailwindcss.com/docs)
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Styling%20and%20Theming).*
