#!/usr/bin/env node
// Interactive guide for deploying to Vercel.
// Doesn't automate anything — just walks the user through clicking buttons.
// Run with: npm run deploy

"use strict";

const readline = require("node:readline");

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(prompt) {
  return new Promise((resolve) =>
    rl.question(prompt, (answer) => resolve(answer.trim()))
  );
}

async function pause(label = "Press Enter to continue") {
  await ask(`\n  ${c.dim}${label}...${c.reset} `);
}

async function step(num, total, title, body) {
  console.log(
    `\n${c.bold}${c.cyan}Step ${num}/${total}${c.reset}${c.bold} — ${title}${c.reset}\n`
  );
  console.log(body);
  await pause();
}

async function main() {
  console.log(`
${c.bold}${c.cyan}╔════════════════════════════════════════════╗
║  Put Your Site on the Internet             ║
╚════════════════════════════════════════════╝${c.reset}

This will walk you through getting your church site online — for free,
on Vercel.com. You'll do the clicking in your web browser; this terminal
just tells you what to do next.

Time needed: about 15 minutes
Cost: $0 (Vercel has a generous free tier for small sites)

${c.bold}You'll need:${c.reset}
  • A GitHub account (free)
  • A Vercel account (free, you can sign up with GitHub)
  • Your site already set up (you ran ${c.bold}npm run setup${c.reset})
`);

  await ask(`\n  ${c.bold}Ready to start?${c.reset} Press Enter: `);

  // ---- Step 1: GitHub account
  await step(
    1,
    7,
    "Create a GitHub account",
    `  GitHub is where your site's files will live. Vercel reads from there.

  ${c.bold}Do this:${c.reset}
    a. Open ${c.cyan}https://github.com/signup${c.reset} in your browser
    b. Sign up (just an email and password)

  ${c.dim}If you already have a GitHub account, skip this step.${c.reset}`
  );

  // ---- Step 2: Create the repo
  await step(
    2,
    7,
    "Create a new repository on GitHub",
    `  A "repository" (or "repo") is a folder for your site's files.

  ${c.bold}Do this:${c.reset}
    a. Open ${c.cyan}https://github.com/new${c.reset}
    b. Repository name: ${c.bold}church-site${c.reset} (or whatever you'd like)
    c. Keep it ${c.bold}Private${c.reset} (recommended)
    d. ${c.bold}Don't${c.reset} check any of the "Add a README" / .gitignore boxes
    e. Click ${c.bold}Create repository${c.reset}

  After clicking, you'll see a page with setup instructions.
  ${c.bold}Keep that page open${c.reset} — you'll need the URL from it in Step 3.`
  );

  const repoUrl = await ask(
    `\n  Paste the repository URL (e.g. ${c.dim}https://github.com/you/church-site.git${c.reset})\n  > `
  );

  // ---- Step 3: Push the code
  await step(
    3,
    7,
    "Upload this site to GitHub",
    `  ${c.bold}Do this in this terminal${c.reset} (open a new terminal tab if needed):

    ${c.bold}${c.cyan}git init${c.reset}
    ${c.bold}${c.cyan}git add .${c.reset}
    ${c.bold}${c.cyan}git commit -m "Initial site setup"${c.reset}
    ${c.bold}${c.cyan}git branch -M main${c.reset}
    ${c.bold}${c.cyan}git remote add origin ${repoUrl || "<your repo URL>"}${c.reset}
    ${c.bold}${c.cyan}git push -u origin main${c.reset}

  ${c.dim}You may be asked to sign in to GitHub. If so, follow the prompts.${c.reset}
  ${c.dim}On Mac/Linux you can also use the GitHub Desktop app (github-desktop.com)${c.reset}
  ${c.dim}to do this without a terminal.${c.reset}`
  );

  // ---- Step 4: Vercel account
  await step(
    4,
    7,
    "Create a Vercel account",
    `  Vercel is the service that will run your site.

  ${c.bold}Do this:${c.reset}
    a. Open ${c.cyan}https://vercel.com/signup${c.reset}
    b. Click ${c.bold}Continue with GitHub${c.reset} (uses your GitHub account)
    c. When asked, give Vercel permission to read your repositories

  ${c.dim}You'll land on the Vercel dashboard. Keep it open.${c.reset}`
  );

  // ---- Step 5: Import
  await step(
    5,
    7,
    "Import your repository into Vercel",
    `  ${c.bold}Do this on Vercel:${c.reset}
    a. Click ${c.bold}Add New...${c.reset} → ${c.bold}Project${c.reset}
    b. Find your ${c.bold}church-site${c.reset} repository in the list
    c. Click ${c.bold}Import${c.reset} next to it

  Vercel will auto-detect that this is a Next.js site — leave all the
  framework/build settings exactly as they are.`
  );

  // ---- Step 6: Environment variables (none for now, but flag for later)
  await step(
    6,
    7,
    "Deploy",
    `  ${c.bold}Do this on Vercel:${c.reset}
    a. Scroll to the bottom of the import page
    b. Click ${c.bold}${c.green}Deploy${c.reset}

  Vercel will build your site (this takes 1-3 minutes).
  When it finishes, you'll see a celebration page with a URL like:

    ${c.cyan}https://church-site-xyz.vercel.app${c.reset}

  ${c.bold}That URL is your live site.${c.reset} Click it to visit it.`
  );

  // ---- Step 7: Custom domain (optional)
  await step(
    7,
    7,
    "Optional: connect a custom domain",
    `  Your site is now live at ${c.dim}*.vercel.app${c.reset}. To use your own
  domain (like ${c.cyan}yourchurch.org${c.reset}):

    a. In Vercel, click your project → ${c.bold}Settings${c.reset} → ${c.bold}Domains${c.reset}
    b. Type your domain and click ${c.bold}Add${c.reset}
    c. Vercel shows DNS records to set at your domain registrar
       (GoDaddy, Namecheap, Google Domains, etc.)
    d. Add those records in your registrar's dashboard
    e. Wait 5-60 minutes for DNS to propagate

  ${c.dim}Don't have a domain yet? Vercel lets you buy one through them, or you${c.reset}
  ${c.dim}can buy from any registrar. Costs ~$10-15/year typically.${c.reset}`
  );

  console.log(`
${c.green}${c.bold}═══════════════════════════════════════════════════════════${c.reset}
${c.green}${c.bold}  All done — your site is live!${c.reset}
${c.green}${c.bold}═══════════════════════════════════════════════════════════${c.reset}

${c.bold}What happens next:${c.reset}

  • Every time someone publishes a change in the CMS, Vercel
    rebuilds the site automatically — usually within 2 minutes.

  • To invite editors and set up CMS auth, see
    ${c.cyan}docs/for-tech-volunteers/08-grant-editor-access.md${c.reset}

  • Don't share your Vercel password. Do share the live URL.

${c.dim}Need help? Vercel's support is at vercel.com/help${c.reset}
`);

  rl.close();
}

main().catch((e) => {
  console.error(`\n${c.bold}Something went wrong:${c.reset} ${e.message}\n`);
  rl.close();
  process.exit(1);
});
