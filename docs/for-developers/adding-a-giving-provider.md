---
type: how-to
---

# Adding a giving provider

The giving system is designed to be extended. Adding support for a new provider (Vanco, Realm, Kindrid, Church Community Builder, etc.) takes changes in four places and requires no UI rewrites.

---

## Overview of the architecture

The giving system has two layers:

**Config layer** (`/content/giving.json` + `/lib/giving.ts`):
- `giving.json` stores the church's choice and provider-specific values (subdomain, URL, embed code, etc.).
- `lib/giving.ts` defines the TypeScript types and four helper functions: `getGivingHref`, `shouldLoadModalScript`, `getModalScriptSrc`, and `getProviderDisplayName`.

**UI layer** (`/components/GiveButton.tsx`, `/app/give/page.tsx`, `/app/layout.tsx`):
- `GiveButton` is a server component that reads the config and renders the correct `<a>` or `<Link>`. It has no provider-specific logic — it just calls `getGivingHref` and renders what it gets.
- `give/page.tsx` has three render paths: online providers, Subsplash (embedded), and offline-only. Most new providers fall into the "online" path without any page changes.
- `layout.tsx` conditionally injects a modal script only when `shouldLoadModalScript` returns true.

---

## The four-file checklist

To add a new provider, you need to update:

| File | What to add |
|---|---|
| `lib/giving.ts` | The provider value in the `GivingProvider` union type, its config fields in `GivingConfig`, and cases in all four helpers |
| `content/giving.json` | A top-level key for the new provider's config fields (so the file stays valid for all adopters) |
| `tina/config.ts` | A new `object` field in the Giving collection with the provider's config fields |
| `docs/for-editors/setup-online-giving.md` | A new provider section explaining where to find the required IDs/URLs |

---

## Step-by-step: adding "Kindrid" as an example

Kindrid gives churches a short giving link like `https://kindrid.com/give/mychurch`.

### 1. Extend the TypeScript types (`lib/giving.ts`)

**Add to the `GivingProvider` union:**
```typescript
export type GivingProvider =
  | "planning_center"
  | "tithely"
  | "pushpay"
  | "subsplash"
  | "stripe"
  | "custom_url"
  | "offline_only"
  | "kindrid";  // ← add here
```

**Add to `GivingConfig`:**
```typescript
export type GivingConfig = {
  // ... existing fields ...
  kindrid: { organizationSlug: string };  // ← add here
};
```

**Add a case to `getGivingHref`:**
```typescript
case "kindrid": {
  return `https://kindrid.com/give/${config.kindrid.organizationSlug}`;
}
```

**Add a case to `getProviderDisplayName`:**
```typescript
case "kindrid": return "Kindrid";
```

`shouldLoadModalScript` and `getModalScriptSrc` don't need changes unless your provider requires a modal script injection (currently only Planning Center does).

---

### 2. Add the config key to the seed data (`content/giving.json`)

Add an empty config block for the new provider so the JSON is complete for all adopters, even those not using Kindrid:

```json
{
  "provider": "offline_only",
  ...
  "kindrid": {
    "organizationSlug": ""
  },
  ...
}
```

---

### 3. Add the CMS field (`tina/config.ts`)

Inside the `giving` collection's `fields` array, add a new `object` field for your provider:

```typescript
{
  type: "object",
  name: "kindrid",
  label: "Kindrid Settings",
  ui: {
    description: 'Fill in this field when your provider is set to "Kindrid".',
  } as object,
  fields: [
    {
      type: "string",
      name: "organizationSlug",
      label: "Organization Slug",
      ui: {
        description:
          "The part after kindrid.com/give/ in your giving link. Found in your Kindrid admin under Settings.",
      },
    },
  ],
},
```

Also add the new option to the **Provider** dropdown field's `options` array:

```typescript
{ label: "Kindrid", value: "kindrid" },
```

---

### 4. Document it for editors (`docs/for-editors/setup-online-giving.md`)

Add a section under the "Provider-specific setup" heading following the same format as the existing providers:

```markdown
### Kindrid

**What you'll need:** Your Kindrid organization slug.

Your slug is the part after `kindrid.com/give/` in your giving link.
...
```

---

## Special cases

### Provider that requires a modal script

If your provider works like Planning Center — injecting a JavaScript modal via a CDN script — update two additional functions:

```typescript
export function shouldLoadModalScript(config: GivingConfig): boolean {
  return (
    (config.provider === "planning_center" && config.displayMode === "modal") ||
    config.provider === "your_provider"  // ← add here
  );
}

export function getModalScriptSrc(config: GivingConfig): string | null {
  if (config.provider === "planning_center" && config.displayMode === "modal") {
    return "https://js.churchcenter.com/modal/v1";
  }
  if (config.provider === "your_provider") {
    return "https://cdn.yourprovider.com/modal.js";  // ← add here
  }
  return null;
}
```

`layout.tsx` already calls these helpers and conditionally injects the script with `strategy="afterInteractive"`. No layout changes needed.

### Provider that embeds a form on the page

If your provider works like Subsplash — an embed code that renders a form inline rather than redirecting — you have two options:

**Option A: Extend the existing embed path.** If the embed is also a `<script>` tag, the existing `SubsplashEmbed` component in `/components/giving/SubsplashEmbed.tsx` already handles arbitrary embed snippets. Add your provider's embed code field, then reuse the component from `give/page.tsx`:

```tsx
// In app/give/page.tsx, extend the SubsplashPage component or
// add a parallel branch:
if (givingConfig.provider === "your_provider") {
  return <YourProviderPage />;
}
```

**Option B: Add a dedicated embed component.** If the provider uses a different embed mechanism (e.g., a React component from an npm package, or an iframe URL), create `/components/giving/YourProviderEmbed.tsx` following the same pattern as `SubsplashEmbed`.

---

## Keeping provider parity across examples

If you're contributing this provider to the upstream template repo, also update:

- `/examples/small-rural-church/giving.json` — add an empty config block for the new provider
- `/examples/suburban-family-church/giving.json` — same

These example configs are browsed by adopting churches looking for model configurations. Keeping them in sync with `giving.json`'s schema prevents confusion.

---

## Submitting a new provider

If you've added a provider and want to contribute it back to the template so future adopting churches benefit, open a pull request. The review checklist is:

- [ ] `GivingProvider` union updated
- [ ] `GivingConfig` type updated
- [ ] `getGivingHref` case added
- [ ] `getProviderDisplayName` case added
- [ ] `content/giving.json` key added
- [ ] `tina/config.ts` field and option added
- [ ] `docs/for-editors/setup-online-giving.md` provider section added
- [ ] TypeScript passes (`npx tsc --noEmit`)
- [ ] Build passes (`npx next build`)
- [ ] Manual test: set provider to new value, verify `/give` and the Give button render correctly
