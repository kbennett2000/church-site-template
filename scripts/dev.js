#!/usr/bin/env node
// Friendly wrapper around `next dev`. Run with: npm run start

"use strict";

const { spawn } = require("node:child_process");

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  dim: "\x1b[2m",
};

console.log(`
${c.bold}${c.cyan}Starting your site...${c.reset}

When you see ${c.bold}"Ready in ..."${c.reset} below, your site is running:

  • Open ${c.bold}${c.cyan}http://localhost:3000${c.reset} in your browser
  • Press ${c.bold}Ctrl + C${c.reset} in this window to stop

${c.dim}Leave this window open while you're working on the site.${c.reset}
`);

// shell:true is required on Windows since Node 18.20 / 20.12 / 22 — spawning
// .cmd or .bat files without it throws EINVAL (CVE-2024-27980 patch). On
// Mac/Linux shell:true is harmless. Lets the OS resolve `npx` from PATH.
const child = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  cwd: process.cwd(),
  shell: true,
});

child.on("close", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error(`\n${c.bold}Couldn't start the dev server.${c.reset}`);
  console.error(`  ${err.message}`);
  console.error(`  Try running: ${c.bold}npm run doctor${c.reset}`);
  process.exit(1);
});
