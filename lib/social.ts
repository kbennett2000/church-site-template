import {
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Twitch,
  Rss,
  Globe,
  type LucideIcon,
} from "lucide-react";

// Social-media link model + helpers.
//
// Editorial shape (in content/site.json, edited via TinaCMS):
//   "social": [
//     { "platform": "facebook", "url": "https://facebook.com/your-page" },
//     { "platform": "other",    "url": "https://example.com", "label": "Substack" }
//   ]
//
// A church can list any number of profiles. Entries with a blank URL are
// filtered out at load time and never reach a renderer — the no-broken-link
// guarantee. An empty list (or an absent field) means the social row hides
// entirely.
//
// -----------------------------------------------------------------------------
// Why these eight platforms and not (e.g.) TikTok or Spotify
// -----------------------------------------------------------------------------
// The first-class platforms below were chosen because lucide-react ships a
// real, recognizable brand glyph for each of them. Lucide does NOT ship icons
// for TikTok, Spotify, Threads, Bluesky, Discord, WhatsApp, Apple Podcasts,
// and many others. Approximating those with a generic music or chat glyph
// would produce a misleading icon — non-technical editors will think the icon
// is broken or wrong, which is worse than honesty. So those platforms are
// supported via the "other" escape hatch: the editor sets a custom label,
// the renderer uses a generic Globe icon, and the link works correctly. An
// honest generic icon with text label beats a wrong brand icon.
//
// If lucide later ships a brand glyph for a missing platform — or if we adopt
// a brand-icon dependency (e.g. simple-icons) — promote it from "other" to a
// first-class entry here.
// -----------------------------------------------------------------------------

export type SocialLink = {
  platform: string;
  url: string;
  label?: string;
};

export const SOCIAL_PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  youtube: "YouTube",
  instagram: "Instagram",
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  twitch: "Twitch",
  podcast: "Podcast",
  other: "Website",
};

export const SOCIAL_PLATFORM_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  twitch: Twitch,
  podcast: Rss,
  other: Globe,
};

export function getSocialIcon(platform: string): LucideIcon {
  return SOCIAL_PLATFORM_ICONS[platform] ?? Globe;
}

export function getSocialPlatformLabel(platform: string): string {
  return SOCIAL_PLATFORM_LABELS[platform] ?? SOCIAL_PLATFORM_LABELS.other;
}

// Normalize a user-entered URL. Trims whitespace and prepends https:// if no
// scheme is present, so editors who paste "facebook.com/foo" still get a
// working link.
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

// Accepts either:
//   - the current list shape: SocialLink[]
//   - the legacy flat shape: { facebook?: string; youtube?: string; ... }
//
// Empty/blank URLs are dropped. The legacy branch exists so that adopting
// instances cherry-picking this change keep rendering correctly even before
// their site.json has been converted to the list shape by hand.
//
// TODO(next-release): once all known instances have migrated their
// content/site.json to the list shape, drop the legacy-object branch below.
export function normalizeSocial(raw: unknown): SocialLink[] {
  if (raw == null) return [];

  if (Array.isArray(raw)) {
    return raw
      .map((entry): SocialLink | null => {
        if (!entry || typeof entry !== "object") return null;
        const e = entry as Record<string, unknown>;
        const platform =
          typeof e.platform === "string" && e.platform.trim()
            ? e.platform.trim()
            : "other";
        const url =
          typeof e.url === "string" ? normalizeUrl(e.url) : "";
        if (!url) return null;
        const label =
          typeof e.label === "string" && e.label.trim()
            ? e.label.trim()
            : undefined;
        return { platform, url, label };
      })
      .filter((x): x is SocialLink => x !== null);
  }

  if (typeof raw === "object") {
    const legacy = raw as Record<string, unknown>;
    const known = new Set(Object.keys(SOCIAL_PLATFORM_LABELS));
    const out: SocialLink[] = [];
    for (const [key, value] of Object.entries(legacy)) {
      if (typeof value !== "string") continue;
      const url = normalizeUrl(value);
      if (!url) continue;
      if (known.has(key)) {
        out.push({ platform: key, url });
      } else {
        out.push({ platform: "other", url, label: key });
      }
    }
    return out;
  }

  return [];
}

// Returns the first link matching the given platform, or undefined. Used by
// pages that need a specific platform's URL (e.g. the /watch page's YouTube
// Subscribe card). Duplicates are allowed in the list; the first one wins.
export function findSocial(
  links: SocialLink[],
  platform: string
): SocialLink | undefined {
  return links.find((l) => l.platform === platform);
}
