// Devotional system type definitions.
//
// Reading plans live in /content/reading-plans/ as git-tracked markdown files.
// Scripture text is fetched at render time from a public Bible API — plans
// store only the reference ("Psalm 23"), never the verse text.
// Subscribers and send logs live in a database (added in a later phase).

/** The email and reading-guide format for a plan. */
export type DevotionalStyle = "soap" | "simple" | "lectio_divina";

/**
 * Bible translations the system can request.
 *
 * Public-domain group (KJV, ASV, WEB, BBE) — fetched from bible-api.com with
 * no API key required. Recommended for out-of-the-box use.
 *
 * Licensed group (ESV, NIV, NLT, CSB, NKJV, NRSV) — require an API key set
 * in .env. See /lib/devotionals/scripture-api.ts for which env var each needs.
 */
export type BibleTranslation =
  | "KJV"  // King James Version — public domain
  | "ASV"  // American Standard Version — public domain
  | "WEB"  // World English Bible — public domain, modern language
  | "BBE"  // Bible in Basic English — public domain
  | "ESV"  // requires NEXT_PUBLIC_ESV_API_KEY
  | "NIV"  // requires BIBLIA_API_KEY
  | "NLT"  // requires BIBLIA_API_KEY
  | "CSB"  // requires BIBLIA_API_KEY
  | "NKJV" // requires BIBLIA_API_KEY
  | "NRSV"; // requires BIBLIA_API_KEY

/** A single day's reading within a plan. */
export type ReadingPlanEntry = {
  /**
   * ISO date string (YYYY-MM-DD). Each date must be unique within a plan
   * and fall between the plan's startDate and endDate.
   */
  date: string;

  /**
   * Standard Bible reference — book, chapter, and optional verse range.
   * Examples: "Psalm 23", "John 3:16-21", "Romans 8:1-17", "Matthew 5".
   * The system fetches the verse text automatically using this reference.
   * Do not store the verse text here.
   */
  scriptureReference: string;

  /**
   * Optional short title for the day, e.g. "The Lord Is My Shepherd" or
   * "God Our Helper". Shown in the email subject line when {{title}} is used
   * in the subject template and on the website entry page.
   */
  title?: string;

  /**
   * Optional notes from the pastor or plan author. Rendered below the
   * scripture text in both the email and the web entry page.
   * Markdown is supported.
   */
  leaderNotes?: string;
};

/**
 * A reading plan — a named sequence of daily scripture passages.
 * One markdown file in /content/reading-plans/ per plan.
 * Metadata is frontmatter; description is the markdown body.
 */
export type ReadingPlan = {
  /**
   * URL-safe identifier matching the filename, e.g. "psalms-in-30-days".
   * Used as the URL segment: /devotionals/psalms-in-30-days.
   */
  slug: string;

  /** Display name shown on the devotionals index and plan pages. */
  title: string;

  /** Markdown body of the plan file — a paragraph or two describing the plan. */
  description: string;

  /**
   * Controls the email layout and reading-guide structure.
   * - "soap": Four-section template: Scripture / Observation / Application / Prayer.
   * - "simple": Scripture block with optional leader note. No extra scaffolding.
   * - "lectio_divina": Four movements: Read / Meditate / Pray / Contemplate.
   */
  style: DevotionalStyle;

  /**
   * Which Bible translation to use when fetching verse text.
   * Public-domain translations (KJV, ASV, WEB) work out of the box.
   * Licensed translations require an API key — see scripture-api.ts.
   */
  defaultTranslation: BibleTranslation;

  /**
   * ISO date (YYYY-MM-DD). All entries must fall on or after this date.
   * Used on the plan page to display the plan's duration and progress.
   */
  startDate: string;

  /**
   * ISO date (YYYY-MM-DD). All entries must fall on or before this date.
   */
  endDate: string;

  /**
   * When true, the email scheduler sends today's entry to subscribers.
   * Set to false while building the plan. Only flip to true after verifying
   * all entries look correct and the email settings are configured.
   */
  isActive: boolean;

  /** All daily entries, sorted ascending by date. */
  entries: ReadingPlanEntry[];
};

/** Verse text returned by any scripture provider. */
export type PassageResult = {
  /**
   * Plain-text verse content without HTML tags.
   * Used for the plain-text part of the devotional email.
   */
  text: string;

  /**
   * HTML-formatted verse content with <p> tags around paragraphs and
   * optional <sup> verse numbers. Used in the email HTML part and on
   * the web entry page.
   */
  html: string;

  /**
   * Attribution string required by some translation licenses.
   * ESV always requires attribution; KJV and other public-domain
   * translations do not. Include in the email footer when non-empty.
   */
  attribution: string;

  /**
   * The translation that was actually served — may differ from the requested
   * translation if a fallback occurred (e.g., ESV key missing → KJV served).
   */
  translation: BibleTranslation;
};

/**
 * Content injected into every outgoing devotional email.
 * Stored as a singleton in /content/devotional-email-settings.json
 * and editable via the TinaCMS "Devotional Email Settings" collection.
 */
export type EmailTemplateContent = {
  /**
   * Display name in the "From:" header.
   * Usually the church name, e.g. "Grace Community Church".
   */
  senderName: string;

  /**
   * Sender email address. Must be from a domain verified in your Resend account.
   * Example: devotionals@yourchurch.org
   * See /docs/for-tech-volunteers/ for Resend domain verification steps.
   */
  senderEmail: string;

  /**
   * Subject line template. Supported variables:
   * - {{date}}      — formatted date, e.g. "June 1"
   * - {{title}}     — the entry's optional title, or empty string
   * - {{reference}} — scripture reference, e.g. "Psalm 23"
   * - {{planTitle}} — the reading plan's title
   *
   * Example: "Your daily reading: {{reference}} — {{date}}"
   */
  subjectTemplate: string;

  /**
   * HTML block rendered above the scripture text in every email.
   * A short greeting or context-setting paragraph works well here.
   */
  intro: string;

  /**
   * HTML block rendered below the scripture text and any leader notes.
   * Closing thoughts, a blessing, or a signature belong here.
   */
  outro: string;

  /**
   * Hex color used for the email header bar and CTA button.
   * Should match or complement the church's brand color.
   * Example: "#1a3c5e"
   */
  brandColor: string;

  /**
   * Optional URL to the church logo shown at the top of each email.
   * Leave empty to display the church name as text instead.
   */
  logoUrl?: string;

  /**
   * Required for CAN-SPAM compliance. Must include:
   * - Your church's physical mailing address
   * - Instructions or a link for unsubscribing
   *
   * Example: "Grace Community Church · 123 Main St, Your Town, ST 12345
   * You're receiving this because you subscribed at yourchurch.org/devotionals.
   * To unsubscribe, reply with 'unsubscribe' in the subject."
   */
  footerText: string;

  /**
   * Per-style intro/outro overrides. When set for a given style, these
   * replace the shared intro/outro for plans using that style.
   * Useful for adding SOAP-specific prompts above the scripture block
   * while keeping a simpler greeting for the "simple" style.
   */
  styleOverrides?: Partial<
    Record<DevotionalStyle, { intro?: string; outro?: string }>
  >;
};
