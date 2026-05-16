---
type: how-to
audience: tech-volunteer
---

# Successor runbook — you just inherited this site

**When to open this:** you've been asked to take over a church website that someone else built. They've moved on. The site is still running, but you don't know what services it depends on, what accounts own those services, or what you're supposed to do if something breaks.

This doc is the notes the previous person should have left you. Work through it in order — by the end you'll know what you have, who has access to what, and where to look when something goes wrong.

---

## Part 1 — You just inherited this

You're now the tech person for your church's website. Maybe you volunteered, maybe you got drafted, maybe you're filling in until someone better comes along. Either way: welcome. The system you've inherited was built specifically to be maintainable by exactly the situation you're in right now — a non-developer who didn't build it, walking in cold.

The previous person may not have left great notes. They may not have known what to leave. The good news is the system is built on a small handful of well-known services (GitHub, Vercel, TinaCloud, and possibly a couple of others). Once you know what those are and have access to each one, you're 80% of the way to confident maintenance.

### What you're about to do

This runbook takes **60-90 minutes to work through end-to-end** the first time. You don't have to do it in one sitting. Major sections are checkpoints — pause whenever you need to.

The sections in order:

1. **Service inventory** — what your church's website depends on. Fill it in like a checklist.
2. **Getting access** — claim the credentials you need. The hardest part of inheriting a system.
3. **Your first 60 minutes** — a guided tour of the running system to build your mental model.
4. **Known gotchas** — things the previous person learned the hard way, so you don't have to.
5. **The "why" behind the choices** — a pointer to the rationale doc.
6. **Ongoing rhythm** — what to do weekly / monthly / quarterly going forward.
7. **When you eventually pass this on** — leave better notes than you got.
8. **Worst case** — if you really can't reach anything the previous person used.

You can skip any of Part 2 / Part 3's services your church doesn't use. (No email features → skip Resend and Neon. No custom domain → skip the registrar. No Google sign-in → skip Google Cloud Console.)

### Before you start

Open a fresh document (Google Doc, Notion page, or a text file) where you'll capture:

- The names and login accounts for each service.
- Notes you take during the first-60-minutes walkthrough.
- Reminders for follow-up tasks.

This doc is going to become **your** handoff notes for the next person down the line — see Part 8.

✅ **Checkpoint:** You have a blank document ready to fill in. Set a calendar block for 60-90 minutes. Continue when you're ready.

---

## Part 2 — Service inventory

Your church's website doesn't live in one place. It depends on a handful of external services that all need to keep working. The bigger the church and the more features enabled (email, devotionals, custom domain), the longer the list.

Fill in this inventory before you do anything else. For each service that applies to your church, capture:

- **Account email/owner** — whose login owns this account?
- **Plan/tier** — free or paid? If paid, how much per month/year?
- **Where to find this** — which dashboard, which menu?

If you don't have access yet, leave those rows blank and come back to them after Part 3.

### Services to inventory

#### 1. GitHub

- **What it does:** hosts the source code for the website. Every content edit, code change, and configuration update lives here.
- **Where:** [github.com](https://github.com) → the repository for your church's site (URL is something like `github.com/<owner>/<repo-name>`).
- **Cost:** free for personal accounts, including private repos.
- **If lost:** the site stays running, but no new changes can deploy until access is restored.
- **Find:** account email under Settings → Public profile. Plan under Settings → Billing.

> Capture in your notes: the repo URL, who owns the repo (an individual GitHub account or an organization), and your level of access (admin, write, read).

#### 2. Vercel

- **What it does:** hosts the actual running website. Every time content changes in GitHub, Vercel rebuilds and republishes the site.
- **Where:** [vercel.com/dashboard](https://vercel.com/dashboard) → the project for your church's site.
- **Cost:** free Hobby tier for small church traffic (thousands of visitors per day before any limits matter). Paid Pro tier is only needed at much higher scale.
- **If lost:** the site goes down. This is the most important access to claim.
- **Find:** account email in the top-right account menu. Plan under your account name → Settings → Billing. Project owner under Project Settings → General.

> Capture in your notes: the Vercel account email, the project name, and which environments (Production / Preview / Development) are configured.

#### 3. TinaCloud

- **What it does:** powers the `/admin/` content editor that editors (pastor, secretary, ministry leaders) use to update the site.
- **Where:** [app.tina.io](https://app.tina.io) → the project for your church.
- **Cost:** free tier handles a small church easily.
- **If lost:** editors can't update content via `/admin/`; the site continues serving whatever content was last saved.
- **Find:** account in the top-right menu. Project under the dashboard. Other users under the project's Users (or Collaborators) section.

> Capture in your notes: which GitHub account TinaCloud is connected to, and who else has been invited as a user.

#### 4. Domain registrar (if a custom domain is in use)

- **What it does:** owns the church's domain name (e.g., `yourchurch.org`). Without it, typing the URL in a browser gets nothing.
- **Where:** could be any of GoDaddy, Namecheap, Cloudflare, Google Domains, name.com, Porkbun, or many others. Look at your domain's WHOIS record via [whois.com](https://whois.com) to identify which registrar.
- **Cost:** typically $10-15 per year. Auto-renewing in most cases.
- **If lost:** the domain still resolves to the site as long as registration doesn't lapse, but you can't change DNS records, transfer the domain, or renew it.
- **Find:** registrar's dashboard → Domains → your domain → Contact information (the listed owner email).

> Capture in your notes: which registrar, the account email, the renewal date, and whether auto-renewal is enabled. A domain that lapses because no one paid the renewal is one of the most preventable outages.

#### 5. Neon / Vercel Postgres (only if devotional or digest emails are enabled)

- **What it does:** stores email subscriber records — who is subscribed, what tags they have, when they last received an email.
- **Where:** [console.neon.tech](https://console.neon.tech) for Neon, or Vercel → Storage tab for Vercel Postgres (which is actually Neon under the hood).
- **Cost:** free tier is generous for a small church.
- **If lost:** new subscribers can't be added or removed, scheduled email sends fail, but the public site stays up.
- **Find:** account email in the dashboard. Plan and usage under Settings → Billing. Existing users under Project → Settings → Sharing (or Team).

> Capture in your notes: account email, which provider (Neon directly or via Vercel), and where your `DATABASE_URL` env var points to (you'll verify this in Part 4).

#### 6. Resend (only if any email features are enabled)

- **What it does:** sends the transactional emails — devotional emails, weekly digests, contact form notifications, prayer request forwards.
- **Where:** [resend.com](https://resend.com) → your account.
- **Cost:** free tier covers light usage. Paid plans available for higher volume.
- **If lost:** no emails go out — public site is unaffected.
- **Find:** account email in the top-right menu. Plan under Settings → Billing. Team members (if any) under Settings → Team.

> Capture in your notes: account email, which sender domain is verified (look at Resend → Domains), and what `RESEND_FROM_EMAIL` is set to in Vercel.

#### 7. Google Cloud Console (only if admin auth uses Google OAuth)

- **What it does:** stores the OAuth credentials that let admins sign in to the custom admin pages (`/admin/digest`, `/admin/devotionals`) using their Google accounts.
- **Where:** [console.cloud.google.com](https://console.cloud.google.com) → the project name your church uses (usually something like "Church Admin Sign-in").
- **Cost:** free.
- **If lost:** admins can't sign in to the custom admin pages until you re-create the OAuth credentials and update Vercel. The public site and TinaCloud's `/admin/` are unaffected.
- **Find:** account in the top-right menu. Project under the project picker (top of the page). OAuth credentials under APIs & Services → Credentials.

> Capture in your notes: the Google account that owns the Cloud project, the project ID, and the OAuth Client ID currently in use.

### Which services apply to your church?

Run through this quick check to figure out which sections of the inventory you actually need:

| Question | If yes |
|---|---|
| Does the site have a custom domain like `yourchurch.org`? | Include the domain registrar. |
| Does `/devotionals` or `/digest` exist as a working page on your site? | Include Neon/Vercel Postgres and Resend. |
| Does the site send notifications when someone submits the contact, prayer, or visit form? | Include Resend. |
| Do admins sign in to `/admin/digest` or `/admin/devotionals` with their Google account? | Include Google Cloud Console. |
| Do admins use a single shared password to access those admin pages instead? | Skip Google Cloud Console — your church uses Basic Auth. The relevant doc is [admin-access-basic-auth.md](./admin-access-basic-auth.md). |

✅ **Checkpoint:** You have a list of which services apply to your church, even if you don't have access to all of them yet. Continue to Part 3 to claim access.

---

## Part 3 — Getting access

This is the hardest part of inheriting a system. You can't maintain what you can't sign into.

How hard it is depends entirely on the previous person and what they left behind. Three scenarios:

- **A — Previous person is reachable** and willing to help with handoff.
- **B — Previous person is gone**, but they used shared accounts (e.g., a generic email like `webmaster@yourchurch.org`) and you can get those credentials.
- **C — Previous person is gone with no shared accounts** — they used personal accounts you can't reach.

Pick the scenario that matches your situation. (If it's a mix, work through A for the services you have help with, then B/C for the rest.)

### Scenario A — Previous person is reachable

This is the best case. Schedule a 30-60 minute call with them.

Before the call, send them this list of "please add me to":

1. **GitHub repo** — as a Collaborator with Admin permission. They go to the repo's Settings → Collaborators → invite you by GitHub username.
2. **Vercel project** — as a Member or Owner. They go to Vercel → Account Settings → Team (or Project → Settings → Members) → invite you by email.
3. **TinaCloud project** — as a user with admin/editor role. They go to [app.tina.io](https://app.tina.io) → project → Users → Invite (the exact label varies; look for "Add user" or "Invite collaborator").
4. **Resend (if applicable)** — as a team member. Resend → Settings → Team → Invite. Note: the free tier may limit team size; check first.
5. **Neon or Vercel Postgres (if applicable)** — as a project member. Neon → project → Settings → Sharing → Invite. (For Vercel Postgres, access flows through Vercel project membership.)
6. **Google Cloud Console (if applicable)** — as an IAM principal with the "Editor" or "Owner" role on the church's project. They go to console.cloud.google.com → IAM & Admin → IAM → Grant Access → add your Google email with role.
7. **Domain registrar** — this one varies. Most registrars don't let you "share" a domain in the same way other services do. Two options:
   - **Add you as an account user** if the registrar supports it (Cloudflare and Namecheap do; GoDaddy has "Account Sharing" with limited scopes).
   - **Share the login credentials** through a password manager. Less ideal but often necessary. Change the password immediately after they share it so old members can't still access it.

#### During the call

Walk through each service together. After they add you, **log in yourself from your own device** to verify access actually works. Don't take "I invited you" as proof — verify each invite landed.

For each service where you confirm working access, mark it ✓ in your inventory.

#### After the call

For each service: do they *still* need access? If they've truly handed off, removing them is the cleanest outcome — fewer people with access means smaller leak surface and fewer accounts to revoke later. Coordinate this with them so they're not surprised.

The exception: keep them on the GitHub repo as a contributor for at least a few months in case they remember something they didn't write down and need to find it. They can stay at "read" permission without admin rights.

✅ **Checkpoint A:** You're now signed in to every service that applies to your church. Skip ahead to Part 4.

### Scenario B — Shared accounts on a generic email

Some careful predecessors use a generic email address (like `admin@yourchurch.org` or `webmaster@yourchurch.org`) as the login on every service, so handoffs are just passing the email account credentials. If that's your situation:

1. **Get the email account credentials.** Probably from the pastor, the church office, or a sealed envelope somewhere. Don't accept these credentials over text or unencrypted email — use a phone call, in-person handoff, or a password manager share.
2. **Change the email account password first.** Before you sign into anything else. This locks out old members who might still have the old credentials. Use a long, randomly-generated password from a password manager.
3. **Sign in to each service** in your inventory using "Forgot password" if needed — the recovery email arrives at the inbox you now control.
4. **Where each service supports it, add your personal account too.** Some services (Vercel, Resend) let you have multiple admin emails. Add your personal account as a second admin so you're not dependent on the shared email for daily work. Reserve the shared email for break-glass recovery only.
5. **Document the changes.** Note the new password in a password manager and in the church's sealed-envelope handoff materials (see Part 8).

✅ **Checkpoint B:** You can sign in to every service using the shared account, and your personal account is also added as an admin where supported. Continue to Part 4.

### Scenario C — Previous person is gone, no shared accounts

This is the worst case. You don't have a contact for the previous person and they used their personal email/GitHub/Google accounts for everything. Some of those accounts you can't access; some may even be suspended now.

Work through this list in order. Stop when you reach the option that resolves your situation.

1. **Try the predecessor's contact channels once more.** Search the church's email archives for any message from them — sometimes the address you have is out of date but they're still reachable on a newer one. LinkedIn and Facebook are reasonable too. A polite "the church needs to take over the website, can you spare 20 minutes for handoff?" works more often than you'd think.

2. **For each service, contact their support and request account recovery.** Most providers will help with ownership transfer if you can prove you represent the church. They typically want:
   - A letter on church letterhead, signed by the pastor or board chair.
   - The previous owner's email address (so they can confirm the account exists).
   - Documentation of your role (e.g., an email from `pastor@yourchurch.org` introducing you).

   Specific channels:
   - **GitHub:** [support.github.com](https://support.github.com) → "Account access" → "I've lost access to my organization."
   - **Vercel:** [vercel.com/support](https://vercel.com/support) → describe the situation.
   - **TinaCloud:** [tina.io](https://tina.io) → contact via their support email.
   - **Resend:** [resend.com](https://resend.com) → support widget.
   - **Domain registrar:** support varies; usually a phone call works fastest for ownership disputes.

   Allow 1-3 weeks for these processes. The site continues running during the recovery period — you're not under time pressure unless something breaks.

3. **In parallel, take inventory of what you CAN see.** Even without admin access, you can often:
   - View the public-facing site (you don't need any login for that).
   - View the GitHub repo if it's public.
   - Check WHOIS on the domain to confirm the registrar.

   This tells you what services to focus recovery efforts on.

4. **Worst case: rebuild what you can't recover.** If a service has truly become inaccessible:
   - You can fork the GitHub repo to a new owner you control (if it's public) or clone it from another collaborator if one exists.
   - You can create a new Vercel project pointing at your fork.
   - You can create a new TinaCloud project for the same repo.
   - The original site stays running on the old setup while you build the new one. You can switch DNS over only after the new one is verified working.

   The big risk is the subscriber database — if you can't recover Neon access and have no backup, the email subscriber list is lost and people need to re-subscribe. See Part 9 for the full rebuild path.

5. **For the domain specifically:** if registrar recovery fails completely, you may need to register the same name at a *new* registrar after the old registration lapses. This means a service interruption — but if no other path exists, it's the recovery option. Don't let the registration lapse if you can possibly avoid it; renew it under the old registrar first, then deal with ownership transfer.

✅ **Checkpoint C:** You've initiated recovery requests for any service you can't access directly, and you know which services you may need to rebuild. Continue to Part 4 for the services you do have access to.

### Tactical advice for all three scenarios

- **Use a password manager.** 1Password, Bitwarden, and LastPass all have personal free tiers. Generate unique long passwords for every service. Never reuse the same password across two of them.
- **Don't share passwords over text, email, or chat apps.** Use the password manager's secure-share feature or hand them over in person.
- **Document for the next successor.** As you set up access for yourself, write down the recovery email and account owner for every service in your notes doc. The next person inheriting this site (which might be you, in 10 years) will thank you.
- **Suggest the church establish a sealed-envelope handoff packet.** A printed list of services and account emails (no passwords — those go in the password manager), kept in the church safe, updated annually. This survives turnover even when password managers don't get transferred.

---

## Part 4 — Your first 60 minutes

You have access. Now build your mental model of the running system by spending 60 minutes touching every part of it. **Don't change anything yet** — this is observation, not action.

Open your notes doc and capture anything that surprises you as you go.

### Step 1 (5 min) — Visit the live site

**Open** your church's website in a browser. Click around like a member would:

- Homepage
- About / Our Story
- A few ministry pages
- The calendar or events page
- The give/donate page (if it exists)
- The sermons page

Note anything that looks broken, outdated, or confusing. Don't fix it — just note it. You'll have plenty of opportunities to fix things later, after you understand the system.

### Step 2 (5 min) — Visit `/admin/` and sign in

Open `your-domain/admin/` in your browser. You should be prompted by TinaCloud to sign in.

After signing in, the CMS dashboard loads with a sidebar of collections (Site Settings, Sermons, Staff, Ministries, and so on).

**Click into 2-3 collections** just to see what's there:

- **Site Settings** — the central church info (name, address, phone, service times).
- **Sermons** — recent sermon entries.
- **Pages** — any custom pages your church has added.

Don't edit anything. Confirm only that you can see the data and that the UI works for you.

### Step 3 (10 min) — Open the Vercel dashboard

Open [vercel.com/dashboard](https://vercel.com/dashboard) → your church's project.

Look at each tab:

- **Deployments** — should show a list of recent deployments. The most recent one should be marked **Ready** with a green checkmark. Note roughly how often deployments happen (a sign of how active the site is).
- **Analytics** (if enabled) — gives a sense of weekly traffic.
- **Logs** → **Runtime Logs** — sample what normal log volume looks like. This tab is where you'll go when something breaks.
- **Settings → Environment Variables** — see what's defined here without changing anything. Capture the names (not the values) in your notes. Expected names include `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `DATABASE_URL`, `ADMIN_PASSWORD`, `CRON_SECRET`, `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN` — plus any others your church has added.
- **Settings → Domains** — see which custom domain (if any) is pointing at this site.
- **Settings → Cron Jobs** (or Crons) — if email features are enabled, you'll see `/api/cron/devotionals` and/or `/api/cron/digest` listed here.

### Step 4 (5 min) — Open the GitHub repo

Open the repo in GitHub.

- **Look at recent commits.** What kind of changes happen? How often? Most commits should be from "tina-cloud-app" (CMS edits committed by editors); occasionally there will be commits from a human (you eventually).
- **Check Issues and Pull Requests.** Anything open? Anything that looks urgent?
- **Glance at the README.** It usually points back to documentation.

### Step 5 (10 min) — Verify the email pipeline (if enabled)

Skip if your church doesn't have devotional or digest emails.

- Open Resend → **Logs**. Filter to the last 7 days. You should see successful sends if the system is healthy. If everything shows `failed` or there's nothing in the past week, something's wrong — go to [runbook-emails-stopped.md](./runbook-emails-stopped.md).
- Open Neon (or Vercel → Storage) → your database. Browse the `subscribers` table. Note roughly how many subscribers exist and how many are `active` vs. `pending_verification` or `bounced`.
- Back in Vercel → Settings → Cron Jobs, confirm the cron has been firing hourly. Recent invocations should show "Success" with green status.

### Step 6 (15 min) — Read the runbooks

Three runbooks cover the most likely incidents. You don't need to memorize them — just know they exist and have a sense of what each covers.

- [runbook-site-down.md](./runbook-site-down.md) — ~3 min read. When the public site won't load or shows errors.
- [runbook-emails-stopped.md](./runbook-emails-stopped.md) — ~3 min read. When devotional or digest emails aren't going out.
- [runbook-rotate-secret.md](./runbook-rotate-secret.md) — ~3 min read. When a password or API key has been exposed.

Skim each one and bookmark the file in your browser. When something does break, the time pressure makes "I have to find the right doc" the hardest part — you've eliminated that by knowing where to look.

### Step 7 (10 min) — Look at the maintenance schedule

Open [09-maintenance.md](./09-maintenance.md). Read through it.

It defines a monthly / quarterly / annual cadence of routine tasks. **Schedule the next monthly check in your own calendar** — typically 30 minutes once a month is enough.

If you're inheriting an actively-running site, the previous person was presumably doing this already. You're just continuing the rhythm.

### What you should be able to answer after 60 minutes

- **Where does this site run?** Vercel.
- **Who can edit content?** Anyone with TinaCloud access to the project.
- **What do I do if it breaks?** Open the matching runbook (site down → runbook-site-down; emails → runbook-emails-stopped; etc.).
- **What's the routine maintenance schedule?** Defined in 09-maintenance.md; ~30 min monthly.
- **What services does the site depend on?** GitHub, Vercel, TinaCloud, plus optionally Resend / Neon / Google Cloud / a domain registrar — depending on enabled features.

If you can answer all five, you're in better shape than most successors.

✅ **Checkpoint:** Your inventory is filled in, you have access to every service that applies, and you've completed the 60-minute walkthrough. The rest of this doc is reference material — read on or come back to it as needed.

---

## Part 5 — Known gotchas worth knowing up front

Things the previous builder learned the hard way. Knowing them in advance saves real diagnostic time.

### 1. Stale JWT on new admins

When you add someone new to the admin list (in `content/admin-access.json` via the CMS, or in `ADMIN_ALLOWLIST` env var), **they can't immediately sign in**. They'll see "Access Denied" even though their email is on the list.

The cause: their browser is holding a JWT from a sign-in attempt that happened before they were added. The JWT carries `isAdmin: false` and isn't re-evaluated until it expires (up to 30 days) or they sign out and back in.

**The fix:** tell them to sign out and sign back in. Five-second fix; bites every new admin once.

See [admin-access-followups.md](../for-developers/admin-access-followups.md) for the full technical explanation.

### 2. Resend sandbox mode

If `RESEND_FROM_EMAIL` is set to `onboarding@resend.dev` (Resend's default sandbox sender), **Resend will only deliver emails to the email address that owns your Resend account.** Every other recipient is silently dropped — the send appears successful in Resend's logs but never reaches the actual subscriber.

**The fix:** verify your church's own domain in Resend (under Resend → Domains), then update `RESEND_FROM_EMAIL` to use that domain. Details in [email-deliverability.md](./email-deliverability.md).

If subscribers are complaining about not getting emails and Resend logs show "delivered," check this first.

### 3. The `db:push` foot-gun

The `npm run db:push` script is convenient for development — it syncs your TypeScript schema directly to the database. **Never run it against the production database.** It can drop tables and wipe subscriber data when it encounters a change it can't apply non-destructively.

The safe production workflow is `npm run db:generate` (creates a SQL migration file) → review the SQL → commit it → `npm run db:migrate` (applies migration files). Details in [database-migrations.md](../for-developers/database-migrations.md).

### 4. Env var changes don't hot-reload

Every time you change an environment variable in Vercel (Settings → Environment Variables), **you must trigger a redeploy** before the new value takes effect. The current running site is bound to the values that existed at its build time.

To redeploy: Deployments → ⋯ next to the most recent deploy → **Redeploy** → uncheck "Use existing Build Cache" → confirm.

This catches everyone at least once. If you change `RESEND_FROM_EMAIL` and nothing seems to happen, you forgot to redeploy.

### 5. Tag merges on re-subscription

When someone unsubscribes from devotionals and later resubscribes through the digest signup, the system **unions their new tag with any existing tags** — they don't lose their other subscriptions. This is the right behavior, but it surprises people: "I asked them to unsubscribe me and now I'm getting two different emails!"

If a subscriber wants to fully opt out of *everything*, the unsubscribe link in any email handles that. The behavior described here applies only when someone re-subscribes voluntarily.

### 6. TinaCloud 403 means env vars are wrong

If you see "Tina Cloud 403 — not authorized to access branch" at `/admin/`, the cause is almost always that `TINA_TOKEN` or `NEXT_PUBLIC_TINA_CLIENT_ID` in Vercel is wrong, missing, or stale.

The public site itself still works — only `/admin/` is broken — so members of the church won't notice. But editors will.

Fix: check Vercel → Settings → Environment Variables, verify both values match what's shown in TinaCloud → your project. Redeploy after correcting. Details in [06a-setup-tinacloud.md](./06a-setup-tinacloud.md).

### 7. `force=true` on the digest send-now endpoint

The endpoint `/api/admin/digest/send-now?force=true` wipes the prior week's send-log row and re-sends the digest to everyone. **Don't use it casually** — if you hit it twice in a few minutes, subscribers receive duplicate emails.

It exists for the rare case where a digest went out with a mistake and you need to send a corrected version. Skip it unless that's exactly what you're doing.

### 8. Basic Auth rate limiter is per-instance

If your church uses shared-password (Basic Auth) admin sign-in: the rate limiter that blocks brute-force attempts (10 failures → 429) lives in memory **per Vercel instance**. With multiple instances active, the limits aren't shared across them.

This is fine for typical small-church use. Worth knowing if you ever investigate "why is this user able to keep guessing the password without getting rate-limited" — they may be hitting different Vercel instances.

### 9. Old logo URLs from a retired host

If the church previously had a website on another platform (WordPress, Wix, Squarespace), the logo image in email templates may still reference the old platform's CDN. If the old site eventually gets deleted, email logos turn into broken-image icons.

**Audit:** check email templates and the CMS for any logo URLs starting with `wp.com`, `wixstatic.com`, or other non-church domains. Re-upload logos through the TinaCMS media picker so they're hosted on your current setup.

---

## Part 6 — Understanding why things are the way they are

When something looks weird and you're tempted to "fix" it, check the rationale first. Many design decisions look strange in isolation but make sense once you see the trade-off the previous architect made.

**The reference is [decision-log.md](../for-developers/decision-log.md).** It's worth a 10-minute read even if you have no plans to change anything. Understanding the rationale will help you decide which suggestions from helpful volunteers to take and which to politely decline.

Key choices that bite successors when not understood:

- **Why TinaCloud and not WordPress?** Editor-friendly UI without the maintenance burden of running WordPress, plus content stays as plain files in your repo (portable; no vendor lock-in). The trade-off is one more service in your inventory, but it's worth it.
- **Why Vercel and not a traditional web host?** Zero-config deploys, free for small-church traffic, automatic rebuilds when content changes, first-class Next.js support. Trade-off: tied somewhat to Vercel's release pace.
- **Why a database and not a database-free design?** Subscriber email lists need durable storage that survives rebuilds. Without it, every redeploy would lose subscribers. The trade-off is one more service to maintain — but the alternative is losing subscribers, which is much worse.
- **Why Google sign-in for admins and not just shared passwords?** Shared passwords don't survive a successor transition — which is exactly what's happening to you right now. With Google sign-in, when a volunteer leaves, you remove their email from the allowlist and they're out; no password rotation, no telling everyone the new password. Some churches still use Basic Auth and it works fine; the question is whether you have enough turnover to make the Google path worth setting up.

For each of these and the others in the decision log, the doc records: what was decided, what alternatives were considered, and what trade-offs were accepted. If you ever want to challenge a decision, the right move is to read the relevant ADR first, then weigh in.

✅ **Checkpoint:** You've skimmed decision-log.md and have a sense of why the major architectural choices were made. You're now equipped to push back on bad "let's just rewrite it in X" suggestions.

---

## Part 7 — Ongoing rhythm

Once you've completed the initial inheritance, here's the rhythm a successor should expect day-to-day. None of this is heavy — small churches don't need much active maintenance — but consistency matters.

### Weekly (informal, ~15 min)

No formal schedule. Once a week, casually:

- **Visit the live site.** Click the homepage and one or two recent pages. Anything obviously broken?
- **Open the Vercel dashboard.** Glance at Deployments — any red/failed builds in the past week?
- **If email features are enabled:** glance at Resend → Logs. Any unexpected bounces or failures? Resend's normal state is mostly "delivered" — a sudden cluster of failures wants attention.

Total time: minutes. Mainly a habit of checking, not a checklist.

### Monthly (~30 min, calendar-scheduled)

Block 30 minutes on your calendar, recurring. Walk through the monthly section of [09-maintenance.md](./09-maintenance.md):

- Check for any open pull requests or unusual GitHub commits.
- Accept dependency upgrade pull requests for security patches.
- Confirm no failed Vercel deploys in the past month.
- Run `npm run doctor` if you have a local dev environment set up.

### Quarterly (~60 min, scheduled)

Every three months:

- Review the access lists for all services. Anyone who left the church or stepped down from a role? Remove their access — particularly TinaCloud (CMS), the admin allowlist, and any service they had admin rights on. See the "When someone leaves" section in [09-maintenance.md](./09-maintenance.md).
- Verify SSL certificates aren't about to expire. Vercel handles SSL automatically, but a glance at the domain in a browser (with the padlock icon checked) is reassuring.
- Note any docs or assets that have gotten stale.

### Annually (when convenient)

Once a year, usually around the same calendar season:

- Review domain registration. Renew if needed (or confirm auto-renewal is active).
- Check Vercel plan limits — has the site grown enough to need an upgrade? (Usually no, even after years of growth.)
- Check Resend usage against plan limits if email is heavily used.
- Update this document with anything you've learned. Add gotchas, fix wording that didn't help when you were under pressure, correct service descriptions if any UI has changed.

The annual update is the most underrated of these. Future-you (or future-successor) will thank you for the additions.

✅ **Checkpoint:** You have monthly and quarterly tasks scheduled in your own calendar.

---

## Part 8 — When you eventually pass this on

Sometime, you'll move on. Job change, life change, just less time for the church than you used to have. **Plan for it.** The previous person didn't, and that's why this runbook exists.

When you can see the handoff coming:

1. **Update Part 2's service inventory** with current values. Account emails, plans, owners — make sure they're current.
2. **Identify the next successor early.** A formal handoff conversation beats notes-left-behind every time. Ask the pastor or board to pick someone six weeks before you actually leave if possible.
3. **Schedule a 30-60 minute handoff call** with the new successor. Walk them through this exact runbook on a screen-share. Hand-execute Part 4 (their first 60 minutes) together.
4. **Add the new successor to every service before removing yourself.** They confirm working access; only then do you remove your own access. Never the other way around.
5. **Update `content/admin-access.json`** (or `ADMIN_ALLOWLIST`) to add the new successor and remove yourself if you were on it. They'll need to sign out and back in once — explain the stale-JWT gotcha (Part 5, item 1) so it doesn't trip them.
6. **Update the church's records.** If you maintained a sealed-envelope handoff packet in the church safe, update it with current information and the new successor's name.

The principle: **the next successor should have a strictly better handoff experience than you did.** Whatever was confusing for you, leave a note about it. Whatever was missing, add it. This runbook is yours to evolve.

If you contributed improvements to the underlying template along the way, consider opening a pull request against the template repository at [github.com/kbennett2000/church-site-template](https://github.com/kbennett2000/church-site-template) — your improvements may help future church successors elsewhere too.

✅ **Checkpoint:** You've handed off cleanly. Your successor knows what they have, who they are to it, and what to do if it breaks.

---

## Part 9 — Worst case: rebuilding from scratch

If you really cannot regain access to the existing infrastructure — Scenario C in Part 3 didn't recover what you needed — the last resort is to rebuild on parallel infrastructure and switch over.

The site source code is the most recoverable piece. Everything else depends on what you can salvage.

### What you keep, what you lose

**Keep (recoverable from public sources):**

- The site source code itself, if the GitHub repo is publicly viewable. You can clone it without write access. If the repo is private and you can't get in: the template repo at [github.com/kbennett2000/church-site-template](https://github.com/kbennett2000/church-site-template) is your starting point — your church's customizations to it are lost, but the structure is the same.
- Content currently live on the site is technically scrapeable if it's public, though that's tedious.

**Lose (without backups):**

- The subscriber email database. If you don't have a recent export from `/admin/devotionals` and can't access Neon, your subscriber list is gone — subscribers will need to re-subscribe through the public sign-up flow.
- Any content edits made between your last access and the rebuild point.
- Email send history and delivery analytics.

### Rebuild path

1. **Create a new GitHub repository** in an account you control. Start with either the template or a clone of the church's repo (whichever you can get).
2. **Connect it to a new Vercel project.** See [06-deploy-to-vercel.md](./06-deploy-to-vercel.md) — the procedure is the same as a fresh install, ~30 minutes.
3. **Set up a new TinaCloud project** for the new repo. See [06a-setup-tinacloud.md](./06a-setup-tinacloud.md) — also ~30 minutes.
4. **Restore environment variables.** Without access to the previous Vercel project, you'll need to generate fresh values for `ADMIN_PASSWORD`, `CRON_SECRET`, `RESEND_API_KEY` (new Resend account if you've lost the old one), and so on. See [environment-variables.md](./environment-variables.md).
5. **Re-create the email subscriber flow** if applicable. New Neon database, new schema migrations, new public subscribe page. Old subscribers re-subscribe via the public form when they next hear about it.
6. **Switch DNS** at the domain registrar to point at the new Vercel project. This is the moment of the cutover — visitors start seeing the new site within minutes.

The original site stays running on the old infrastructure (assuming nothing's actively broken) until DNS switches over, so there's no service interruption. The old site simply stops receiving traffic when the new one takes over.

### Honest warning

Rebuilding loses subscriber data unless you have database access or recent exports. The cost of "I'll figure out access later" is potentially your entire email list. If you're inheriting a site with email features and don't have a verified subscriber-database backup, **make obtaining database access a higher priority than any other handoff task.**

---

## Part 10 — Still stuck?

If you've worked through this runbook and you're still uncertain about something specific to your church's site:

1. **The doc map** at [docs/README.md](../README.md) lists every doc by audience. If a topic has its own doc, that's usually a faster read than this runbook.
2. **The runbooks** ([site-down](./runbook-site-down.md), [emails-stopped](./runbook-emails-stopped.md), [rotate-secret](./runbook-rotate-secret.md)) cover specific failure modes step by step.
3. **The decision log** ([decision-log.md](../for-developers/decision-log.md)) covers the "why" questions.
4. **The template repository issues** at [github.com/kbennett2000/church-site-template/issues](https://github.com/kbennett2000/church-site-template/issues) — search for your question, open a new issue if it isn't already discussed.
5. **A developer for 1-2 hours.** Sometimes the right move is hiring a developer for a short, scoped engagement — "I need help configuring TinaCloud" or "I need help debugging a failed deploy." A focused two hours of professional help often beats a week of self-research, and church-website work is small enough that hourly developers can take it on.

The goal of this runbook isn't to make you an expert. It's to make you confident that you know what you have, that you can keep it running, and that you know where to go when you don't know what to do. Welcome to the job.

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Successor%20Runbook).*
