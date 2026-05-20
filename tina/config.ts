import { defineConfig } from "tinacms";

// TinaCMS schema — replaces public/admin/config.yml.
//
// Running `npm run cms` (development) or `npm run build` (production) causes
// TinaCMS to generate the admin UI into public/admin/ from this file.
// Collections mirror the content structure under /content/.
//
// When adding a new collection, also update the relevant content loader in
// /content/ and add it to the nav in content/navigation.json via the CMS.
//
// Field types: string | datetime | image | boolean | number | rich-text | object
// Use `isBody: true` on a rich-text field to map it to the markdown body.

// ─────────────────────────────────────────────────────────────────────────
// Calendar-date helper for `type: "datetime"` fields shown as date-only.
// ─────────────────────────────────────────────────────────────────────────
//
// WHY THIS EXISTS — DO NOT "SIMPLIFY" AWAY:
//
// Tina's bundled DateFieldPlugin (the picker rendered for `type: "datetime"`
// when `ui.dateFormat: "YYYY-MM-DD"` is set) hands `ui.parse` a moment-like
// value, and Tina's default serializer routes through `.toISOString()`. That
// path interprets the editor's pick in the *local* timezone and converts it
// to UTC, so a chosen calendar day can drift forward or backward depending
// on the editor's offset. Symptom: "pick May 19, save, reopen → May 18 or
// May 20". For a date-only field this is always wrong — there is no time-
// of-day to preserve, only a calendar day. (See investigation §5.)
//
// Fix: override `ui.parse` to read the calendar date in UTC mode and store
// it as a plain `YYYY-MM-DD` string; override `ui.format` to slice the
// stored value WITHOUT going through `new Date(...)` (which would re-zone
// it on the way back to the picker). Both functions tolerate the legacy
// `YYYY-MM-DDT00:00:00.000Z` shape in already-saved files: slicing the
// first ten characters yields the correct calendar day regardless, so
// opening and re-saving an old file does NOT double-shift.
//
// This is the documented `ui.parse` / `ui.format` override surface — no
// plugin monkey-patching, no schema type change. Apply to every datetime
// field displayed as date-only.
//
// TS NOTE: Tina's `DateTimeField` is a union of three `FieldGeneric` cases
// (List = undefined | true | false), and the `ui.parse` / `ui.format`
// slot ends up structurally requiring a function that satisfies all three
// simultaneously — `(string) => string` and `(string[]) => string[]` at
// once, which is unsatisfiable. The helpers below are runtime-correct;
// the `as never` casts at their call sites (or here, at the definitions)
// are the established escape hatch for this Tina typings limitation.
const calendarDateParseImpl = (value: unknown): string | undefined => {
  if (value == null || value === "") return undefined;
  // String passthrough: covers both new `2026-05-19` shape and legacy
  // `2026-05-19T00:00:00.000Z` shape. Both slice to the same calendar day.
  if (typeof value === "string") return value.slice(0, 10);
  // Moment-like object — what Tina's bundled date picker emits. Prefer the
  // `.utc()` form so we read the YMD parts the editor actually picked,
  // never their local-to-UTC conversion.
  const m = value as {
    utc?: () => { format: (fmt: string) => string };
    format?: (fmt: string) => string;
  };
  if (typeof m.utc === "function") return m.utc().format("YYYY-MM-DD");
  if (typeof m.format === "function") return m.format("YYYY-MM-DD");
  // Native Date fallback — use UTC accessors so a Date constructed from a
  // local-time pick does not get re-zoned a second time.
  if (value instanceof Date) {
    const y = value.getUTCFullYear();
    const mo = String(value.getUTCMonth() + 1).padStart(2, "0");
    const d = String(value.getUTCDate()).padStart(2, "0");
    return `${y}-${mo}-${d}`;
  }
  return undefined;
};

const calendarDateFormatImpl = (value: unknown): string | undefined => {
  if (typeof value !== "string" || value.length === 0) return undefined;
  // Direct slice — NEVER `new Date(value)` here, that would re-zone.
  return value.slice(0, 10);
};

// Cast surface: see TS NOTE above. Runtime is `calendarDate*Impl`; the
// `as never` is purely to satisfy Tina's over-narrow union slot.
const calendarDateParse = calendarDateParseImpl as never;
const calendarDateFormat = calendarDateFormatImpl as never;

// ─────────────────────────────────────────────────────────────────────────
// Sermons: Bible-book dropdown + scripture-reference autoformat
// ─────────────────────────────────────────────────────────────────────────
//
// The sermons collection has two Bible-related fields — `book` and
// `scripture`. Both used to be free text. Free text means editors typed
// "Jn. 3:16" one week and "John 3:16" the next, which broke the
// archive's by-book filter (an exact-string match) the moment the same
// book got two different spellings. The two helpers below close that gap:
//
//   1. BOOKS_OF_THE_BIBLE — a closed list of the 66 books in CANONICAL
//      biblical order (Genesis first, Revelation last), wired into the
//      `book` field's `options:`. Editors pick from a dropdown; the field
//      can never disagree with itself. The first option in the dropdown
//      is { value: "", label: "— None —" } — empty string matches the
//      existing data convention (most sermons that don't have a passage
//      already stored book as ""), and the label makes it visually
//      obvious in the dropdown that "no Bible passage" is the choice.
//
//      Order is canonical, NOT alphabetical, because that's how editors
//      think when they're tagging a sermon. They scan "Genesis, Exodus,
//      Leviticus..." down to the gospels and beyond. Sorting
//      alphabetically would put Acts at the top and Zephaniah at the
//      bottom — wrong for the muscle memory of anyone who knows the
//      Bible.
//
//   2. normalizeScriptureReference — a `ui.parse` autoformat for the
//      `scripture` field. Canonicalizes common abbreviations on save
//      ("Jn. 3:16" → "John 3:16"). See its own comment block for the
//      contract.
//
// Both are pure functions, defined once here so a future addition of
// another scripture-tagged collection (Bible studies? reading plans
// already has scriptureReference, which could adopt this) can reuse
// them without duplication.

// The 66 books of the Protestant canon, in canonical biblical order.
// Frozen so a downstream mutation can't silently reorder the dropdown.
// Used as the `options:` source for the sermons `book` field — wrap each
// entry as { value: b, label: b } and prepend the "— None —" sentinel.
const BOOKS_OF_THE_BIBLE = Object.freeze([
  // Old Testament
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings",
  "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther",
  "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
  "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  // New Testament
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians",
  "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James",
  "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John",
  "Jude", "Revelation",
] as const);

// Lookup map for normalizeScriptureReference. Keys are normalized:
// lowercase, no internal whitespace, no periods. So "1 Cor", "1Cor",
// "1cor.", and "1 cor" all reduce to the same key ("1cor") and hit the
// same canonical name. Values are the canonical book names (matching
// BOOKS_OF_THE_BIBLE exactly — what we want the dropdown filter to find).
//
// Coverage goal: the canonical name itself (so "John 3:16" stays
// "John 3:16"), plus the abbreviations editors commonly type — both
// with- and without-period forms (handled by the strip-period
// normalization), plus variant spellings (Psalm/Psalms, Song of
// Songs/Song of Solomon). Single-letter overlaps with English words
// (Am, Is, Ho, Na...) are kept because they're standard biblical
// abbreviations; a user typing "Am 5" really does mean Amos.
//
// Conflicts deliberately avoided:
//   - "hb"  → Hebrews only (NOT also Habakkuk; standard for Hab is "hab")
//   - "jud" intentionally omitted — ambiguous between Judges and Jude;
//     "judg"/"jdg" go to Judges, "jude" alone goes to Jude.
const ABBREVIATION_TO_CANONICAL: Readonly<Record<string, string>> = Object.freeze({
  // Genesis
  gen: "Genesis", ge: "Genesis", gn: "Genesis", genesis: "Genesis",
  // Exodus
  ex: "Exodus", exo: "Exodus", exod: "Exodus", exodus: "Exodus",
  // Leviticus
  lev: "Leviticus", lv: "Leviticus", leviticus: "Leviticus",
  // Numbers
  num: "Numbers", nu: "Numbers", nm: "Numbers", numbers: "Numbers",
  // Deuteronomy
  deut: "Deuteronomy", dt: "Deuteronomy", deuteronomy: "Deuteronomy",
  // Joshua
  josh: "Joshua", jos: "Joshua", jsh: "Joshua", joshua: "Joshua",
  // Judges
  judg: "Judges", jdg: "Judges", jg: "Judges", judges: "Judges",
  // Ruth
  ru: "Ruth", rth: "Ruth", ruth: "Ruth",
  // 1/2 Samuel
  "1sam": "1 Samuel", "1sa": "1 Samuel", "1sm": "1 Samuel", "1samuel": "1 Samuel",
  "2sam": "2 Samuel", "2sa": "2 Samuel", "2sm": "2 Samuel", "2samuel": "2 Samuel",
  // 1/2 Kings
  "1kgs": "1 Kings", "1ki": "1 Kings", "1k": "1 Kings", "1kings": "1 Kings",
  "2kgs": "2 Kings", "2ki": "2 Kings", "2k": "2 Kings", "2kings": "2 Kings",
  // 1/2 Chronicles
  "1chr": "1 Chronicles", "1ch": "1 Chronicles", "1chron": "1 Chronicles", "1chronicles": "1 Chronicles",
  "2chr": "2 Chronicles", "2ch": "2 Chronicles", "2chron": "2 Chronicles", "2chronicles": "2 Chronicles",
  // Ezra / Nehemiah / Esther
  ezr: "Ezra", ezra: "Ezra",
  neh: "Nehemiah", ne: "Nehemiah", nehemiah: "Nehemiah",
  est: "Esther", es: "Esther", esth: "Esther", esther: "Esther",
  // Job / Psalms / Proverbs / Ecclesiastes / Song
  jb: "Job", job: "Job",
  ps: "Psalms", psa: "Psalms", psm: "Psalms", pss: "Psalms", psalm: "Psalms", psalms: "Psalms",
  prov: "Proverbs", pr: "Proverbs", prv: "Proverbs", proverbs: "Proverbs",
  eccl: "Ecclesiastes", ec: "Ecclesiastes", eccle: "Ecclesiastes", qoh: "Ecclesiastes", ecclesiastes: "Ecclesiastes",
  song: "Song of Solomon", sos: "Song of Solomon", sng: "Song of Solomon",
  songofsongs: "Song of Solomon", songofsolomon: "Song of Solomon", canticles: "Song of Solomon",
  // Major Prophets
  isa: "Isaiah", is: "Isaiah", isaiah: "Isaiah",
  jer: "Jeremiah", je: "Jeremiah", jr: "Jeremiah", jeremiah: "Jeremiah",
  lam: "Lamentations", la: "Lamentations", lamentations: "Lamentations",
  ezek: "Ezekiel", eze: "Ezekiel", ezk: "Ezekiel", ezekiel: "Ezekiel",
  dan: "Daniel", da: "Daniel", dn: "Daniel", daniel: "Daniel",
  // Minor Prophets
  hos: "Hosea", ho: "Hosea", hosea: "Hosea",
  joel: "Joel", jl: "Joel", jol: "Joel",
  am: "Amos", amo: "Amos", amos: "Amos",
  ob: "Obadiah", obad: "Obadiah", obadiah: "Obadiah",
  jon: "Jonah", jnh: "Jonah", jonah: "Jonah",
  mic: "Micah", mi: "Micah", mc: "Micah", micah: "Micah",
  nah: "Nahum", na: "Nahum", nahum: "Nahum",
  hab: "Habakkuk", habakkuk: "Habakkuk",
  zeph: "Zephaniah", zep: "Zephaniah", zp: "Zephaniah", zephaniah: "Zephaniah",
  hag: "Haggai", hg: "Haggai", haggai: "Haggai",
  zech: "Zechariah", zec: "Zechariah", zc: "Zechariah", zechariah: "Zechariah",
  mal: "Malachi", ml: "Malachi", malachi: "Malachi",
  // Gospels
  mt: "Matthew", matt: "Matthew", mat: "Matthew", matthew: "Matthew",
  mk: "Mark", mr: "Mark", mrk: "Mark", mark: "Mark",
  lk: "Luke", lu: "Luke", luk: "Luke", luke: "Luke",
  jn: "John", jhn: "John", john: "John",
  // Acts / Romans
  ac: "Acts", act: "Acts", acts: "Acts",
  rom: "Romans", ro: "Romans", rm: "Romans", romans: "Romans",
  // Pauline letters
  "1cor": "1 Corinthians", "1co": "1 Corinthians", "1corinthians": "1 Corinthians",
  "2cor": "2 Corinthians", "2co": "2 Corinthians", "2corinthians": "2 Corinthians",
  gal: "Galatians", ga: "Galatians", galatians: "Galatians",
  eph: "Ephesians", ephesians: "Ephesians",
  phil: "Philippians", php: "Philippians", philippians: "Philippians",
  col: "Colossians", colossians: "Colossians",
  "1thess": "1 Thessalonians", "1thes": "1 Thessalonians", "1th": "1 Thessalonians", "1thessalonians": "1 Thessalonians",
  "2thess": "2 Thessalonians", "2thes": "2 Thessalonians", "2th": "2 Thessalonians", "2thessalonians": "2 Thessalonians",
  "1tim": "1 Timothy", "1ti": "1 Timothy", "1timothy": "1 Timothy",
  "2tim": "2 Timothy", "2ti": "2 Timothy", "2timothy": "2 Timothy",
  tit: "Titus", ti: "Titus", titus: "Titus",
  phlm: "Philemon", phm: "Philemon", philem: "Philemon", philemon: "Philemon",
  // General epistles
  heb: "Hebrews", hb: "Hebrews", hebrews: "Hebrews",
  jas: "James", jms: "James", james: "James",
  "1pet": "1 Peter", "1pt": "1 Peter", "1pe": "1 Peter", "1peter": "1 Peter",
  "2pet": "2 Peter", "2pt": "2 Peter", "2pe": "2 Peter", "2peter": "2 Peter",
  "1jn": "1 John", "1jhn": "1 John", "1jo": "1 John", "1john": "1 John",
  "2jn": "2 John", "2jhn": "2 John", "2jo": "2 John", "2john": "2 John",
  "3jn": "3 John", "3jhn": "3 John", "3jo": "3 John", "3john": "3 John",
  jude: "Jude",
  // Revelation
  rev: "Revelation", re: "Revelation", revelation: "Revelation",
});

// Normalize a scripture reference's leading book token to canonical form.
//
// WHY THIS EXISTS — DO NOT "SIMPLIFY" INTO A VALIDATOR:
//
// This is a UX nicety, NOT validation. The goal is to reduce inconsistent
// data ("Jn. 3:16" vs "John 3:16" for the same passage) without rejecting
// what an editor types. If an editor enters "Doug 8:14" the function
// recognizes nothing in the leading token, does nothing, and the value
// saves as-is. That's intentional — the sibling `book` field is a closed
// dropdown that enforces a known list; this field is the human-readable
// reference and editors should be free to write things like "1 Cor 13"
// (autoformatted to "1 Corinthians 13") OR a freeform reference the
// autoformat doesn't recognize, with no save-time error either way.
//
// If a future change wants strict validation (reject unknown books,
// cross-check `book` against the leading token in `scripture`), that's a
// separate decision and a separate field-level `validate:` — do not bolt
// it onto this `ui.parse`. The "help, not enforce" posture is what allows
// editors to tag non-scripture sermons too: `book` = "" + scripture = "An
// Open Letter" is a legitimate combination that should never throw.
//
// TRAILING-WHITESPACE PRESERVATION (the on-keystroke bug fix):
//
// Tina runs `ui.parse` on every keystroke. An earlier version of this
// function called `.trim()` on input and reassembled the remainder from
// a regex capture group — which meant typing "John " (John + space) was
// parsed as "John" with no remainder, so the trailing space vanished
// from the editor's view. From the editor's perspective the cursor was
// stuck: press space, see nothing happen, press space again, still
// nothing. The fix: strip ONLY leading whitespace, and reconstruct the
// remainder by positional slice from the (left-trimmed) input rather
// than from a capture group. That way whatever the editor typed after
// the book name — chapter, verse, partial mid-type, or just a space —
// shows up byte-for-byte in the output.
//
// Contract:
//   • Leading whitespace is stripped. Trailing whitespace is PRESERVED
//     verbatim (so on-keystroke parsing doesn't eat spaces).
//   • An all-whitespace input collapses to empty (no fabrication, and
//     the leading-trim already removed everything).
//   • The leading "book" token is parsed greedily: optional 1/2/3
//     prefix (with or without internal whitespace — covers "1Cor",
//     "1 Cor", "1cor"), then letters/periods/internal-whitespace,
//     ending on a letter or period. Multi-word names work ("Song of
//     Songs", "Song of Solomon"). The chapter/verse portion is NOT
//     part of the regex — it falls into the positional slice below.
//   • Lookup key for ABBREVIATION_TO_CANONICAL is the leading token
//     lowercased with periods stripped and ALL whitespace removed — so
//     "1 Cor", "1Cor", "1cor.", "1 cor." all become "1cor".
//   • If the lookup hits, canonical book name replaces the leading
//     token; everything after that token is taken as a positional
//     slice of the left-trimmed input and appended unchanged.
//   • If the lookup misses, the left-trimmed input is returned
//     unchanged. No partial canonicalization, no "did you mean".
//
// This pairs with the `book` field's empty-string + "— None —" pattern:
// when book is "None" (empty), this function still runs against scripture
// the same way. The two fields are intentionally independent — see the
// block comment above BOOKS_OF_THE_BIBLE.
function normalizeScriptureReference(value: string): string {
  // Strip leading whitespace only — trailing whitespace must survive.
  const leftTrimmed = value.replace(/^\s+/, "");
  if (leftTrimmed === "") return "";

  // Match ONLY the leading book token. No chapter/verse remainder
  // capture — that's pulled by positional slice below.
  const match = leftTrimmed.match(/^([123]\s*)?([A-Za-z][A-Za-z.\s]*[A-Za-z.]|[A-Za-z])/);
  if (!match) return leftTrimmed;

  const [matched, leadingDigit, bookPart] = match;
  const key = `${leadingDigit ?? ""}${bookPart}`
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, "");

  const canonical = ABBREVIATION_TO_CANONICAL[key];
  if (!canonical) return leftTrimmed;

  // Positional slice — preserves whatever the editor typed (trailing
  // whitespace, partial chapter mid-type, full reference, etc.) without
  // round-tripping through a regex group that might normalize it.
  const remainder = leftTrimmed.substring(matched.length);
  return `${canonical}${remainder}`;
}

// Cast for Tina's `ui.parse` slot — same typings limitation as the
// calendarDate helpers above (the slot is a union that ends up requiring
// `(string) => string` and `(string[]) => string[]` simultaneously).
const scriptureReferenceParse = ((value?: string) =>
  normalizeScriptureReference(value ?? "")) as never;

export default defineConfig({
  // TinaCloud credentials — set in Vercel environment variables.
  // Get these from https://app.tina.io after creating a project.
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  // Admin UI is built into public/admin/ (served at /admin on the live site).
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  // Media uploads go into public/images/uploads/ and are referenced as /images/uploads/*.
  media: {
    tina: {
      mediaRoot: "images/uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [

      // ======================================================================
      // 1. SITE SETTINGS  (content/site.json)
      // ======================================================================
      {
        name: "site",
        label: "Site Settings",
        path: "content",
        format: "json",
        match: { include: "site" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "object",
            name: "church",
            label: "Church Info",
            fields: [
              { type: "string", name: "name", label: "Full Church Name" },
              { type: "string", name: "shortName", label: "Short Name / Acronym" },
              { type: "string", name: "tagline", label: "Tagline" },
              { type: "image", name: "logo", label: "Logo" },
              { type: "string", name: "phone", label: "Phone" },
              { type: "string", name: "email", label: "Email" },
              { type: "string", name: "officeHours", label: "Office Hours" },
              {
                type: "object",
                name: "address",
                label: "Address",
                fields: [
                  { type: "string", name: "street", label: "Street" },
                  { type: "string", name: "city", label: "City" },
                  { type: "string", name: "state", label: "State (2-letter)" },
                  { type: "string", name: "zip", label: "ZIP Code" },
                ],
              },
              {
                type: "object",
                name: "services",
                label: "Services",
                list: true,
                ui: {
                  itemProps: (item) => {
                    const parts = [item?.day, item?.time, item?.name]
                      .map((p) => (typeof p === "string" ? p.trim() : ""))
                      .filter((p) => p.length > 0);
                    return { label: parts.length > 0 ? parts.join(" • ") : "New service" };
                  },
                  description:
                    "Each entry is one service time shown on the site. Use the label to identify which is which before editing or deleting.",
                },
                fields: [
                  { type: "string", name: "name", label: "Service Name" },
                  {
                    type: "string",
                    name: "day",
                    label: "Day of Week",
                    options: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  },
                  { type: "string", name: "time", label: "Time (e.g. 10:00 AM)" },
                  { type: "string", name: "note", label: "Note (optional)" },
                  { type: "boolean", name: "primary", label: "Primary service?" },
                ],
              },
              {
                type: "object",
                name: "social",
                label: "Social Media",
                list: true,
                ui: {
                  itemProps: (item) => {
                    // Keep these labels in sync with SOCIAL_PLATFORM_LABELS in lib/social.ts.
                    const PLATFORM_LABELS: Record<string, string> = {
                      facebook: "Facebook",
                      youtube: "YouTube",
                      instagram: "Instagram",
                      twitter: "Twitter / X",
                      linkedin: "LinkedIn",
                      twitch: "Twitch",
                      podcast: "Podcast",
                      other: "Other",
                    };
                    const platformKey =
                      typeof item?.platform === "string" ? item.platform : "";
                    const customLabel =
                      typeof item?.label === "string" ? item.label.trim() : "";
                    const platform =
                      platformKey === "other"
                        ? customLabel || "Other"
                        : PLATFORM_LABELS[platformKey] || "Social link";
                    const url =
                      typeof item?.url === "string" ? item.url.trim() : "";
                    return {
                      label: url
                        ? `${platform} — ${url}`
                        : `${platform} (no URL — hidden)`,
                    };
                  },
                  description:
                    'One row per social profile. Rows with a blank URL are hidden on the site — never broken. Multiple entries of the same platform are allowed (e.g. main page + youth-ministry page). Pick "Other / Website" for platforms not in the list (TikTok, Spotify, Bluesky, your Substack, etc.) and give it a label.',
                },
                fields: [
                  {
                    type: "string",
                    name: "platform",
                    label: "Platform",
                    options: [
                      { value: "facebook", label: "Facebook" },
                      { value: "youtube", label: "YouTube" },
                      { value: "instagram", label: "Instagram" },
                      { value: "twitter", label: "Twitter / X" },
                      { value: "linkedin", label: "LinkedIn" },
                      { value: "twitch", label: "Twitch" },
                      { value: "podcast", label: "Podcast (RSS or platform)" },
                      { value: "other", label: "Other / Website" },
                    ],
                  },
                  {
                    type: "string",
                    name: "url",
                    label: "URL",
                    ui: {
                      description:
                        "Full URL including https://. If you paste without https:// the site will add it for you.",
                    },
                  },
                  {
                    type: "string",
                    name: "label",
                    label: "Custom label",
                    ui: {
                      description:
                        'Required when Platform is "Other / Website" — used as the icon\'s tooltip and accessible label. Ignored for the named platforms.',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "home",
            label: "Homepage",
            fields: [
              {
                type: "object",
                name: "hero",
                label: "Hero",
                fields: [{ type: "string", name: "headline", label: "Headline" }],
              },
            ],
          },
          {
            type: "object",
            name: "about",
            label: "About Page",
            fields: [
              {
                type: "object",
                name: "hero",
                label: "Hero",
                fields: [{ type: "string", name: "headline", label: "Headline" }],
              },
            ],
          },
          {
            type: "object",
            name: "features",
            label: "Feature Flags",
            ui: {
              description:
                "Enable or disable optional site features. Tech volunteers set these; editors generally don't need to change them.",
            } as object,
            fields: [
              {
                type: "boolean",
                name: "devotionals",
                label: "Daily Devotionals",
                ui: {
                  description:
                    "Enables the /devotionals section — reading plans, daily scripture pages, and the email subscriber system. Requires additional setup; see docs/for-tech-volunteers/ before enabling.",
                },
              },
              {
                type: "boolean",
                name: "digest",
                label: "Weekly Digest",
                ui: {
                  description:
                    "Enables the /digest section — a weekly email with announcements, upcoming events, recent sermons, and an optional pastor's note. Configure Digest Email Settings before enabling.",
                },
              },
            ],
          },
          {
            type: "object",
            name: "adminAuth",
            label: "Admin Authentication",
            ui: {
              description:
                "How the custom admin pages (/admin/devotionals, /admin/digest) are protected. Does NOT affect TinaCMS at /admin/ — that has its own login. Switching providers requires environment variables and a redeploy; see docs/for-tech-volunteers/admin-access-google-oauth.md.",
            } as object,
            fields: [
              {
                type: "string",
                name: "provider",
                label: "Sign-in method",
                options: [
                  { label: "Shared password (HTTP Basic Auth)", value: "basic" },
                  { label: "Google sign-in (per-person)", value: "google" },
                ],
                ui: {
                  description:
                    'Shared password is the simplest to set up — one ADMIN_PASSWORD env var protects everything. Google sign-in gives each volunteer their own account, with an editable allowlist of admin emails. Pick Google when you have more than one or two admins or want a clean audit trail.',
                },
              },
            ],
          },
        ],
      },

      // ======================================================================
      // 2. NAVIGATION  (content/navigation.json)
      // ======================================================================
      {
        name: "navigation",
        label: "Navigation",
        path: "content",
        format: "json",
        match: { include: "navigation" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Nav Items",
            list: true,
            ui: {
              itemProps: (item) => {
                const label = typeof item?.label === "string" ? item.label.trim() : "";
                const href = typeof item?.href === "string" ? item.href.trim() : "";
                return { label: label || href || "New nav item" };
              },
              description:
                "The top-level links shown in the site header. Drag to reorder. The label here is what visitors see; expand an item to edit its URL or add a dropdown.",
            },
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "href", label: "URL" },
              {
                type: "object",
                name: "children",
                label: "Dropdown Items",
                list: true,
                ui: {
                  itemProps: (item) => {
                    const label = typeof item?.label === "string" ? item.label.trim() : "";
                    const href = typeof item?.href === "string" ? item.href.trim() : "";
                    return { label: label || href || "New dropdown item" };
                  },
                },
                fields: [
                  { type: "string", name: "label", label: "Label" },
                  { type: "string", name: "href", label: "URL" },
                ],
              },
            ],
          },
        ],
      },

      // ======================================================================
      // 3. OUR STORY  (content/story.md)
      // ======================================================================
      {
        name: "story",
        label: "Our Story",
        path: "content",
        format: "md",
        match: { include: "story" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "rich-text",
            name: "body",
            label: "Story",
            isBody: true,
          },
        ],
      },

      // ======================================================================
      // 4. BELIEFS  (content/beliefs.json)
      // ======================================================================
      {
        name: "beliefs",
        label: "What We Believe",
        path: "content",
        format: "json",
        match: { include: "beliefs" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "object",
            name: "beliefs",
            label: "Doctrinal Statements",
            list: true,
            ui: {
              itemProps: (item) => {
                const title = typeof item?.title === "string" ? item.title.trim() : "";
                if (title) return { label: title };
                const statement = typeof item?.statement === "string" ? item.statement.trim() : "";
                if (statement) {
                  const preview = statement.length > 60 ? `${statement.slice(0, 60)}…` : statement;
                  return { label: preview };
                }
                return { label: "New belief" };
              },
              description:
                "Each entry is one doctrinal statement shown on the /beliefs page. The title becomes the heading; the statement is the paragraph below it.",
            },
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "statement", label: "Statement", ui: { component: "textarea" } },
            ],
          },
        ],
      },

      // ======================================================================
      // 5. RECURRING EVENTS  (content/events.json)
      // ======================================================================
      {
        name: "events",
        label: "Recurring Events",
        path: "content",
        format: "json",
        match: { include: "events" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "object",
            name: "events",
            label: "Events",
            list: true,
            ui: {
              itemProps: (item) => {
                const title = typeof item?.title === "string" ? item.title.trim() : "";
                const time = typeof item?.time === "string" ? item.time.trim() : "";
                if (title && time) return { label: `${title} — ${time}` };
                return { label: title || time || "New event" };
              },
              description:
                "Each entry is one recurring event shown on the calendar. The title and time make up the label here so you can find an event without opening it.",
            },
            fields: [
              { type: "string", name: "id", label: "ID (no spaces, e.g. wednesday-bible-study)" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "time", label: "Time (e.g. 7:00 PM)" },
              { type: "number", name: "durationMinutes", label: "Duration (minutes)" },
              { type: "string", name: "location", label: "Location" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              {
                type: "object",
                name: "rule",
                label: "Recurrence",
                fields: [
                  {
                    type: "string",
                    name: "kind",
                    label: "Type",
                    options: ["weekly", "monthly-nth"],
                  },
                  { type: "number", name: "dayOfWeek", label: "Day of Week (0=Sun, 6=Sat)" },
                  { type: "number", name: "nth", label: "Nth occurrence (for monthly-nth, e.g. 1 = first)" },
                ],
              },
            ],
          },
        ],
      },

      // ======================================================================
      // 6. CUSTOM PAGES  (content/pages/*.md)
      // ======================================================================
      {
        name: "pages",
        label: "Custom Pages",
        path: "content/pages",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              (values?.title ?? "page").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          { type: "string", name: "title", label: "Page Title", isTitle: true, required: true },
          { type: "string", name: "description", label: "Meta Description", ui: { component: "textarea" } },
          { type: "rich-text", name: "body", label: "Content", isBody: true },
        ],
      },

      // ======================================================================
      // 7. STAFF  (content/staff/*.md)
      // ======================================================================
      {
        name: "staff",
        label: "Staff",
        path: "content/staff",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              (values?.name ?? "staff").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          { type: "string", name: "name", label: "Name", isTitle: true, required: true },
          { type: "string", name: "role", label: "Role / Title" },
          { type: "string", name: "email", label: "Email (optional)" },
          { type: "image", name: "photo", label: "Photo" },
          { type: "number", name: "order", label: "Display Order (lower = first)" },
          { type: "rich-text", name: "body", label: "Bio", isBody: true },
        ],
      },

      // ======================================================================
      // 8. ELDERS  (content/elders/*.md)
      // ======================================================================
      {
        name: "elders",
        label: "Elders",
        path: "content/elders",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              (values?.name ?? "elder").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          { type: "string", name: "name", label: "Name", isTitle: true, required: true },
          { type: "image", name: "photo", label: "Photo" },
          { type: "number", name: "order", label: "Display Order" },
          { type: "rich-text", name: "body", label: "Bio", isBody: true },
        ],
      },

      // ======================================================================
      // 9. MINISTRIES  (content/ministries/*.md)
      // ======================================================================
      {
        name: "ministries",
        label: "Ministries",
        path: "content/ministries",
        format: "md",
        fields: [
          { type: "string", name: "slug", label: "Slug (URL path, e.g. kids)" },
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "tagline", label: "Tagline" },
          { type: "string", name: "description", label: "Short Description", ui: { component: "textarea" } },
          { type: "image", name: "image", label: "Hero Image" },
          { type: "string", name: "whoFor", label: "Who It's For" },
          {
            type: "object",
            name: "meetings",
            label: "Meeting Times",
            list: true,
            ui: {
              itemProps: (item) => {
                const parts = [item?.day, item?.time, item?.location]
                  .map((p) => (typeof p === "string" ? p.trim() : ""))
                  .filter((p) => p.length > 0);
                return { label: parts.length > 0 ? parts.join(" • ") : "New meeting time" };
              },
              description:
                "When and where this ministry meets. Add one entry per meeting time so each shows up separately on the ministry page.",
            },
            fields: [
              { type: "string", name: "day", label: "Day" },
              { type: "string", name: "time", label: "Time" },
              { type: "string", name: "location", label: "Location" },
              { type: "string", name: "note", label: "Note (optional)" },
            ],
          },
          {
            type: "string",
            name: "whatToExpect",
            label: "What to Expect",
            list: true,
          },
          {
            type: "object",
            name: "leader",
            label: "Ministry Leader",
            fields: [
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "role", label: "Role" },
              { type: "string", name: "email", label: "Email" },
              { type: "image", name: "photo", label: "Photo" },
            ],
          },
          { type: "rich-text", name: "body", label: "Details", isBody: true },
        ],
      },

      // ======================================================================
      // 10. SERMONS  (content/sermons/*.md)
      // ======================================================================
      {
        name: "sermons",
        label: "Sermons",
        path: "content/sermons",
        format: "md",
        ui: {
          filename: {
            slugify: (values) => {
              const date = values?.date ? new Date(values.date).toISOString().slice(0, 10) : "2026-01-01";
              const title = (values?.title ?? "sermon").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return `${date}-${title}`;
            },
          },
        },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "series", label: "Series" },
          { type: "string", name: "speaker", label: "Speaker" },
          { type: "datetime", name: "date", label: "Date", ui: { dateFormat: "YYYY-MM-DD", parse: calendarDateParse, format: calendarDateFormat } },
          {
            type: "string",
            name: "scripture",
            label: "Scripture Reference",
            ui: {
              parse: scriptureReferenceParse,
              description:
                "Standard reference — book, chapter, optional verse range (e.g. 'John 3:16', 'Hebrews 11:1-6', 'Genesis 16'). Common abbreviations are expanded on save: 'Jn. 3:16' → 'John 3:16', '1 Cor 13' → '1 Corinthians 13'. Unrecognized input is saved as-is — no rejection.",
            },
          },
          {
            type: "string",
            name: "book",
            label: "Bible Book",
            options: [
              { value: "", label: "— None —" },
              ...BOOKS_OF_THE_BIBLE.map((b) => ({ value: b, label: b })),
            ],
            ui: {
              description:
                "Pick the Bible book this sermon's passage is from, or '— None —' if the sermon isn't on a specific passage. Used by the archive's Bible-book filter.",
            },
          },
          { type: "string", name: "youtubeId", label: "YouTube Video ID", ui: { description: "The ID after ?v= in a YouTube URL. Leave blank until the recording is uploaded." } },
          { type: "image", name: "thumbnail", label: "Thumbnail Image" },
          { type: "string", name: "audioUrl", label: "Audio URL (MP3 link, or #)" },
          {
            type: "rich-text",
            name: "notes",
            label: "Sermon Notes / Outline",
            ui: {
              description:
                "Type or paste the pastor's notes here. They'll display directly on the sermon page — no external link, no download. Pasting from Google Docs or Word usually works; review heavy formatting after pasting. Leave blank if there are no notes.",
            },
          },
          { type: "rich-text", name: "body", label: "Description", isBody: true },
        ],
      },

      // ======================================================================
      // 11. ANNOUNCEMENTS  (content/announcements/*.md)
      // ======================================================================
      {
        name: "announcements",
        label: "Announcements",
        path: "content/announcements",
        format: "md",
        ui: {
          filename: {
            slugify: (values) => {
              const date = values?.date ? new Date(values.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
              const title = (values?.title ?? "announcement").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return `${date}-${title}`;
            },
          },
        },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Post Date", ui: { dateFormat: "YYYY-MM-DD", parse: calendarDateParse, format: calendarDateFormat } },
          { type: "datetime", name: "expires", label: "Expiration Date (optional)", ui: { dateFormat: "YYYY-MM-DD", parse: calendarDateParse, format: calendarDateFormat } },
          { type: "boolean", name: "pinned", label: "Pin to top?" },
          { type: "string", name: "link", label: "Link URL (optional)" },
          { type: "string", name: "linkLabel", label: "Link Button Label (e.g. Learn more)" },
          { type: "rich-text", name: "body", label: "Announcement Text", isBody: true },
        ],
      },

      // ======================================================================
      // 12. SMALL GROUPS  (content/groups/*.md)
      // ======================================================================
      {
        name: "groups",
        label: "Small Groups",
        path: "content/groups",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              (values?.name ?? "group").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          { type: "string", name: "name", label: "Group Name", isTitle: true, required: true },
          {
            type: "string",
            name: "day",
            label: "Day",
            options: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          },
          { type: "string", name: "time", label: "Time (e.g. 6:30 PM)" },
          { type: "string", name: "neighborhood", label: "Neighborhood / Area" },
          {
            type: "string",
            name: "lifeStage",
            label: "Life Stage",
            options: ["Young Adults", "Couples", "Men", "Women", "Moms", "Mixed", "Empty Nesters"],
          },
          { type: "string", name: "leader", label: "Leader Name" },
          { type: "image", name: "leaderPhoto", label: "Leader Photo (optional)" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "string",
            name: "contactEmail",
            label: "Contact Email",
            description: "Email that receives interest notifications for this group. Leave blank to use the church's main inbox.",
          },
        ],
      },

      // ======================================================================
      // 13. SERVE ROLES  (content/serve-roles/*.md)
      // ======================================================================
      {
        name: "serve_roles",
        label: "Serve Roles",
        path: "content/serve-roles",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              (values?.title ?? "role").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          { type: "string", name: "title", label: "Role Title", isTitle: true, required: true },
          { type: "string", name: "team", label: "Team Name" },
          { type: "string", name: "commitment", label: "Time Commitment" },
          { type: "string", name: "training", label: "Training Description" },
          { type: "string", name: "description", label: "Role Description", ui: { component: "textarea" } },
          {
            type: "string",
            name: "icon",
            label: "Icon",
            options: ["HandHeart", "Baby", "BookOpenCheck", "Music", "Coffee", "Sliders", "UtensilsCrossed", "HandHelping"],
            ui: { description: "Icon shown on the serve page card." },
          },
          { type: "number", name: "order", label: "Display Order (lower = first)" },
        ],
      },

      // ======================================================================
      // 15. GIVING SETTINGS  (content/giving.json)
      // ======================================================================
      // Singleton document — one giving configuration for the whole site.
      // Provider-specific sections are conditionally shown based on the
      // selected provider value so editors only see relevant fields.
      {
        name: "giving",
        label: "Giving",
        path: "content",
        format: "json",
        match: { include: "giving" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "string",
            name: "provider",
            label: "Giving Provider",
            options: [
              { label: "Offline Only (no online giving)", value: "offline_only" },
              { label: "Planning Center Giving", value: "planning_center" },
              { label: "Tithe.ly", value: "tithely" },
              { label: "Pushpay", value: "pushpay" },
              { label: "Subsplash Giving", value: "subsplash" },
              { label: "Stripe Payment Link", value: "stripe" },
              { label: "Custom URL", value: "custom_url" },
            ],
            ui: {
              description:
                'Which platform do you use for online donations? If you don\'t have online giving yet, choose "Offline Only" — the /give page will display your mailing address and in-person instructions instead of a button.',
            },
          },
          {
            type: "string",
            name: "displayMode",
            label: "How should the Give button open?",
            options: [
              { label: "New tab (recommended for most providers)", value: "newTab" },
              { label: "Same page / redirect", value: "redirect" },
              { label: "Modal overlay (Planning Center only)", value: "modal" },
            ],
            ui: {
              description:
                '"Modal overlay" only works with Planning Center. For all other providers, use "New tab" or "Same page".',
            },
          },
          {
            type: "string",
            name: "callToAction",
            label: "Button Label",
            ui: {
              description:
                'Text shown on the Give button across the site. Short labels work best: "Give", "Donate", "Give Now".',
            },
          },
          {
            type: "string",
            name: "supportingMessage",
            label: "Supporting Message",
            ui: {
              component: "textarea",
              description:
                "One sentence shown on the /give page below the headline. Tell donors what their gift accomplishes.",
            },
          },

          // ── Planning Center ──────────────────────────────────────────────
          {
            type: "object",
            name: "planningCenter",
            label: "Planning Center Settings",
            // Shown when provider === "planning_center"
            ui: {
              description:
                'Fill in these fields when your provider is set to "Planning Center Giving".',
            } as object,
            fields: [
              {
                type: "string",
                name: "subdomain",
                label: "Planning Center Subdomain",
                ui: {
                  description:
                    'The part before .churchcenter.com in your giving URL. If donors give at mychurch.churchcenter.com/giving, your subdomain is "mychurch". Find it at the top of your Planning Center Giving admin page.',
                },
              },
            ],
          },

          // ── Tithe.ly ─────────────────────────────────────────────────────
          {
            type: "object",
            name: "tithely",
            label: "Tithe.ly Settings",
            ui: {
              description:
                'Fill in these fields when your provider is set to "Tithe.ly". Use formUrl if Tithe.ly gave you a custom link; otherwise enter your Organization ID.',
            } as object,
            fields: [
              {
                type: "string",
                name: "organizationId",
                label: "Organization ID",
                ui: {
                  description:
                    "Found in your Tithe.ly admin under Settings → Organization. It looks like a short number.",
                },
              },
              {
                type: "string",
                name: "formUrl",
                label: "Custom Form URL (optional)",
                ui: {
                  description:
                    "If Tithe.ly gave you a direct link to your giving form, paste it here. Leave blank to use the Organization ID.",
                },
              },
            ],
          },

          // ── Pushpay ───────────────────────────────────────────────────────
          {
            type: "object",
            name: "pushpay",
            label: "Pushpay Settings",
            ui: {
              description:
                'Fill in this field when your provider is set to "Pushpay".',
            } as object,
            fields: [
              {
                type: "string",
                name: "merchantHandle",
                label: "Merchant Handle",
                ui: {
                  description:
                    "Your Pushpay merchant handle — the part after pushpay.com/g/ in your giving link. Found in your Pushpay admin under Settings → Giving Links.",
                },
              },
            ],
          },

          // ── Subsplash ─────────────────────────────────────────────────────
          {
            type: "object",
            name: "subsplash",
            label: "Subsplash Giving Settings",
            ui: {
              description:
                'Fill in this field when your provider is set to "Subsplash Giving".',
            } as object,
            fields: [
              {
                type: "string",
                name: "embedCode",
                label: "Embed Code",
                ui: {
                  component: "textarea",
                  description:
                    "The embed snippet Subsplash provided (usually a <script> tag). Paste the full code here — it will be injected on your /give page.",
                },
              },
            ],
          },

          // ── Stripe ────────────────────────────────────────────────────────
          {
            type: "object",
            name: "stripe",
            label: "Stripe Payment Link Settings",
            ui: {
              description:
                'Fill in this field when your provider is set to "Stripe Payment Link".',
            } as object,
            fields: [
              {
                type: "string",
                name: "paymentLinkUrl",
                label: "Stripe Payment Link URL",
                ui: {
                  description:
                    'Your Stripe Payment Link URL — starts with https://buy.stripe.com/. Create one in the Stripe dashboard under "Payment Links".',
                },
              },
            ],
          },

          // ── Custom URL ────────────────────────────────────────────────────
          {
            type: "object",
            name: "customUrl",
            label: "Custom URL Settings",
            ui: {
              description:
                'Fill in these fields when your provider is set to "Custom URL".',
            } as object,
            fields: [
              {
                type: "string",
                name: "url",
                label: "Giving URL",
                ui: { description: "Full URL of your hosted donation page." },
              },
              {
                type: "string",
                name: "linkText",
                label: "Link Text",
                ui: {
                  description:
                    'Shown in the "Powered by" attribution on the /give page. Example: "Kindrid", "Vanco", "Church Community Builder".',
                },
              },
            ],
          },

          // ── Offline giving (shown for all providers) ───────────────────────
          {
            type: "object",
            name: "offlineGiving",
            label: "Offline Giving Options",
            ui: {
              description:
                "These appear as supplemental methods on the /give page for any provider. For offline-only churches they are the primary content.",
            } as object,
            fields: [
              { type: "boolean", name: "enabled", label: "Show offline giving methods?" },
              {
                type: "string",
                name: "mailingAddress",
                label: "Mailing Address",
                ui: {
                  component: "textarea",
                  description:
                    "Full address to mail checks, including any make-payable-to instructions. Leave blank to hide this option.",
                },
              },
              {
                type: "string",
                name: "inPersonInstructions",
                label: "In-Person Giving Instructions",
                ui: {
                  component: "textarea",
                  description:
                    "Where to find the giving box or plate during services. Leave blank to hide.",
                },
              },
              {
                type: "object",
                name: "textToGive",
                label: "Text-to-Give",
                fields: [
                  { type: "boolean", name: "enabled", label: "Enable text-to-give?" },
                  {
                    type: "string",
                    name: "number",
                    label: "Phone Number",
                    ui: { description: "The number donors text. Provided by your text-to-give service." },
                  },
                  {
                    type: "string",
                    name: "keyword",
                    label: "Keyword",
                    ui: { description: 'The word donors text (e.g. "GIVE"). Leave blank if your service uses the dollar amount directly.' },
                  },
                ],
              },
            ],
          },

          // ── FAQ ───────────────────────────────────────────────────────────
          {
            type: "object",
            name: "faq",
            label: "Giving FAQ",
            list: true,
            ui: {
              itemProps: (item: Record<string, unknown>) => {
                const question = typeof item?.question === "string" ? (item.question as string).trim() : "";
                return { label: question || "New question" };
              },
              description:
                "Questions shown in the accordion at the bottom of the /give page. Add, remove, or reorder as needed. Read the question label before deleting to confirm you're removing the right one.",
            },
            fields: [
              {
                type: "string",
                name: "question",
                label: "Question",
                isTitle: true,
                required: true,
              },
              {
                type: "string",
                name: "answer",
                label: "Answer",
                ui: { component: "textarea" },
              },
            ],
          },
        ],
      },

      // ======================================================================
      // 14. PRAYER REQUESTS  (content/prayer-requests/*.md)
      // ======================================================================
      {
        name: "prayer_requests",
        label: "Prayer Requests",
        path: "content/prayer-requests",
        format: "md",
        ui: {
          filename: {
            slugify: (values) => {
              const date = new Date().toISOString().slice(0, 10);
              const initials = (values?.initials ?? "anon").toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return `${date}-${initials}`;
            },
          },
        },
        fields: [
          { type: "string", name: "initials", label: "Initials (shown on prayer wall, e.g. J. D.)" },
          { type: "datetime", name: "date", label: "Date Received", ui: { dateFormat: "YYYY-MM-DD", parse: calendarDateParse, format: calendarDateFormat } },
          { type: "rich-text", name: "body", label: "Prayer Request", isBody: true },
        ],
      },

      // ======================================================================
      // 16. READING PLANS  (content/reading-plans/*.md)
      // ======================================================================
      // One markdown file per plan. Frontmatter holds all metadata and the
      // full entries list. The markdown body is the plan description.
      //
      // Files in content/reading-plans/_examples/ are starter templates for
      // adopting churches; they are NOT shown in this collection (path only
      // matches direct children, not subdirectories).
      //
      // Feature flag: Site Settings → Feature Flags → Daily Devotionals must
      // be enabled before the /devotionals pages are publicly accessible.
      {
        name: "readingPlans",
        label: "Reading Plans",
        path: "content/reading-plans",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              (values?.slug ?? "reading-plan")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Plan Title",
            isTitle: true,
            required: true,
            ui: { description: 'Shown on the /devotionals index and on the plan page. Example: "Psalms in 30 Days".' },
          },
          {
            type: "string",
            name: "slug",
            label: "Slug (URL path)",
            required: true,
            ui: {
              description:
                "URL-safe identifier used in the web address. Use lowercase letters, numbers, and hyphens only. Example: psalms-in-30-days → /devotionals/psalms-in-30-days",
            },
          },
          {
            type: "string",
            name: "style",
            label: "Email & Reading Style",
            options: [
              { label: "Simple (verse of the day, no extra prompts)", value: "simple" },
              { label: "SOAP (Scripture / Observation / Application / Prayer)", value: "soap" },
              { label: "Lectio Divina (Read / Meditate / Pray / Contemplate)", value: "lectio_divina" },
            ],
            ui: {
              description:
                "Controls how the devotional email is formatted and what journaling prompts appear on the website entry page. 'Simple' works well for broad audiences; 'SOAP' and 'Lectio Divina' suit churches that already teach those methods.",
            },
          },
          {
            type: "string",
            name: "defaultTranslation",
            label: "Bible Translation",
            options: [
              { label: "WEB — World English Bible (public domain, modern)", value: "WEB" },
              { label: "KJV — King James Version (public domain)", value: "KJV" },
              { label: "ASV — American Standard Version (public domain)", value: "ASV" },
              { label: "BBE — Bible in Basic English (public domain)", value: "BBE" },
              { label: "ESV — requires NEXT_PUBLIC_ESV_API_KEY", value: "ESV" },
              { label: "NIV — requires BIBLIA_API_KEY", value: "NIV" },
              { label: "NLT — requires BIBLIA_API_KEY", value: "NLT" },
              { label: "CSB — requires BIBLIA_API_KEY", value: "CSB" },
              { label: "NKJV — requires BIBLIA_API_KEY", value: "NKJV" },
              { label: "NRSV — requires BIBLIA_API_KEY", value: "NRSV" },
            ],
            ui: {
              description:
                "The translation used when fetching verse text for this plan. WEB, KJV, ASV, and BBE work immediately — no API key needed. Licensed translations (ESV, NIV, etc.) require an API key in .env; see docs/for-developers/devotional-architecture.md.",
            },
          },
          {
            type: "datetime",
            name: "startDate",
            label: "Start Date",
            ui: {
              dateFormat: "YYYY-MM-DD",
              parse: calendarDateParse,
              format: calendarDateFormat,
              description: "The date of the first entry. Used to display the plan's duration and progress bar.",
            },
          },
          {
            type: "datetime",
            name: "endDate",
            label: "End Date",
            ui: {
              dateFormat: "YYYY-MM-DD",
              parse: calendarDateParse,
              format: calendarDateFormat,
              description: "The date of the last entry. Must be on or after the start date.",
            },
          },
          {
            type: "boolean",
            name: "isActive",
            label: "Active — send emails to subscribers?",
            ui: {
              description:
                "When enabled, the email scheduler sends today's entry to all subscribers of this plan. Set to false while you're building the plan. Only flip to true after verifying entries look correct and the Devotional Email Settings are configured.",
            },
          },
          {
            type: "object",
            name: "entries",
            label: "Daily Readings",
            list: true,
            ui: {
              itemProps: (item) => {
                const rawDate = item?.date;
                let date = "";
                if (typeof rawDate === "string" && rawDate.length > 0) {
                  const parsed = new Date(rawDate);
                  date = Number.isNaN(parsed.getTime()) ? rawDate : parsed.toISOString().slice(0, 10);
                }
                const ref = typeof item?.scriptureReference === "string" ? item.scriptureReference.trim() : "";
                if (date && ref) return { label: `${date} — ${ref}` };
                return { label: date || ref || "New reading" };
              },
              description:
                "One entry per day. Dates within this plan must be unique and fall between the start and end dates above. The system fetches verse text automatically — store only the reference, not the verses themselves. Each entry's label shows its date and scripture so you can identify it without opening it.",
            },
            fields: [
              {
                type: "datetime",
                name: "date",
                label: "Date",
                ui: {
                  dateFormat: "YYYY-MM-DD",
                  parse: calendarDateParse,
                  format: calendarDateFormat,
                  description: "The date this entry is sent and displayed. Must be unique within this plan.",
                },
              },
              {
                type: "string",
                name: "scriptureReference",
                label: "Scripture Reference",
                required: true,
                ui: {
                  description:
                    "Standard Bible reference — book, chapter, and optional verse range. The system fetches the verse text automatically at display time. Examples: 'Psalm 23', 'John 3:16-21', 'Romans 8:1-17', 'Matthew 5'. Do not paste the verse text here.",
                },
              },
              {
                type: "string",
                name: "title",
                label: "Day Title (optional)",
                ui: {
                  description:
                    "A short name for the day's reading, e.g. 'The Lord Is My Shepherd'. Shown on the website and in the email subject when {{title}} is used in the subject template.",
                },
              },
              {
                type: "string",
                name: "leaderNotes",
                label: "Leader Notes (optional)",
                ui: {
                  component: "textarea",
                  description:
                    "Optional note from the pastor or plan author, shown below the scripture on the website and in the email. A question to ponder, a brief application point, or context about the passage. Markdown is supported.",
                },
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Plan Description",
            isBody: true,
            ui: {
              description:
                "A paragraph or two describing what this plan covers and how to use it. Shown on the plan detail page and the devotionals index.",
            },
          },
        ],
      },

      // ======================================================================
      // 17. DEVOTIONAL EMAIL SETTINGS  (content/devotional-email-settings.json)
      // ======================================================================
      // Singleton document — one email configuration for all devotional plans.
      // Per-style overrides let you customize the intro/outro for SOAP vs.
      // Simple emails while sharing the rest of the settings.
      {
        name: "devotionalEmailSettings",
        label: "Devotional Email Settings",
        path: "content",
        format: "json",
        match: { include: "devotional-email-settings" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "string",
            name: "senderName",
            label: "Sender Name",
            ui: {
              description:
                'The name shown in the "From:" field of every devotional email. Usually your church name.',
            },
          },
          {
            type: "string",
            name: "senderEmail",
            label: "Sender Email Address",
            ui: {
              description:
                "Must be an address on a domain you have verified in your Resend account. Example: devotionals@yourchurch.org. NOTE: If the RESEND_FROM_EMAIL environment variable is set (recommended for production), it overrides this field. Set the env var in Vercel → Settings → Environment Variables.",
            },
          },
          {
            type: "string",
            name: "subjectTemplate",
            label: "Subject Line Template",
            ui: {
              description:
                "Template for the email subject line. Available variables: {{date}} (e.g. June 1), {{title}} (the entry's optional title), {{reference}} (e.g. Psalm 23), {{planTitle}} (the reading plan name). Example: 'Your daily reading: {{reference}} — {{date}}'",
            },
          },
          {
            type: "string",
            name: "intro",
            label: "Intro (above scripture)",
            ui: {
              component: "textarea",
              description:
                "HTML block shown above the scripture text in every email. A short greeting or one-sentence context works well. HTML tags like <p> and <em> are supported.",
            },
          },
          {
            type: "string",
            name: "outro",
            label: "Outro (below scripture and notes)",
            ui: {
              component: "textarea",
              description:
                "HTML block shown below the scripture and any leader notes. Closing thoughts, a blessing, or a signature belong here.",
            },
          },
          {
            type: "string",
            name: "brandColor",
            label: "Brand Color (hex)",
            ui: {
              description:
                "Hex color for the email header bar and button. Should match your church's primary color. Example: #1a3c5e",
            },
          },
          {
            type: "image",
            name: "logoUrl",
            label: "Logo (optional)",
            ui: {
              description:
                "Church logo shown at the top of each devotional email. Recommended size ~200px wide, transparent PNG. After deploy, the uploaded path is prefixed with your live site URL automatically — but only if NEXT_PUBLIC_SITE_URL is set in your hosting environment. If you'd rather use a logo hosted elsewhere, paste a full URL starting with https://. Leave blank to display the sender name as text instead.",
              validate: (value?: string) => {
                if (!value) return undefined;
                const v = String(value).trim();
                // Absolute URLs are fine.
                if (/^https?:\/\//i.test(v)) return undefined;
                // Site-relative paths get rewritten at send time as long as
                // NEXT_PUBLIC_SITE_URL is configured.
                if (v.startsWith("/")) return undefined;
                return "Logo must be either an uploaded file (starts with /) or a full URL (starts with https://).";
              },
            },
          },
          {
            type: "string",
            name: "footerText",
            label: "Footer / Unsubscribe Text",
            ui: {
              component: "textarea",
              description:
                "Required for CAN-SPAM compliance. Must include your church's physical mailing address and instructions for unsubscribing. This text appears at the bottom of every devotional email.",
            },
          },
          {
            type: "object",
            name: "soapOverride",
            label: "SOAP Style Override (optional)",
            fields: [
              {
                type: "string",
                name: "intro",
                label: "Intro (overrides shared intro for SOAP emails)",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "outro",
                label: "Outro (overrides shared outro for SOAP emails)",
                ui: { component: "textarea" },
              },
            ],
            ui: {
              description:
                "When set, these replace the shared intro/outro for plans using the SOAP style. Useful for adding SOAP-specific prompts (S / O / A / P) above the scripture block.",
            } as object,
          },
          {
            type: "object",
            name: "simpleOverride",
            label: "Simple Style Override (optional)",
            fields: [
              {
                type: "string",
                name: "intro",
                label: "Intro",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "outro",
                label: "Outro",
                ui: { component: "textarea" },
              },
            ],
            ui: {
              description:
                "When set, these replace the shared intro/outro for plans using the Simple style.",
            } as object,
          },
          {
            type: "object",
            name: "lectioOverride",
            label: "Lectio Divina Style Override (optional)",
            fields: [
              {
                type: "string",
                name: "intro",
                label: "Intro",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "outro",
                label: "Outro",
                ui: { component: "textarea" },
              },
            ],
            ui: {
              description:
                "When set, these replace the shared intro/outro for plans using the Lectio Divina style.",
            } as object,
          },
        ],
      },


      // ======================================================================
      // 18. DIGEST EMAIL SETTINGS  (content/digest-settings.json)
      // ======================================================================
      // Singleton document — configuration for the weekly church digest email.
      {
        name: "digestSettings",
        label: "Digest Email Settings",
        path: "content",
        format: "json",
        match: { include: "digest-settings" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "boolean",
            name: "isEnabled",
            label: "Enable Weekly Digest",
            ui: { description: "Turn the digest on or off without disabling the feature flag. Useful for pausing sends during a holiday break." },
          },
          {
            type: "string",
            name: "senderName",
            label: "Sender Name",
            ui: { description: 'Shown in the "From:" field. Usually your church name.' },
          },
          {
            type: "string",
            name: "senderEmail",
            label: "Sender Email Address",
            ui: { description: "Must be on a Resend-verified domain. RESEND_FROM_EMAIL env var overrides this in production." },
          },
          {
            type: "string",
            name: "subjectTemplate",
            label: "Subject Line Template",
            ui: { description: "Variables: {{churchName}}, {{weekStart}}, {{weekEnd}}. Example: {{churchName}} — Week of {{weekStart}}" },
          },
          {
            type: "string",
            name: "sendDay",
            label: "Send Day",
            options: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            ui: { description: "Day of week the digest goes out." },
          },
          {
            type: "number",
            name: "sendHour",
            label: "Send Hour (0–23, church timezone)",
            ui: { description: "Hour of day to send, in the church's timezone. 14 = 2 PM." },
          },
          {
            type: "string",
            name: "sendTimezone",
            label: "Church Timezone (IANA)",
            ui: { description: "IANA timezone string for send scheduling. Example: America/Denver. Unlike devotionals, the digest sends at one moment for all subscribers." },
          },
          {
            type: "number",
            name: "eventsLookaheadDays",
            label: "Events Lookahead (days)",
            ui: { description: "How many days of upcoming events to include. Default 10." },
          },
          {
            type: "number",
            name: "sermonsLookbackCount",
            label: "Recent Sermons to Include",
            ui: { description: "How many recent sermons to feature. Default 1 (most recent)." },
          },
          {
            type: "string",
            name: "brandColor",
            label: "Brand Color (hex)",
            ui: { description: "Hex color for the email header and buttons. Example: #1a3c5e" },
          },
          {
            type: "image",
            name: "logoUrl",
            label: "Logo (optional)",
            ui: {
              description:
                "Church logo shown at the top of each digest email. Recommended size ~200px wide, transparent PNG. Uploaded files are rewritten to your live site URL at send time (requires NEXT_PUBLIC_SITE_URL set in hosting). If you'd rather use a logo hosted elsewhere, paste a full URL starting with https://. Leave blank to display sender name as text.",
              validate: (value?: string) => {
                if (!value) return undefined;
                const v = String(value).trim();
                if (/^https?:\/\//i.test(v)) return undefined;
                if (v.startsWith("/")) return undefined;
                return "Logo must be either an uploaded file (starts with /) or a full URL (starts with https://).";
              },
            },
          },
          {
            type: "string",
            name: "footerText",
            label: "Footer / Unsubscribe Text",
            ui: {
              component: "textarea",
              description: "Required for CAN-SPAM compliance. Include your church's physical address and an unsubscribe note.",
            },
          },
          {
            type: "rich-text",
            name: "introHtml",
            label: "Intro (optional)",
            ui: { description: "Opening block shown above the digest content. A short greeting or seasonal note." },
          },
        ],
      },

      // ======================================================================
      // 20. ADMIN ACCESS  (content/admin-access.json)
      // ======================================================================
      // List of Google accounts permitted to sign in to the custom admin
      // pages when Site Settings → Admin Authentication is set to "Google
      // sign-in". Only consulted in that mode; the Basic Auth path ignores
      // this file. The ADMIN_ALLOWLIST env var can supplement this list
      // (useful for bootstrapping when the list is empty).
      {
        name: "adminAccess",
        label: "Admin Access",
        path: "content",
        format: "json",
        match: { include: "admin-access" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "object",
            name: "admins",
            label: "Admins",
            list: true,
            ui: {
              itemProps: (item) => {
                const email = typeof item?.email === "string" ? (item.email as string).trim() : "";
                return { label: email || "New admin" };
              },
              description:
                "Each entry is one Google account that can sign in. The email must match exactly what Google has on file for that account — it's the same address you'd see in their Gmail or Google Workspace. Confirm the email in the label before removing an admin.",
            },
            fields: [
              {
                type: "string",
                name: "email",
                label: "Email",
                isTitle: true,
                required: true,
                ui: {
                  description:
                    "The email associated with the Google account that should have admin access. Case-insensitive. Works with both gmail.com addresses and Google Workspace custom domains (e.g. pastor@yourchurch.org if your church uses Google Workspace).",
                },
              },
              {
                type: "string",
                name: "role",
                label: "Role",
                options: [
                  { label: "Admin (full access)", value: "admin" },
                ],
                ui: {
                  description:
                    'Currently only "admin" exists. Reserved for future roles like "editor" with narrower permissions.',
                },
              },
              {
                type: "datetime",
                name: "addedAt",
                label: "Added On",
                ui: {
                  dateFormat: "YYYY-MM-DD",
                  parse: calendarDateParse,
                  format: calendarDateFormat,
                  description: "When this person was given access. For audit purposes only.",
                },
              },
              {
                type: "string",
                name: "addedBy",
                label: "Added By (note)",
                ui: {
                  description:
                    'Optional note about who granted access and why. Example: "Pastor invited 2026-05-01 — leads communications team".',
                },
              },
            ],
          },
        ],
      },

      // ======================================================================
      // 19. DIGEST NOTES  (content/digest-notes/*.md)
      // ======================================================================
      // One file per week. The digest send job picks the most recent note
      // with status="ready" whose weekOf falls within the digest's send week.
      {
        name: "digestNotes",
        label: "Pastor's Notes (Digest)",
        path: "content/digest-notes",
        format: "md",
        ui: {
          filename: {
            slugify: (values) => {
              const date = values?.weekOf
                ? new Date(values.weekOf).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10);
              return date;
            },
          },
        },
        fields: [
          {
            type: "datetime",
            name: "weekOf",
            label: "Week Of (Monday of the week)",
            required: true,
            ui: {
              dateFormat: "YYYY-MM-DD",
              parse: calendarDateParse,
              format: calendarDateFormat,
              description: "The Monday of the week this note belongs to. Use YYYY-MM-DD format.",
            },
          },
          {
            type: "string",
            name: "title",
            label: "Title (optional)",
            ui: { description: 'Shown above the note body. Example: "A Note from Pastor Sarah"' },
          },
          {
            type: "string",
            name: "signedBy",
            label: "Signed By (optional)",
            ui: { description: 'Attribution shown below the note. Example: "Pastor Sarah" or "The GCC Staff"' },
          },
          {
            type: "string",
            name: "status",
            label: "Status",
            required: true,
            options: [
              { value: "draft", label: "Draft — not included in sends" },
              { value: "ready", label: "Ready — will be included in the next digest send" },
              { value: "sent", label: "Sent — already delivered" },
            ],
            ui: { description: 'Only "ready" notes are picked up by the send job. Mark as "sent" after delivery to prevent re-inclusion.' },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Note",
            isBody: true,
          },
        ],
      },

    ],
  },
});
