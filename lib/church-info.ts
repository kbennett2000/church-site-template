import { churchData, features } from "@/content/site";
import navData from "@/content/navigation.json";
import { normalizeSocial, type SocialLink } from "@/lib/social";

export type { SocialLink };

// Church identity data lives in /content/site.json (editable via TinaCMS).
// This file adds derived fields (full address, mapsUrl, tel/mailto hrefs,
// primaryService) computed from the raw values, plus the nav structure
// (which is not church-specific data — it's site IA).

const fullAddress = `${churchData.address.street}, ${churchData.address.city}, ${churchData.address.state} ${churchData.address.zip}`;

export type Service = {
  name: string;
  day: string;
  time: string;
  note: string;
  primary: boolean;
};

const services: Service[] = (churchData.services ?? []).map((s) => ({
  name: s.name ?? "",
  day: s.day ?? "",
  time: s.time ?? "",
  note: s.note ?? "",
  primary: Boolean(s.primary),
}));

// Primary service used wherever a single service has to be named (hero,
// footer, prose). Picks the entry flagged `primary: true`, or the first
// entry as a fallback, or null if the array is empty.
const primaryService: Service | null =
  services.find((s) => s.primary) ?? services[0] ?? null;

export const churchInfo = {
  name: churchData.name,
  shortName: churchData.shortName,
  tagline: churchData.tagline,
  address: {
    street: churchData.address.street,
    city: churchData.address.city,
    state: churchData.address.state,
    zip: churchData.address.zip,
    full: fullAddress,
    mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`,
  },
  phone: churchData.phone,
  phoneHref: `tel:+1${churchData.phone.replace(/\D/g, "")}`,
  email: churchData.email,
  emailHref: `mailto:${churchData.email}`,
  logo: (churchData as { logo?: string }).logo ?? "",
  services,
  primaryService,
  officeHours: churchData.officeHours,
  // Normalized to the list shape. Blank URLs and empty/legacy values are
  // dropped here so renderers never see them. See lib/social.ts.
  social: normalizeSocial((churchData as { social?: unknown }).social),
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

// Inject the Weekly Digest link under "Connect" when features.digest is on.
// Editors can still reposition or relabel it by editing navigation.json
// directly; the injection is a no-op when the entry is already present.
function withDigestLink(items: NavItem[]): NavItem[] {
  if (!features?.digest) return items;
  const ALREADY = items.some(
    (i) => i.href.startsWith("/digest") ||
      (i.children ?? []).some((c) => c.href.startsWith("/digest"))
  );
  if (ALREADY) return items;

  const connectIdx = items.findIndex((i) => i.href === "/connect");
  if (connectIdx === -1) {
    return [...items, { label: "Weekly Digest", href: "/digest" }];
  }
  const connect = items[connectIdx];
  const updated: NavItem = {
    ...connect,
    children: [
      ...(connect.children ?? []),
      { label: "Weekly Digest", href: "/digest" },
    ],
  };
  return [...items.slice(0, connectIdx), updated, ...items.slice(connectIdx + 1)];
}

export const nav: NavItem[] = withDigestLink(navData.items as NavItem[]);
