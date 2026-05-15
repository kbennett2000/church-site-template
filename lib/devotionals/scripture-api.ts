// Scripture fetching abstraction.
//
// All providers implement the ScriptureProvider interface so callers are
// insulated from which API is in use. Switch providers by changing the
// DEFAULT_PROVIDER export or by passing a provider explicitly.
//
// Translation support by provider:
//
//   bible-api.com (BibleApiProvider) — free, no auth, public domain:
//     KJV, ASV, WEB, BBE
//     Endpoint: https://bible-api.com/{reference}?translation={translation}
//
//   ESV API (EsvProvider) — requires NEXT_PUBLIC_ESV_API_KEY:
//     ESV only
//     Endpoint: https://api.esv.org/v3/passage/text/
//     Get a key at https://api.esv.org/
//
//   Biblia API (BibliaProvider) — requires BIBLIA_API_KEY:
//     NIV, NLT, CSB, NKJV, NRSV and others
//     Endpoint: https://api.biblia.com/v1/bible/content/
//     Get a key at https://biblia.com/api/
//     Note: Biblia licenses vary by translation; verify your plan covers your
//     chosen translation before enabling.

import type { BibleTranslation, PassageResult } from "./types";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface ScriptureProvider {
  /**
   * Fetch the text for a Bible passage.
   * @param reference  Standard reference string, e.g. "Psalm 23" or "John 3:16"
   * @param translation  The requested translation code
   * @returns  Resolved passage text, HTML, and attribution
   */
  fetchPassage(
    reference: string,
    translation: BibleTranslation
  ): Promise<PassageResult>;
}

// ---------------------------------------------------------------------------
// In-memory cache (dev server / single request deduplication)
// A durable per-day cache keyed by reference+translation is added in a later
// phase. This cache prevents redundant calls within the same Node.js process
// (useful during `npm run cms` dev sessions and build-time pre-rendering).
// ---------------------------------------------------------------------------

const memCache = new Map<string, PassageResult>();

function cacheKey(reference: string, translation: string): string {
  return `${translation}::${reference.toLowerCase().replace(/\s+/g, "_")}`;
}

// ---------------------------------------------------------------------------
// Provider: bible-api.com — public domain translations, no key needed
// ---------------------------------------------------------------------------

type BibleApiVerse = {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
};

type BibleApiResponse = {
  reference: string;
  verses: BibleApiVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
};

const BIBLE_API_TRANSLATIONS = new Set<BibleTranslation>([
  "KJV",
  "ASV",
  "WEB",
  "BBE",
]);

export class BibleApiProvider implements ScriptureProvider {
  async fetchPassage(
    reference: string,
    translation: BibleTranslation
  ): Promise<PassageResult> {
    const key = cacheKey(reference, translation);
    if (memCache.has(key)) return memCache.get(key)!;

    // Fall back to WEB (public domain, modern) if translation not supported.
    const apiTranslation = BIBLE_API_TRANSLATIONS.has(translation)
      ? translation.toLowerCase()
      : "web";

    const encodedRef = encodeURIComponent(reference);
    const url = `https://bible-api.com/${encodedRef}?translation=${apiTranslation}`;

    const res = await fetch(url, {
      // Next.js extended fetch — cache for the lifetime of the build/request.
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(
        `bible-api.com returned ${res.status} for "${reference}" (${apiTranslation})`
      );
    }

    const data: BibleApiResponse = await res.json();
    const usedTranslation = apiTranslation.toUpperCase() as BibleTranslation;

    // Build HTML with verse numbers as superscripts and paragraph breaks.
    const html = data.verses
      .map((v) => `<sup class="verse-num">${v.verse}</sup>${v.text.trim()}`)
      .join(" ");

    const result: PassageResult = {
      text: data.text.trim(),
      html: `<p>${html}</p>`,
      // Public-domain translations need no attribution.
      attribution: "",
      translation: usedTranslation,
    };

    memCache.set(key, result);
    return result;
  }
}

// ---------------------------------------------------------------------------
// Provider: ESV API — requires NEXT_PUBLIC_ESV_API_KEY
// ---------------------------------------------------------------------------
// To enable:
//   1. Get an API key at https://api.esv.org/
//   2. Add to .env: NEXT_PUBLIC_ESV_API_KEY=your_key_here
//   3. Set defaultTranslation: "ESV" in your reading plan frontmatter.
// ---------------------------------------------------------------------------

export class EsvProvider implements ScriptureProvider {
  async fetchPassage(
    reference: string,
    _translation: BibleTranslation
  ): Promise<PassageResult> {
    const apiKey = process.env.NEXT_PUBLIC_ESV_API_KEY;
    if (!apiKey) {
      // Graceful degradation: fall back to WEB rather than hard-failing.
      console.warn(
        "[devotionals] NEXT_PUBLIC_ESV_API_KEY is not set. " +
          "Falling back to WEB translation for: " +
          reference
      );
      return bibleApiProvider.fetchPassage(reference, "WEB");
    }

    const key = cacheKey(reference, "ESV");
    if (memCache.has(key)) return memCache.get(key)!;

    const params = new URLSearchParams({
      q: reference,
      "include-headings": "false",
      "include-footnotes": "false",
      "include-verse-numbers": "true",
      "include-short-copyright": "false",
      "include-passage-references": "false",
    });

    const res = await fetch(
      `https://api.esv.org/v3/passage/text/?${params}`,
      {
        headers: { Authorization: `Token ${apiKey}` },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      throw new Error(`ESV API returned ${res.status} for "${reference}"`);
    }

    const data = await res.json() as { passages: string[] };
    const text = (data.passages ?? []).join("\n").trim();

    const result: PassageResult = {
      text,
      html: `<p>${text.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, " ")}</p>`,
      // ESV requires this attribution string; see https://api.esv.org/terms-of-use/
      attribution:
        "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), " +
        "copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. " +
        "Used by permission. All rights reserved.",
      translation: "ESV",
    };

    memCache.set(key, result);
    return result;
  }
}

// ---------------------------------------------------------------------------
// Provider: Biblia API — requires BIBLIA_API_KEY
// ---------------------------------------------------------------------------
// To enable:
//   1. Get an API key at https://biblia.com/api/
//   2. Add to .env: BIBLIA_API_KEY=your_key_here
//   3. Set defaultTranslation to your plan's translation in the frontmatter.
//   4. Pass a BibliaProvider instance to fetchScripture() calls.
//
// Translation IDs used by Biblia:
//   NIV → "niv2011", NLT → "nlt", CSB → "csb", NKJV → "nkjv", NRSV → "nrsv"
// ---------------------------------------------------------------------------

const BIBLIA_TRANSLATION_IDS: Partial<Record<BibleTranslation, string>> = {
  NIV: "niv2011",
  NLT: "nlt",
  CSB: "csb",
  NKJV: "nkjv",
  NRSV: "nrsv",
};

export class BibliaProvider implements ScriptureProvider {
  async fetchPassage(
    reference: string,
    translation: BibleTranslation
  ): Promise<PassageResult> {
    const apiKey = process.env.BIBLIA_API_KEY;
    if (!apiKey) {
      console.warn(
        "[devotionals] BIBLIA_API_KEY is not set. " +
          "Falling back to WEB translation for: " +
          reference
      );
      return bibleApiProvider.fetchPassage(reference, "WEB");
    }

    const bibliaId = BIBLIA_TRANSLATION_IDS[translation];
    if (!bibliaId) {
      console.warn(
        `[devotionals] Translation "${translation}" is not supported by BibliaProvider. ` +
          "Falling back to WEB."
      );
      return bibleApiProvider.fetchPassage(reference, "WEB");
    }

    const key = cacheKey(reference, translation);
    if (memCache.has(key)) return memCache.get(key)!;

    const params = new URLSearchParams({
      passage: reference,
      key: apiKey,
      style: "fullyFormatted",
    });

    const res = await fetch(
      `https://api.biblia.com/v1/bible/content/${bibliaId}.txt.json?${params}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      throw new Error(
        `Biblia API returned ${res.status} for "${reference}" (${bibliaId})`
      );
    }

    const data = await res.json() as { text: string };
    const text = (data.text ?? "").trim();

    const result: PassageResult = {
      text,
      html: `<p>${text.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, " ")}</p>`,
      // Attribution varies by translation license — verify requirements at
      // https://biblia.com/api before publishing these emails to subscribers.
      attribution: `Scripture taken from the ${translation}.`,
      translation,
    };

    memCache.set(key, result);
    return result;
  }
}

// ---------------------------------------------------------------------------
// Default provider instance and convenience function
// ---------------------------------------------------------------------------

export const bibleApiProvider = new BibleApiProvider();
export const esvProvider = new EsvProvider();
export const bibliaProvider = new BibliaProvider();

/**
 * Fetch scripture text using the appropriate provider for the requested
 * translation. Public-domain translations use bible-api.com automatically.
 * Licensed translations fall back to WEB if the required API key is missing.
 */
export async function fetchScripture(
  reference: string,
  translation: BibleTranslation = "WEB"
): Promise<PassageResult> {
  if (translation === "ESV") return esvProvider.fetchPassage(reference, translation);
  if (translation in BIBLIA_TRANSLATION_IDS) return bibliaProvider.fetchPassage(reference, translation);
  return bibleApiProvider.fetchPassage(reference, translation);
}
