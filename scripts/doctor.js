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

// 6. CMS config exists
check(
  "CMS configuration (public/admin/config.yml)",
  () => {
    if (!fs.existsSync(p("public", "admin", "config.yml"))) {
      throw new Error("public/admin/config.yml is missing.");
    }
    return "present";
  },
  "The CMS won't work without this file. Reinstall the template if it's missing."
);

// 7. CMS repo placeholder check
check(
  "CMS connected to a real GitHub repo",
  () => {
    const yml = fs.readFileSync(p("public", "admin", "config.yml"), "utf8");
    if (/repo:\s*your-org\/your-repo/.test(yml) || /repo:\s*your-org\/mvc-revamp/.test(yml)) {
      throw new Error("config.yml still has the placeholder repo path.");
    }
    return "configured";
  },
  "Open public/admin/config.yml — change the 'repo:' line from 'your-org/your-repo' to your actual GitHub repo path (e.g. 'firstbaptist/firstbaptist-site')."
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
