#!/usr/bin/env node
// One-time post-install welcome banner for new template adopters.
//
// Runs automatically once via the `postinstall` hook in package.json the
// first time someone runs `npm install` after creating their repo from
// the Church Site Template. Subsequent installs skip silently thanks to
// the `.template-welcomed` marker file (gitignored, so each fresh clone
// of a downstream church-instance also gets the welcome exactly once).
//
// Run manually any time with:  node scripts/welcome.js --force
//
// The script is intentionally defensive:
//   - Detects non-interactive environments (CI, scripted installs) and
//     skips the prompt — only prints a short notice.
//   - Never throws; postinstall failures shouldn't block `npm install`.
//   - Idempotent — writes the marker once and respects it afterward.

"use strict";

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const { spawn } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const MARKER = path.join(ROOT, ".template-welcomed");
const SITE_JSON = path.join(ROOT, "content", "site.json");
const FORCE = process.argv.includes("--force");

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

function bail(reason) {
  // Silent skip. Postinstall must never block.
  if (process.env.CHURCH_TEMPLATE_DEBUG) {
    console.log(`${c.dim}[welcome] skipped: ${reason}${c.reset}`);
  }
  process.exit(0);
}

function markWelcomed() {
  try {
    fs.writeFileSync(
      MARKER,
      `welcomed at ${new Date().toISOString()}\n`,
      "utf8"
    );
  } catch {
    // marker write failed — not fatal
  }
}

// Detect whether the project still looks like the un-customized template.
// Used to decide whether the welcome message should say "run setup" or
// "looks like you've already started — here's where to pick up."
function hasRunSetup() {
  try {
    const raw = fs.readFileSync(SITE_JSON, "utf8");
    const data = JSON.parse(raw);
    // The template ships with name "Grace Community Church". If it's been
    // changed, the user has run setup (or hand-edited) at least once.
    return data?.church?.name && data.church.name !== "Grace Community Church";
  } catch {
    return false;
  }
}

function printBanner() {
  console.log("");
  console.log(
    `${c.bold}${c.cyan}╔══════════════════════════════════════════════════════════╗${c.reset}`
  );
  console.log(
    `${c.bold}${c.cyan}║  Welcome to your church's new website!                   ║${c.reset}`
  );
  console.log(
    `${c.bold}${c.cyan}╚══════════════════════════════════════════════════════════╝${c.reset}`
  );
  console.log("");
  console.log(
    `  You're holding a complete, mobile-first church website template.`
  );
  console.log(`  The next 30 minutes turns this into your church's site.`);
  console.log("");
}

function printNextSteps(alreadyStarted) {
  if (alreadyStarted) {
    console.log(`  ${c.green}✓${c.reset} Looks like you've already run setup.`);
    console.log(`  Pick up where you left off:`);
    console.log("");
    console.log(
      `    ${c.bold}npm run cms${c.reset}    ${c.dim}# preview your site + open the CMS editor${c.reset}`
    );
    console.log(
      `    ${c.bold}npm run deploy${c.reset} ${c.dim}# walk through deploying to Vercel${c.reset}`
    );
    console.log("");
    console.log(
      `  ${c.dim}Full guide: docs/for-tech-volunteers/01-overview.md${c.reset}`
    );
    console.log("");
    return;
  }

  console.log(`  ${c.bold}Your next 5 steps:${c.reset}`);
  console.log("");
  console.log(`    1. Run ${c.bold}npm run setup${c.reset}`);
  console.log(`       Walks through church name, address, service time, colors.`);
  console.log("");
  console.log(`    2. Run ${c.bold}npm run cms${c.reset}`);
  console.log(`       Preview your site and open the CMS at http://localhost:3000`);
  console.log("");
  console.log(`    3. Customize branding (logo, photos, fine-tune colors)`);
  console.log(
    `       ${c.dim}→ docs/for-tech-volunteers/05-customize-branding.md${c.reset}`
  );
  console.log("");
  console.log(`    4. Run ${c.bold}npm run deploy${c.reset}`);
  console.log(`       Step-by-step walkthrough for Vercel hosting.`);
  console.log("");
  console.log(`    5. Invite your editors`);
  console.log(
    `       ${c.dim}→ docs/for-tech-volunteers/08-grant-editor-access.md${c.reset}`
  );
  console.log("");
  console.log(
    `  ${c.dim}Full 30-minute overview: docs/for-tech-volunteers/01-overview.md${c.reset}`
  );
  console.log("");
}

function offerToRunSetup() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      `  Run ${c.bold}npm run setup${c.reset} right now? ${c.dim}[y/N]${c.reset} `,
      (answer) => {
        rl.close();
        const yes = /^y(es)?$/i.test(answer.trim());
        resolve(yes);
      }
    );
  });
}

function runSetup() {
  // Inherit stdio so the user can interact with the setup script normally.
  // shell:true so the same code works on Windows.
  return new Promise((resolve) => {
    const child = spawn("npm", ["run", "setup"], {
      cwd: ROOT,
      stdio: "inherit",
      shell: true,
    });
    child.on("close", () => resolve());
    child.on("error", () => resolve()); // never propagate failure
  });
}

async function main() {
  // Idempotency gate.
  if (!FORCE && fs.existsSync(MARKER)) {
    return bail("marker exists");
  }

  // Skip in non-interactive environments — print a brief notice and exit.
  const isCI = Boolean(
    process.env.CI ||
      process.env.CONTINUOUS_INTEGRATION ||
      process.env.GITHUB_ACTIONS ||
      process.env.VERCEL ||
      process.env.NETLIFY
  );
  const isInteractive = Boolean(process.stdout.isTTY && process.stdin.isTTY);

  if (isCI || !isInteractive) {
    if (process.stdout.isTTY) {
      console.log("");
      console.log(
        `${c.cyan}Church Site Template installed.${c.reset} See ${c.bold}.github/TEMPLATE_GUIDE.md${c.reset} for next steps.`
      );
      console.log("");
    }
    markWelcomed();
    return;
  }

  const alreadyStarted = hasRunSetup();

  printBanner();
  printNextSteps(alreadyStarted);

  if (!alreadyStarted) {
    try {
      const wantsSetup = await offerToRunSetup();
      if (wantsSetup) {
        markWelcomed(); // mark before running so the prompt only happens once
        await runSetup();
        return;
      }
    } catch {
      // ignore — fall through and just mark welcomed
    }
  }

  markWelcomed();
}

main().catch(() => {
  // never block install
  markWelcomed();
  process.exit(0);
});
