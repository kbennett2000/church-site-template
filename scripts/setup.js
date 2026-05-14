#!/usr/bin/env node
// First-run setup. Walks a non-technical user through:
//   1. Checking Node.js version
//   2. Installing dependencies (npm install)
//   3. Collecting church name, address, contact info, service time
//   4. Picking a color palette
//   5. Writing answers to content/site.json + app/globals.css
//   6. Printing next steps in plain English
//
// Safe to re-run — existing values pre-fill the prompts.
// Run with: npm run setup

"use strict";

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const ROOT = path.resolve(__dirname, "..");
const SITE_JSON = path.join(ROOT, "content", "site.json");
const GLOBALS_CSS = path.join(ROOT, "app", "globals.css");
const PUBLIC_DIR = path.join(ROOT, "public");

// ---------- terminal helpers ----------
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

function bgRGB(r, g, b) {
  return `\x1b[48;2;${r};${g};${b}m`;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question, currentValue) {
  const suffix = currentValue ? ` ${c.dim}[${currentValue}]${c.reset}` : "";
  return new Promise((resolve) =>
    rl.question(`  ${question}${suffix}: `, (answer) => {
      const trimmed = answer.trim();
      resolve(trimmed || currentValue || "");
    })
  );
}

function header(title) {
  console.log(`\n${c.bold}${c.cyan}${title}${c.reset}`);
  console.log(c.dim + "─".repeat(title.length) + c.reset);
}

function ok(msg) {
  console.log(`  ${c.green}✓${c.reset} ${msg}`);
}

function fail(msg) {
  console.log(`  ${c.red}✗${c.reset} ${msg}`);
}

// ---------- palettes ----------
const PALETTES = [
  {
    name: "Sandstone & Sage",
    desc: "Warm cream, deep sage, terracotta accent (the default)",
    primaryRGB: [71, 92, 73],
    accentRGB: [187, 90, 55],
    css: {
      primary: "120 14% 32%",
      accent: "15 55% 47%",
      background: "38 30% 96%",
    },
  },
  {
    name: "Mountain Morning",
    desc: "Soft alpine, evergreen primary, brass accent",
    primaryRGB: [47, 74, 58],
    accentRGB: [184, 132, 47],
    css: {
      primary: "139 23% 23%",
      accent: "37 60% 45%",
      background: "44 33% 95%",
    },
  },
  {
    name: "High Desert",
    desc: "Warm white, burnt sienna primary, olive accent",
    primaryRGB: [162, 74, 42],
    accentRGB: [122, 123, 63],
    css: {
      primary: "19 59% 40%",
      accent: "60 32% 36%",
      background: "38 50% 96%",
    },
  },
  {
    name: "Coastal",
    desc: "Soft sand, deep navy primary, warm orange accent",
    primaryRGB: [42, 73, 99],
    accentRGB: [196, 116, 56],
    css: {
      primary: "208 41% 28%",
      accent: "25 56% 49%",
      background: "40 30% 96%",
    },
  },
];

// ---------- main ----------
async function main() {
  console.log(`
${c.bold}${c.cyan}╔════════════════════════════════════════════╗
║  Church Site Setup                         ║
╚════════════════════════════════════════════╝${c.reset}

This walks you through configuring your church's website. It takes
about 5 minutes. You won't need to write any code — just answer the
questions below. Press Enter to keep a default value shown ${c.dim}[in brackets]${c.reset}.

${c.dim}You can re-run this anytime with ${c.bold}npm run setup${c.reset}${c.dim}.${c.reset}
`);

  // 1. Node version
  header("Step 1 — Checking Node.js");
  const major = parseInt(process.versions.node.split(".")[0], 10);
  if (major < 18) {
    fail(`You have Node.js ${process.versions.node}. We need 18 or newer.`);
    console.log(`     Install the latest from: ${c.cyan}https://nodejs.org/${c.reset}`);
    process.exit(1);
  }
  ok(`Node.js ${process.versions.node}`);

  // 2. Install
  header("Step 2 — Installing required software");
  console.log(`  ${c.dim}This may take a minute the first time...${c.reset}\n`);
  try {
    execSync("npm install --no-audit --no-fund --silent", {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "inherit"],
    });
    ok("Dependencies installed");
  } catch (e) {
    fail("npm install failed.");
    console.log(`     Try running this command manually: ${c.bold}npm install${c.reset}`);
    process.exit(1);
  }

  // 3. Church info
  header("Step 3 — Tell us about your church");

  let site;
  try {
    site = JSON.parse(fs.readFileSync(SITE_JSON, "utf8"));
  } catch (e) {
    fail("content/site.json is missing or invalid. Reinstall the template?");
    process.exit(1);
  }

  console.log("");
  site.church.name = await ask("Church name", site.church.name);
  const autoShort = site.church.name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 3)
    .join("")
    .toUpperCase();
  site.church.shortName = await ask(
    "Short name / acronym (used in the logo circle)",
    site.church.shortName || autoShort
  );
  site.church.address.street = await ask("Street address", site.church.address.street);
  site.church.address.city = await ask("City", site.church.address.city);
  site.church.address.state = await ask("State (2 letters)", site.church.address.state);
  site.church.address.zip = await ask("ZIP code", site.church.address.zip);
  site.church.phone = await ask("Phone number", site.church.phone);
  site.church.email = await ask("General email address", site.church.email);
  // Setup configures one primary service. Additional services (Wednesday
  // evening, Spanish service, etc.) can be added later through the CMS at
  // /admin/ under "Site Settings → Services".
  if (!Array.isArray(site.church.services) || site.church.services.length === 0) {
    site.church.services = [
      { name: "", day: "Sunday", time: "9:00 AM", note: "", primary: true },
    ];
  }
  const primary =
    site.church.services.find((s) => s.primary) || site.church.services[0];
  primary.day = await ask("Main service day", primary.day || "Sunday");
  primary.time = await ask("Main service start time", primary.time || "9:00 AM");
  primary.primary = true;

  // 4. Color palette
  header("Step 4 — Pick a color palette");
  console.log("  These shape the look of your site. You can change it later.\n");

  PALETTES.forEach((p, i) => {
    const sw1 = `${bgRGB(...p.primaryRGB)}    ${c.reset}`;
    const sw2 = `${bgRGB(...p.accentRGB)}    ${c.reset}`;
    console.log(`  ${c.bold}${i + 1})${c.reset} ${sw1} ${sw2}  ${p.name}`);
    console.log(`     ${c.dim}${p.desc}${c.reset}`);
  });

  const choiceRaw = await ask("\n  Enter the number (1-4)", "1");
  const choice = Math.max(1, Math.min(PALETTES.length, parseInt(choiceRaw, 10) || 1));
  const palette = PALETTES[choice - 1];

  // 5. Write
  header("Step 5 — Saving your settings");

  // 5a. site.json
  try {
    fs.writeFileSync(SITE_JSON, JSON.stringify(site, null, 2) + "\n");
    ok("Saved church info → content/site.json");
  } catch (e) {
    fail(`Couldn't write site.json: ${e.message}`);
    process.exit(1);
  }

  // 5b. globals.css color variables
  try {
    let css = fs.readFileSync(GLOBALS_CSS, "utf8");
    const replace = (varName, value) => {
      css = css.replace(
        new RegExp(`--${varName}:\\s*[^;]+;`),
        `--${varName}: ${value};`
      );
    };
    replace("primary", palette.css.primary);
    replace("accent", palette.css.accent);
    replace("background", palette.css.background);
    replace("ring", palette.css.primary);
    fs.writeFileSync(GLOBALS_CSS, css);
    ok(`Applied "${palette.name}" → app/globals.css`);
  } catch (e) {
    fail(`Couldn't update color palette: ${e.message}`);
  }

  // 5c. Generated text logo (until they upload a real one)
  try {
    const initials = (site.church.shortName || "C")
      .toUpperCase()
      .slice(0, 3);
    const fontSize = initials.length >= 3 ? 56 : 88;
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" rx="100" fill="hsl(${palette.css.primary})"/>
  <text x="100" y="100" text-anchor="middle" dominant-baseline="central"
        font-family="Georgia, serif" font-size="${fontSize}" font-weight="600"
        fill="hsl(${palette.css.background})">${initials}</text>
</svg>
`;
    fs.writeFileSync(path.join(PUBLIC_DIR, "logo.svg"), svg);
    ok(`Generated placeholder logo → public/logo.svg (${initials})`);
  } catch (e) {
    fail(`Couldn't generate logo: ${e.message}`);
  }

  // 6. Next steps
  header("All set");
  console.log(`
  ${c.green}Your church site is configured.${c.reset}

  ${c.bold}Next steps:${c.reset}
    • Run ${c.bold}${c.cyan}npm run start${c.reset} to see your site
    • Open ${c.cyan}http://localhost:3000${c.reset} in your browser
    • To put it on the internet, run ${c.bold}${c.cyan}npm run deploy${c.reset}
    • For help editing content later, read ${c.cyan}docs/for-editors/01-getting-started.md${c.reset}

  ${c.yellow}${c.bold}Still placeholder:${c.reset} the template ships with example
  beliefs, ministries, staff, sermons, and announcements — all marked
  with ${c.bold}[Replace with...]${c.reset} comments. Walk through ${c.cyan}SEED_DATA.md${c.reset}
  to find and replace each one before you launch.

  ${c.dim}Something not right? Run ${c.bold}npm run doctor${c.reset}${c.dim} to diagnose.${c.reset}
`);

  rl.close();
}

main().catch((e) => {
  console.error(`\n${c.red}Setup failed:${c.reset} ${e.message}\n`);
  rl.close();
  process.exit(1);
});
