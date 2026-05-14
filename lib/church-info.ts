import { churchData } from "@/content/site";
import navData from "@/content/navigation.json";

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
  social: churchData.social,
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const nav: NavItem[] = navData.items;
