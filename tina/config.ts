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

    ],
  },
});
