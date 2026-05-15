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
//   church.social.facebook → Full Facebook page URL, or empty string.
//     Empty string = social icon link still renders but goes nowhere. The
//     site doesn't currently hide the icon when empty — replace with your
//     real URL or remove the icon from /components/site-footer.tsx.
//     Add your link here: https://facebook.com/your-page
//
//   church.social.youtube → Full YouTube channel URL, or empty string.
//     Used by the /watch page's "Subscribe" card and the social icon row in
//     the footer. Same caveat as Facebook above — empty string still renders
//     the icon.
//     Add your link here: https://youtube.com/@your-channel
//
// To add a new social platform (Instagram, TikTok, etc.), add it to
// church.social in site.json, list it in the CMS config under
// /public/admin/config.yml's "social" object, and render it in
// /components/site-footer.tsx alongside Facebook and YouTube.
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
