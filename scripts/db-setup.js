#!/usr/bin/env node
// Interactive Postgres setup helper. Run with: npm run db:setup
//
// Checks that DATABASE_URL is set and then runs drizzle-kit migrate
// to apply the migration files in drizzle/migrations/ to the database.

"use strict";

const { execSync } = require("node:child_process");
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

console.log(`\n${c.bold}${c.cyan}Database Setup${c.reset}\n`);

// ── 1. Check DATABASE_URL ──────────────────────────────────────────────────

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";

if (!url) {
  console.log(`${c.red}✗ DATABASE_URL is not set.${c.reset}\n`);
  console.log("To set it:\n");
  console.log(
    "  1. Copy your Postgres connection string from Vercel → Storage → your database → .env.local tab."
  );
  console.log("  2. Paste it into your .env.local file:\n");
  console.log(`     ${c.dim}DATABASE_URL=postgres://...${c.reset}\n`);
  console.log("  3. Re-run: npm run db:setup\n");
  process.exit(1);
}

console.log(`${c.green}✓${c.reset} DATABASE_URL found.\n`);

// ── 2. Run drizzle-kit migrate ─────────────────────────────────────────────

console.log(`Running ${c.cyan}drizzle-kit migrate${c.reset} to apply pending migrations...\n`);

try {
  execSync("npx drizzle-kit migrate", {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env },
  });
  console.log(`\n${c.green}${c.bold}✓ Migrations applied.${c.reset}\n`);
  console.log(`Next step: run ${c.cyan}npm run doctor${c.reset} to verify the full setup.\n`);
} catch {
  console.log(`\n${c.red}✗ drizzle-kit migrate failed.${c.reset}\n`);
  console.log(
    "Check that DATABASE_URL points to a running Postgres instance and that your IP is allowed.\n"
  );
  process.exit(1);
}
