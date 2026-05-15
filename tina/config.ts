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
                fields: [
                  { type: "string", name: "facebook", label: "Facebook URL" },
                  { type: "string", name: "youtube", label: "YouTube URL" },
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
            ui: { itemProps: (item) => ({ label: item?.label ?? "Item" }) },
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "href", label: "URL" },
              {
                type: "object",
                name: "children",
                label: "Dropdown Items",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label ?? "Item" }) },
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
            ui: { itemProps: (item) => ({ label: item?.title ?? "Belief" }) },
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
            ui: { itemProps: (item) => ({ label: item?.title ?? "Event" }) },
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
            ui: { itemProps: (item) => ({ label: `${item?.day ?? ""} ${item?.time ?? ""}`.trim() || "Meeting" }) },
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
          { type: "datetime", name: "date", label: "Date", ui: { dateFormat: "YYYY-MM-DD" } },
          { type: "string", name: "scripture", label: "Scripture Reference (e.g. John 3:16)" },
          { type: "string", name: "book", label: "Bible Book (e.g. John)" },
          { type: "string", name: "youtubeId", label: "YouTube Video ID", ui: { description: "The ID after ?v= in a YouTube URL. Leave blank until the recording is uploaded." } },
          { type: "image", name: "thumbnail", label: "Thumbnail Image" },
          { type: "string", name: "audioUrl", label: "Audio URL (MP3 link, or #)" },
          { type: "string", name: "notesUrl", label: "Notes URL (PDF link, or #)" },
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
          { type: "datetime", name: "date", label: "Post Date", ui: { dateFormat: "YYYY-MM-DD" } },
          { type: "datetime", name: "expires", label: "Expiration Date (optional)", ui: { dateFormat: "YYYY-MM-DD" } },
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
              itemProps: (item: Record<string, unknown>) => ({
                label: (item?.question as string) ?? "Question",
              }),
              description:
                "Questions shown in the accordion at the bottom of the /give page. Add, remove, or reorder as needed.",
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
          { type: "datetime", name: "date", label: "Date Received", ui: { dateFormat: "YYYY-MM-DD" } },
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
              description: "The date of the first entry. Used to display the plan's duration and progress bar.",
            },
          },
          {
            type: "datetime",
            name: "endDate",
            label: "End Date",
            ui: {
              dateFormat: "YYYY-MM-DD",
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
              itemProps: (item) => ({
                label: item?.date
                  ? `${item.date}: ${item?.scriptureReference ?? "(no reference)"}`
                  : (item?.scriptureReference ?? "Entry"),
              }),
              description:
                "One entry per day. Dates within this plan must be unique and fall between the start and end dates above. The system fetches verse text automatically — store only the reference, not the verses themselves.",
            },
            fields: [
              {
                type: "datetime",
                name: "date",
                label: "Date",
                ui: {
                  dateFormat: "YYYY-MM-DD",
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
                "Church logo shown at the top of each email. Leave blank to display the sender name as text instead.",
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

    ],
  },
});
