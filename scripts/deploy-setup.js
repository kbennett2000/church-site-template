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

Time needed: about 25 minutes
Cost: $0 (Vercel, TinaCloud, and Resend all have free tiers)

${c.bold}You'll need:${c.reset}
  • A GitHub account (free)
  • A Vercel account (free, sign up with GitHub)
  • A TinaCloud account (free, for the CMS editor login)
  • A Resend account (free, for form submissions to your inbox)
  • Your site already set up (you ran ${c.bold}npm run setup${c.reset})
`);

  await ask(`\n  ${c.bold}Ready to start?${c.reset} Press Enter: `);

  // ---- Step 1: GitHub account
  await step(
    1,
    9,
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
    9,
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
    9,
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
    9,
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
    9,
    "Import your repository into Vercel",
    `  ${c.bold}Do this on Vercel:${c.reset}
    a. Click ${c.bold}Add New...${c.reset} → ${c.bold}Project${c.reset}
    b. Find your ${c.bold}church-site${c.reset} repository in the list
    c. Click ${c.bold}Import${c.reset} next to it

  Vercel will auto-detect that this is a Next.js site — leave all the
  framework/build settings exactly as they are.`
  );

  // ---- Step 6: TinaCloud setup
  await step(
    6,
    9,
    "Set up TinaCloud (editor login)",
    `  TinaCloud handles who can log in to your CMS at /admin.
  Editors sign in with Google — no GitHub account required.

  ${c.bold}Do this:${c.reset}
    a. Open ${c.cyan}https://app.tina.io${c.reset} and create a free account
    b. Click ${c.bold}New Project${c.reset}
    c. Connect your GitHub account when prompted
    d. Select your ${c.bold}church-site${c.reset} repository
    e. On the project dashboard, open ${c.bold}Overview${c.reset}
    f. Copy the ${c.bold}Client ID${c.reset} and ${c.bold}Token${c.reset} — you'll need both in Step 7

  ${c.dim}Don't close TinaCloud yet — keep it open for the next step.${c.reset}`
  );

  // ---- Step 7: Resend setup
  await step(
    7,
    9,
    "Set up Resend (form email delivery)",
    `  Resend sends form submissions (visit form, contact, prayer requests)
  to your church's inbox.

  ${c.bold}Do this:${c.reset}
    a. Open ${c.cyan}https://resend.com${c.reset} and create a free account
    b. In the Resend dashboard, go to ${c.bold}API Keys${c.reset} → ${c.bold}Create API Key${c.reset}
    c. Give it a name (e.g. "Church Site") and copy the key

  ${c.bold}Optional — add a custom sending domain:${c.reset}
    d. Go to ${c.bold}Domains${c.reset} → ${c.bold}Add Domain${c.reset}
    e. Enter your church's domain (e.g. yourchurch.org)
    f. Follow Resend's DNS instructions (takes 5–30 minutes to verify)
    g. Once verified, you can send from noreply@yourchurch.org

  ${c.dim}Without a custom domain, Resend uses "onboarding@resend.dev" as the
  sender. This works for testing but looks unprofessional for production.
  Verifying your domain takes about 10 minutes total.${c.reset}`
  );

  // ---- Step 8: Environment variables on Vercel
  await step(
    8,
    9,
    "Add environment variables to Vercel",
    `  These secrets connect your site to TinaCloud and Resend.

  ${c.bold}Do this on Vercel:${c.reset}
    a. Open your project → ${c.bold}Settings${c.reset} → ${c.bold}Environment Variables${c.reset}
    b. Add each variable below (Name + Value, keep Scope as "All Environments"):

    ${c.cyan}NEXT_PUBLIC_TINA_CLIENT_ID${c.reset}  → Client ID from TinaCloud
    ${c.cyan}TINA_TOKEN${c.reset}                  → Token from TinaCloud
    ${c.cyan}RESEND_API_KEY${c.reset}              → API key from Resend
    ${c.cyan}RESEND_FROM_EMAIL${c.reset}           → noreply@yourchurch.org (or leave
                                   blank to use Resend's test sender)
    ${c.cyan}CHURCH_EMAIL${c.reset}                → The inbox that gets form submissions
                                   (e.g. office@yourchurch.org)

    c. Click ${c.bold}Save${c.reset} after each variable
    d. Go to ${c.bold}Deployments${c.reset} → click ${c.bold}Redeploy${c.reset} on the latest deployment
       so the new variables take effect

  ${c.dim}Keep these values secret — don't share them or commit them to git.${c.reset}`
  );

  // ---- Step 9: Deploy + custom domain
  await step(
    9,
    9,
    "Deploy and connect a custom domain",
    `  ${c.bold}Deploy (if not already live):${c.reset}
    a. On the Vercel import page, click ${c.bold}${c.green}Deploy${c.reset}
    b. Build takes 2-4 minutes — longer than before because TinaCMS
       compiles the admin UI during the build

  ${c.bold}Optional: connect a custom domain${c.reset}
    c. Vercel project → ${c.bold}Settings${c.reset} → ${c.bold}Domains${c.reset} → type your domain → ${c.bold}Add${c.reset}
    d. Add the DNS records Vercel shows at your domain registrar
       (GoDaddy, Namecheap, Google Domains, etc.)
    e. Wait 5–60 minutes for DNS to propagate

  ${c.dim}Don't have a domain yet? Vercel lets you buy one, or buy from any
  registrar (~$10–15/year typically).${c.reset}`
  );


  console.log(`
${c.green}${c.bold}═══════════════════════════════════════════════════════════${c.reset}
${c.green}${c.bold}  All done — your site is live!${c.reset}
${c.green}${c.bold}═══════════════════════════════════════════════════════════${c.reset}

${c.bold}What happens next:${c.reset}

  • Editors log in to the CMS at ${c.cyan}yoursite.com/admin${c.reset} using Google.
    Changes are saved directly to your GitHub repo and Vercel
    rebuilds the site automatically — usually within 2 minutes.

  • To invite editors, add their email address in TinaCloud:
    ${c.cyan}app.tina.io${c.reset} → your project → ${c.bold}Users${c.reset}

  • See the full guide:
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
