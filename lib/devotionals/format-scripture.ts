/**
 * Converts raw scripture HTML (from any provider) into email-safe HTML.
 *
 * bible-api.com produces: <sup class="verse-num">1</sup>text
 * ESV/Biblia produce:     [1] text or plain paragraphs
 *
 * Output is a single string of email-compatible HTML:
 *   - Verse numbers rendered as muted superscript spans
 *   - <p> converted to double line-break divs (no CSS margin support in Outlook)
 *   - <br> preserved
 *   - All other tags stripped
 */
export function formatScriptureForEmail(rawHtml: string): string {
  return rawHtml
    // <sup class="verse-num">N</sup> → styled span (email-safe superscript via font-size)
    .replace(
      /<sup[^>]*class="verse-num"[^>]*>(\d+)<\/sup>/g,
      '<span style="font-size:0.65em;vertical-align:super;color:#9ca3af;margin-right:1px">$1</span>'
    )
    // Generic <sup>N</sup> (ESV inline verse numbers)
    .replace(
      /<sup[^>]*>(\d+)<\/sup>/g,
      '<span style="font-size:0.65em;vertical-align:super;color:#9ca3af;margin-right:1px">$1</span>'
    )
    // [N] plain-text verse numbers (ESV/some providers)
    .replace(
      /\[(\d+)\]/g,
      '<span style="font-size:0.65em;vertical-align:super;color:#9ca3af;margin-right:1px">$1</span>'
    )
    // </p><p> → paragraph gap
    .replace(/<\/p>\s*<p[^>]*>/gi, '<br><br>')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '')
    // Preserve explicit line breaks
    .replace(/<br\s*\/?>/gi, '<br>')
    // Strip remaining HTML tags
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Strips all HTML to produce a plain-text scripture string.
 * Used for the plain-text email alternative.
 */
export function formatScriptureAsPlainText(rawHtml: string): string {
  return rawHtml
    // [N] or <sup>N</sup> verse numbers → keep the number inline
    .replace(/<sup[^>]*>(\d+)<\/sup>/g, '[$1] ')
    .replace(/\[(\d+)\]/g, '[$1] ')
    // Paragraph breaks → double newline
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    // Strip remaining tags
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
