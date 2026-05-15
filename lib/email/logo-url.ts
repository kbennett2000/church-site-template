/**
 * Normalize a logo URL so it works in real emails and preview iframes.
 *
 * TinaCMS image fields (and most "/images/uploads/..." paths) store a
 * site-relative URL. That works fine in the live site (the browser resolves
 * against the current origin) but fails in two contexts we care about:
 *
 *   1. Email clients have no document origin to resolve against, so a relative
 *      src renders as a broken-image icon in the inbox.
 *   2. The admin preview iframe renders via srcDoc, whose base URL is
 *      `about:srcdoc`, so relative paths likewise can't resolve.
 *
 * This helper accepts whatever the editor stored and returns an absolute URL,
 * or `""` to signal "no logo — render the church name as text instead."
 *
 *   ""                     → ""                              (fallback to text)
 *   "/images/uploads/x.png"→ "https://siteUrl/images/uploads/x.png"
 *   "images/uploads/x.png" → "https://siteUrl/images/uploads/x.png"
 *   "//cdn.x.com/y.png"    → "https://cdn.x.com/y.png"
 *   "http://x.com/y.png"   → "http://x.com/y.png"  (unchanged)
 *   "https://x.com/y.png"  → "https://x.com/y.png" (unchanged)
 *
 * When the resolved URL points at localhost we still return it (so local dev
 * previews work) but emit a one-line warning so it's noticed before adopters
 * mail a digest pointing at 127.0.0.1.
 */
export function resolveEmailImageUrl(rawUrl: string | undefined | null, siteUrl: string): string {
  if (!rawUrl) return "";
  const url = rawUrl.trim();
  if (!url) return "";

  // Protocol-relative: "//cdn.example.com/logo.png"
  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  // Already absolute
  if (/^https?:\/\//i.test(url)) {
    if (process.env.NODE_ENV !== "test" && /localhost|127\.0\.0\.1/i.test(url)) {
      // eslint-disable-next-line no-console
      console.warn(
        `[email] logoUrl points at localhost (${url}). This will render as a broken image in real emails. Set NEXT_PUBLIC_SITE_URL or upload the logo to a public URL before sending.`
      );
    }
    return url;
  }

  // Relative path — prefix with the configured site origin.
  const base = (siteUrl || "").replace(/\/+$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;

  if (!base) return "";

  if (process.env.NODE_ENV !== "test" && /localhost|127\.0\.0\.1/i.test(base)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[email] Resolved logoUrl against a localhost siteUrl (${base}${path}). This will render as a broken image in real emails. Set NEXT_PUBLIC_SITE_URL before sending.`
    );
  }

  return `${base}${path}`;
}

/**
 * Quick boolean check: is this a usable absolute URL we'd be comfortable
 * sending in an email? Used by the doctor script.
 */
export function isAbsoluteHttpUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return /^https?:\/\//i.test(url.trim());
}
