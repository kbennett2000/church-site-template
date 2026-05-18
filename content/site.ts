import data from "./site.json";

// =============================================================================
// SITE-WIDE SETTINGS
// =============================================================================
// The actual values for everything below live in /content/site.json so that
// TinaCMS can edit them via the "Site Settings" collection in the browser.
//
// This file exists for two reasons:
//   1. Re-export the JSON-loaded values so /app and /components can import
//      from "@/content/site" instead of touching JSON directly.
//   2. Give code editors a documented map of every field — what it controls,
//      where it shows up on the site, and what kind of value is expected.
//
// IF YOU EDIT THIS FILE'S COMMENTS, also update /public/admin/config.yml
// hints so editors see the same explanations in the CMS UI.
// =============================================================================

// `siteContent` exposes the cross-page editorial copy.
// Add new editorial fields by updating site.json AND
// /public/admin/config.yml together.
export const siteContent = {
  // home.hero — the homepage hero section.
  //   home.hero.headline → The big sentence over the homepage photo.
  //     Shown on the homepage hero (/) above the service-time and address row.
  //     Keep it under ~70 characters; longer headlines wrap awkwardly on mobile.
  home: data.home,

  // about.hero — the /about page hero section.
  //   about.hero.headline → The big sentence on the About page.
  //     Shown at the top of /about, over the placeholder hero image.
  about: data.about,
};

// `churchData` exposes the raw church identity block from site.json.
// /lib/church-info.ts consumes this and adds derived fields (full address,
// Google Maps URL, tel: and mailto: hrefs, primary service) — most of the
// site reads from churchInfo, not from churchData directly.
//
// Field-by-field reference:
//
//   church.name → Full legal/display name of the church.
//     Examples: "Grace Community Church", "First Baptist of Springfield".
//     Shown in: site header, footer, page metadata (SEO titles & social previews),
//     map title, calendar export PRODID, FAQ answers on /give, hero subhead.
//
//   church.shortName → Acronym or short form.
//     Examples: "GCC", "FBC". Shown when there's not room for the full name —
//     primarily as the fallback letter inside the round logo placeholder when
//     no logo image is uploaded. Also appears on the About-page eyebrow tag.
//
//   church.tagline → One-sentence positioning line.
//     Shown in: site footer subtitle.
//     Keep it short and inviting — this is one of the first things visitors
//     read on the site. Bracketed placeholders like "[Your Town]" should be
//     replaced before launch.
//
//   church.logo → Path or URL to the church logo image.
//     Used in the site header (and footer if the layout includes it).
//     Accepts PNG, JPG, SVG. Wide wordmark logos and square icon logos both
//     work — the site auto-scales. Leave empty to use the auto-generated
//     letter circle (first letter of shortName/name on a colored background).
//
//   church.phone → Display-formatted phone number.
//     Examples: "(555) 123-4567" or "555-123-4567".
//     Shown in: footer, visit page, contact page. Auto-converted to a
//     dial-able tel: link by /lib/church-info.ts → churchInfo.phoneHref.
//
//   church.email → General-purpose church email address.
//     Examples: "hello@yourchurch.org", "office@example.church".
//     Shown in: footer, contact page, visit form fallback. Auto-converted to
//     a mailto: link by churchInfo.emailHref.
//
//   church.address.street → Street address line 1.
//   church.address.city → City.
//   church.address.state → Two-letter state code (US) or province code.
//   church.address.zip → ZIP / postal code.
//     The four address fields are combined into a single line and turned into
//     a Google Maps directions URL by /lib/church-info.ts (churchInfo.address.full
//     and churchInfo.address.mapsUrl). Shown in the footer, contact page, and
//     the embedded map on the /visit page.
//
//   church.officeHours → Free-text office hours.
//     Examples: "Mon–Thu", "Tuesday–Friday, 9 AM – 4 PM".
//     Shown beneath the address in the footer and on /connect/contact.
//
//   church.services → Array of recurring weekend services.
//     Each entry: { name, day, time, note, primary }.
//       name → optional label for this service (e.g. "Traditional", "Spanish
//              Service"). Leave empty if you only have one service.
//       day → "Sunday", "Saturday", etc.
//       time → "10:00 AM", "6:30 PM", etc.
//       note → short qualifier shown after the time (e.g. "Communion service"
//              or "Coffee & fellowship after"). Optional.
//       primary → exactly one service should set this to true. The primary
//                 service is what appears in the homepage hero, the page
//                 metadata description, and the footer when only one time can
//                 be shown.
//
//   church.social → Array of social-media profiles. Each entry:
//     { platform, url, label? }
//       platform → one of "facebook", "youtube", "instagram", "twitter",
//                  "linkedin", "twitch", "podcast", or "other". The first
//                  seven map to a recognizable brand icon. "other" is the
//                  escape hatch for platforms without a curated icon
//                  (TikTok, Spotify, Bluesky, your Substack, etc.) — it
//                  renders a generic globe icon and uses the `label`
//                  field for the accessible name.
//       url → full URL (https://… is added automatically if you omit it).
//             Entries with a blank URL are HIDDEN on the site — they never
//             render as broken or dead links. This is the no-broken-link
//             guarantee.
//       label → optional. Required when platform is "other"; ignored for
//               the curated platforms (their display label is fixed).
//     Multiple entries of the same platform are allowed (e.g. a church
//     with separate Facebook pages for the main service and a youth
//     ministry) — both will render, in list order.
//     Used by the social icon row in the footer (every entry that has a
//     URL renders) and by the /watch page's "Subscribe on YouTube" card
//     (renders only if a YouTube entry with a URL exists).
//     If the list is empty, the social row hides entirely — no empty
//     container, no stray spacing.
//
// To add a new platform to the curated list (with a real brand icon),
// extend SOCIAL_PLATFORM_LABELS + SOCIAL_PLATFORM_ICONS in /lib/social.ts
// AND the options array in tina/config.ts under the "social" field.
// Until then, an unsupported platform should be added by editors via
// "Other / Website" with a label — it works without a code change.
export const churchData = data.church;

// `features` controls optional site sections. Defaults to all-off so
// the template ships inert — churches enable features as they set them up.
//
//   features.devotionals  →  Enables /devotionals: reading plans, daily
//                             scripture, and the email subscriber system.
//                             Requires devotional-email-settings.json to be
//                             configured and Resend credentials to be set
//                             before the email phase is wired up.
//                             Toggle in CMS: Site Settings → Feature Flags.
//
//   features.digest       →  Enables /digest: weekly church digest emails
//                             with announcements, events, recent sermons,
//                             and an optional pastor's note. Requires
//                             digest-settings.json to be configured and
//                             Resend credentials set.
//                             Toggle in CMS: Site Settings → Feature Flags.
export const features = data.features ?? { devotionals: false, digest: false };

// `adminAuth` controls how the custom admin pages (/admin/devotionals,
// /admin/digest) and admin API routes (/api/admin/*) are protected.
//
// IMPORTANT: This does NOT control TinaCMS authentication. The CMS at
// /admin/ has its own authentication via TinaCloud (Google/email login
// configured in your TinaCloud project's collaborator list). adminAuth
// only gates the custom site-rendered admin pages.
//
//   adminAuth.provider →
//     "basic"  → HTTP Basic Auth. Single shared password set via the
//                ADMIN_PASSWORD environment variable. Simple to set up,
//                but everyone with admin access shares one credential
//                and the browser prompt is functional, not friendly.
//                This is the default — preserves the existing behavior.
//
//     "google" → Google OAuth via NextAuth (Auth.js). Each authorized
//                person signs in with their own Google account; access
//                is controlled by an email allowlist in
//                /content/admin-access.json (editable in the CMS) plus
//                an optional ADMIN_ALLOWLIST env-var bootstrap fallback.
//                Requires Google Cloud OAuth credentials and a few env
//                vars — see docs/for-tech-volunteers/admin-access-google-oauth.md.
//
// Switch by editing site.json (or via the CMS once Google is set up).
// Restart the dev server / redeploy after changing.
export type AdminAuthProvider = "basic" | "google";
const adminAuthRaw = (data as { adminAuth?: { provider?: string } }).adminAuth;
export const adminAuth: { provider: AdminAuthProvider } =
  adminAuthRaw?.provider === "google"
    ? { provider: "google" }
    : { provider: "basic" };
