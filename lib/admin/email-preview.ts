/**
 * Helpers for embedding rendered email HTML in admin preview iframes.
 *
 * Email templates ship with `@media (prefers-color-scheme: dark)` blocks so
 * they render reasonably in inboxes when the recipient's client is in dark
 * mode. In the admin iframe we want a WYSIWYG-ish preview that matches what
 * most subscribers will see — not a preview personalised to the admin's OS
 * theme. Without this override an admin running dark mode sees the email
 * card collapse to near-black with several inline-styled text colours
 * becoming invisible against the dark background.
 */

export function forceLightModePreview(html: string): string {
  const override = `<style>
    :root { color-scheme: light only; }
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #f4f4f5 !important; }
      .email-card { background-color: #ffffff !important; }
      .digest-section { background-color: #fafafa !important; }
      .scripture-bg { background-color: #fafafa !important; }
      .digest-text { color: #18181b !important; }
      .digest-muted { color: #71717a !important; }
    }
  </style>`;
  return html.includes("</head>")
    ? html.replace("</head>", `${override}</head>`)
    : `${override}${html}`;
}
