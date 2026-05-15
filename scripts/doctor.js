#!/usr/bin/env node
// System diagnostic. Run with: npm run doctor

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

const issues = [];

function check(label, fn, fix) {
  process.stdout.write(`  ${label.padEnd(48)}`);
  try {
    const detail = fn();
    console.log(`${c.green}✓${c.reset} ${c.dim}${detail || ""}${c.reset}`);
  } catch (e) {
    console.log(`${c.red}✗${c.reset}`);
    issues.push({ label, message: e.message, fix });
  }
}

function p(...parts) {
  return path.join(ROOT, ...parts);
}

console.log(`
${c.bold}${c.cyan}Church Site — System Check${c.reset}
${c.dim}Looking for common setup problems...${c.reset}
`);

// 1. Node version
check(
  "Node.js 18 or newer",
  () => {
    const major = parseInt(process.versions.node.split(".")[0], 10);
    if (major < 18) {
      throw new Error(
        `Found Node.js ${process.versions.node}, need 18 or newer.`
      );
    }
    return `v${process.versions.node}`;
  },
  "Install the latest Node.js from https://nodejs.org/ — pick the 'LTS' version on the homepage."
);

// 2. node_modules
check(
  "Dependencies installed",
  () => {
    if (!fs.existsSync(p("node_modules"))) {
      throw new Error("node_modules folder is missing.");
    }
    return "node_modules present";
  },
  "Run: npm install — or simpler: npm run setup"
);

// 3. site.json exists & parses
check(
  "Site settings file (content/site.json)",
  () => {
    if (!fs.existsSync(p("content", "site.json"))) {
      throw new Error("content/site.json is missing.");
    }
    JSON.parse(fs.readFileSync(p("content", "site.json"), "utf8"));
    return "valid JSON";
  },
  "Run: npm run setup"
);

// 4. site.json has required fields
check(
  "Church name and address are filled in",
  () => {
    const site = JSON.parse(fs.readFileSync(p("content", "site.json"), "utf8"));
    const missing = [];
    if (!site.church?.name) missing.push("name");
    if (!site.church?.address?.street) missing.push("street");
    if (!site.church?.address?.city) missing.push("city");
    if (!site.church?.phone) missing.push("phone");
    if (!site.church?.email) missing.push("email");
    if (missing.length) {
      throw new Error(`Missing: ${missing.join(", ")}`);
    }
    return site.church.name;
  },
  "Run: npm run setup — and fill in the church information."
);

// 5. gray-matter installed (used to parse markdown content)
check(
  "Content parser (gray-matter)",
  () => {
    if (!fs.existsSync(p("node_modules", "gray-matter"))) {
      throw new Error("gray-matter package missing from node_modules.");
    }
    return "installed";
  },
  "Run: npm install"
);

// 6. TinaCMS schema exists
check(
  "CMS schema (tina/config.ts)",
  () => {
    if (!fs.existsSync(p("tina", "config.ts"))) {
      throw new Error("tina/config.ts is missing.");
    }
    return "present";
  },
  "Reinstall the template — tina/config.ts is required for the CMS to work."
);

// 7. TinaCloud credentials configured
check(
  "TinaCloud credentials set",
  () => {
    const clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
    if (!clientId || clientId === "your_tina_client_id_here") {
      throw new Error("NEXT_PUBLIC_TINA_CLIENT_ID is not set.");
    }
    return "configured";
  },
  "Create a project at https://app.tina.io, then add NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN to your environment variables (Vercel → Settings → Environment Variables). For local dev, copy .env.local.example to .env.local and fill in the values."
);

// 8. Content folders populated
check(
  "Sermons folder has at least one sermon",
  () => {
    const files = fs.existsSync(p("content", "sermons"))
      ? fs.readdirSync(p("content", "sermons")).filter((f) => f.endsWith(".md"))
      : [];
    if (files.length === 0) throw new Error("content/sermons/ is empty.");
    return `${files.length} sermon${files.length === 1 ? "" : "s"}`;
  },
  "Add at least one sermon via the CMS (Sermons → New Sermon) or place a .md file in content/sermons/."
);

check(
  "Staff folder has at least one person",
  () => {
    const files = fs.existsSync(p("content", "staff"))
      ? fs.readdirSync(p("content", "staff")).filter((f) => f.endsWith(".md"))
      : [];
    if (files.length === 0) throw new Error("content/staff/ is empty.");
    return `${files.length} staff member${files.length === 1 ? "" : "s"}`;
  },
  "Add at least one staff entry via the CMS (Staff → New Staff Member)."
);

// 9. globals.css present
check(
  "Stylesheet (app/globals.css)",
  () => {
    if (!fs.existsSync(p("app", "globals.css"))) {
      throw new Error("app/globals.css missing.");
    }
    return "present";
  },
  "Reinstall the template — this file is required."
);

// 10. package.json scripts exist
check(
  "npm scripts (start, build, setup)",
  () => {
    const pkg = JSON.parse(fs.readFileSync(p("package.json"), "utf8"));
    const required = ["setup", "start", "build", "deploy", "doctor"];
    const missing = required.filter((s) => !pkg.scripts?.[s]);
    if (missing.length) throw new Error(`Missing scripts: ${missing.join(", ")}`);
    return "all present";
  },
  "Reinstall the template — package.json should have these scripts."
);

// 11. DATABASE_URL (only required when features.devotionals is true)
check(
  "Database URL (if devotionals enabled)",
  () => {
    const sitePath = p("content", "site.json");
    if (!fs.existsSync(sitePath)) return "site.json not found — skipping";
    const site = JSON.parse(fs.readFileSync(sitePath, "utf8"));
    const enabled = site?.features?.devotionals === true;
    if (!enabled) return "devotionals disabled — DATABASE_URL not required";
    const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
    if (!url) {
      throw new Error(
        "features.devotionals is true but DATABASE_URL is not set."
      );
    }
    return "set";
  },
  "Set DATABASE_URL in .env.local (copy from Vercel → Storage → your database). Then run: npm run db:setup"
);

// 12a. Email logo URLs render in real inboxes (only relevant when digest or
//      devotionals are enabled). A site-relative path like /images/uploads/x.png
//      can't load in an email — it needs the full https:// URL. The template
//      now normalizes relative paths against NEXT_PUBLIC_SITE_URL at send time,
//      so this check fires only when both the path is relative AND that env
//      var is missing.
function checkEmailLogo(label, settingsRelativePath, featureFlag) {
  check(
    label,
    () => {
      const sitePath = p("content", "site.json");
      if (!fs.existsSync(sitePath)) return "site.json not found — skipping";
      const site = JSON.parse(fs.readFileSync(sitePath, "utf8"));
      const enabled = site?.features?.[featureFlag] === true;
      if (!enabled) return `features.${featureFlag} disabled — skipping`;

      const settingsPath = p(...settingsRelativePath);
      if (!fs.existsSync(settingsPath)) return "settings file not found — skipping";
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
      const logoUrl = (settings.logoUrl ?? "").trim();
      if (!logoUrl) return "no logo set — falls back to church name text";

      if (/^https?:\/\//i.test(logoUrl)) {
        if (/localhost|127\.0\.0\.1/i.test(logoUrl)) {
          throw new Error(
            `logoUrl points at localhost (${logoUrl}). Real emails won't be able to load this.`
          );
        }
        return "absolute URL";
      }

      // Relative path — only OK if NEXT_PUBLIC_SITE_URL is set so we can rewrite it.
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
      if (!siteUrl) {
        throw new Error(
          `logoUrl is a site-relative path (${logoUrl}) but NEXT_PUBLIC_SITE_URL is not set. Emails will render as broken images.`
        );
      }
      if (/localhost|127\.0\.0\.1/i.test(siteUrl)) {
        throw new Error(
          `logoUrl will resolve to ${siteUrl.replace(/\/$/, "")}${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}, which points at localhost. Real emails won't load it.`
        );
      }
      return `relative path → resolves to ${siteUrl}`;
    },
    `Open ${settingsRelativePath.join("/")} and set logoUrl to a full URL starting with https://, OR leave it blank to fall back to your church name as text, OR set NEXT_PUBLIC_SITE_URL in your Vercel environment so the uploaded path can be rewritten at send time.`
  );
}

checkEmailLogo(
  "Digest email logo loads in inboxes",
  ["content", "digest-settings.json"],
  "digest"
);

checkEmailLogo(
  "Devotional email logo loads in inboxes",
  ["content", "devotional-email-settings.json"],
  "devotionals"
);

// 12. Migration files present (only relevant when features.devotionals is true)
check(
  "Database migration files (if devotionals enabled)",
  () => {
    const sitePath = p("content", "site.json");
    if (!fs.existsSync(sitePath)) return "site.json not found — skipping";
    const site = JSON.parse(fs.readFileSync(sitePath, "utf8"));
    const enabled = site?.features?.devotionals === true;
    if (!enabled) return "devotionals disabled — skipping";

    const migrationsDir = p("drizzle", "migrations");
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(
        "drizzle/migrations/ directory is missing. Migration files have not been generated."
      );
    }
    const sqlFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
    if (sqlFiles.length === 0) {
      throw new Error(
        "drizzle/migrations/ exists but contains no .sql files."
      );
    }
    return `${sqlFiles.length} migration file${sqlFiles.length === 1 ? "" : "s"} — run npm run db:migrate to apply any pending`;
  },
  "Run: npm run db:generate  to create migration files from the current schema, then npm run db:migrate  to apply them. See docs/for-developers/database-migrations.md."
);

// ---- Summary ----
console.log("");
if (issues.length === 0) {
  console.log(
    `${c.green}${c.bold}Everything looks good!${c.reset} You're ready to run ${c.bold}npm run start${c.reset}.\n`
  );
  process.exit(0);
} else {
  console.log(
    `${c.red}${c.bold}Found ${issues.length} issue${issues.length === 1 ? "" : "s"}.${c.reset}\n`
  );
  issues.forEach((issue, i) => {
    console.log(`  ${c.bold}${i + 1}. ${issue.label}${c.reset}`);
    console.log(`     ${c.yellow}Problem:${c.reset} ${issue.message}`);
    if (issue.fix) {
      console.log(`     ${c.green}Fix:${c.reset} ${issue.fix}`);
    }
    console.log("");
  });
  console.log(
    `${c.dim}After fixing, run ${c.bold}npm run doctor${c.reset}${c.dim} again to recheck.${c.reset}\n`
  );
  process.exit(1);
}
