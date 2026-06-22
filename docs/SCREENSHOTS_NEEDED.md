---
type: reference
audience: tech-volunteer
---

# Screenshots needed

Every documentation page that references a screenshot links to a file under `docs/screenshots/` that doesn't exist yet. This page tracks all of them so a single capture pass can produce them.

**How to use this list:**

1. Set up a test version of the site with seed data.
2. Capture each screenshot at 1280×720 minimum, PNG format.
3. Save to the exact path shown.
4. Commit and push — the docs will reference them automatically.

> **Tip:** Use a fresh test GitHub account (not your personal one) for the editor-track captures so faces and real emails aren't shown.

---

## ✅ Capture status (updated 2026-06-22)

A first capture pass is **done**, using a fictional example church ("Cedar Ridge Church"). All app/site screenshots and the most-referenced TinaCMS editor screens are now in the repo and rendering in the README and editor guides.

**Captured:**
- ✅ Both **marketing** shots (`homepage.png`, `cms-dashboard.png`).
- ✅ A wide set of **app pages** under `docs/screenshots/app/` (homepage desktop + mobile, about, beliefs, calendar, watch, sermon detail, visit, ministries, a ministry, all four `connect/*` pages, give, and a custom page).
- ✅ 8 **editor** screens: getting-started dashboard, add-a-sermon list + form, add-a-staff-member list, add-an-event list, edit-a-page list, update-service-times list + section (plus bonus ministries-list and staff-form).

**Still to capture** (these need the *hosted* TinaCloud sign-in, an open rich-text editor, or human annotation — easiest to grab on the live site):
- `editor/getting-started-login.png` — the TinaCloud "Continue with Google" screen (local mode shows no Google login).
- `editor/edit-a-page-toolbar.png` — the rich-text toolbar, with the formatting buttons labeled.
- `editor/add-a-sermon-saved.png` — a sermon form right after saving (success state).
- `editor/add-a-sermon-youtube-id.png` — a browser address bar with the YouTube ID highlighted (annotated).
- `editor/upload-photos-picker.png` — the TinaCMS media picker / upload dialog.
- All **tech-volunteer** dashboard shots below (Vercel, TinaCloud, Resend, Neon, Google Cloud) — these live in third-party accounts and must be captured by the operator.

---

## Marketing (used in README)

| Path | What to capture |
| --- | --- |
| `docs/screenshots/marketing/homepage.png` | Wide shot of the live site homepage — hero with the church exterior photo, service time visible, "Plan Your Visit" CTA. Mobile-first composition but desktop crop. |
| `docs/screenshots/marketing/cms-dashboard.png` | The TinaCMS dashboard at `/admin/` showing the collections sidebar (Sermons, Ministries, Staff, etc.) and the main content area listing entries. |

## Editor track (`docs/for-editors/*`)

These are the highest-stakes screenshots — a church secretary will follow this track step by step. Each shot should match the action described in the surrounding step.

| Path | Used in | What to capture |
| --- | --- | --- |
| `docs/screenshots/editor/getting-started-login.png` | 01-getting-started | The TinaCMS login page with the "Continue with Google" button visible. |
| `docs/screenshots/editor/getting-started-dashboard.png` | 01-getting-started | TinaCMS dashboard after login, full-window, collections sidebar on the left labeled. |
| `docs/screenshots/editor/add-a-sermon-list.png` | 02-add-a-sermon | Sermons collection list view, with at least 3 sermons visible and the "New Sermon" button highlighted in the top right. |
| `docs/screenshots/editor/add-a-sermon-new-form.png` | 02-add-a-sermon | Blank new-sermon form, fields visible: Title, Date Preached, Speaker, Series, Scripture, Book of the Bible. |
| `docs/screenshots/editor/add-a-sermon-youtube-id.png` | 02-add-a-sermon | A YouTube video URL in the browser address bar with the 11-character video ID highlighted/circled. Annotate to show what to copy. |
| `docs/screenshots/editor/add-a-sermon-saved.png` | 02-add-a-sermon | Sermon form immediately after saving — confirmation message or save indicator visible at the top. |
| `docs/screenshots/editor/edit-a-page-list.png` | 03-edit-a-page | Pages collection list showing the "Our Story" entry. |
| `docs/screenshots/editor/edit-a-page-toolbar.png` | 03-edit-a-page | The WYSIWYG markdown toolbar in TinaCMS with bold/italic/heading/link buttons labeled. |
| `docs/screenshots/editor/add-a-staff-member-list.png` | 04-add-a-staff-member | Staff collection list with the "New Staff Member" button visible. |
| `docs/screenshots/editor/update-service-times-list.png` | 05-update-service-times | Site Settings list showing the "Church Info & Site Copy" entry. |
| `docs/screenshots/editor/update-service-times-section.png` | 05-update-service-times | The Sunday Service section of the Site Settings form, with Service Start Time field highlighted. |
| `docs/screenshots/editor/add-an-event-list.png` | 06-add-an-event | Recurring Events list showing existing events. |
| `docs/screenshots/editor/upload-photos-picker.png` | 07-upload-photos | TinaCMS's media picker modal — the file grid with the Upload button visible. |

## Tech volunteer track (`docs/for-tech-volunteers/*`)

| Path | Used in | What to capture |
| --- | --- | --- |
| `docs/screenshots/tech-volunteer/prerequisites-nodejs-download.png` | 02-prerequisites | nodejs.org download page with the LTS button highlighted. |
| `docs/screenshots/tech-volunteer/prerequisites-git-windows-download.png` | 02-prerequisites | git-scm.com Windows download page. |
| `docs/screenshots/tech-volunteer/use-template-button.png` | 03-use-this-template | GitHub repo page with the "Use this template" button in the top right circled. |
| `docs/screenshots/tech-volunteer/use-template-created-repo.png` | 03-use-this-template | The newly-created repository in the user's own account. |
| `docs/screenshots/tech-volunteer/use-template-codespaces-tab.png` | 03-use-this-template | The green Code button expanded, Codespaces tab selected, "Create codespace on main" button visible. |
| `docs/screenshots/tech-volunteer/use-template-copy-url.png` | 03-use-this-template | The Code dropdown showing the HTTPS clone URL with the copy button. |
| `docs/screenshots/tech-volunteer/deploy-to-vercel-signup.png` | 06-deploy-to-vercel | vercel.com/signup page with "Continue with GitHub" button visible. |
| `docs/screenshots/tech-volunteer/deploy-to-vercel-import-list.png` | 06-deploy-to-vercel | Vercel's "Import Git Repository" screen with the user's repos listed. |
| `docs/screenshots/tech-volunteer/deploy-to-vercel-configure.png` | 06-deploy-to-vercel | The "Configure Project" page in Vercel showing Framework Preset auto-detected as Next.js. |
| `docs/screenshots/tech-volunteer/deploy-to-vercel-success.png` | 06-deploy-to-vercel | Vercel's celebration page after first deploy, with the confetti and live URL. |
| `docs/screenshots/tech-volunteer/connect-domain-vercel-domains.png` | 07-connect-domain | Vercel project Settings → Domains tab with an empty domain list and "Add" button. |
| `docs/screenshots/tech-volunteer/connect-domain-dns-instructions.png` | 07-connect-domain | The DNS records Vercel shows after you add a domain (A record / CNAME / nameserver options visible). |
| `docs/screenshots/tech-volunteer/grant-editor-access-tinacloud.png` | 08-grant-editor-access | TinaCloud project's Users page with the "Invite User" button and email input visible. |

### TinaCloud setup (`06a-setup-tinacloud.md`)

These are the highest-priority captures in the tech-volunteer track right now — TinaCloud was the #1 quit point in the adoption audit, and the doc is currently text-only. Until these exist, the doc relies on prose descriptions of "look for a button labeled something like…" patterns.

Capture against the live `app.tina.io` UI as of the capture date. TinaCloud's UI evolves; if labels in the screenshots no longer match what a visitor sees, recapture rather than rewriting the doc — the prose is intentionally tolerant of UI drift.

| Path | Used in step | What to capture |
| --- | --- | --- |
| `docs/screenshots/tech-volunteer/tinacloud-signin.png` | 06a-setup-tinacloud, Step 1 | `app.tina.io` landing page with the "Sign in with GitHub" button visible. |
| `docs/screenshots/tech-volunteer/tinacloud-dashboard-empty.png` | 06a-setup-tinacloud, Step 1 | First-load TinaCloud dashboard for a brand-new account — empty project list and the prominent "Create New Project" call-to-action. |
| `docs/screenshots/tech-volunteer/tinacloud-new-project-form.png` | 06a-setup-tinacloud, Steps 2-4 | The new-project wizard mid-flow, with the GitHub-repo dropdown, the branch selector showing `main`, and the framework selector showing Next.js. |
| `docs/screenshots/tech-volunteer/tinacloud-project-overview.png` | 06a-setup-tinacloud, Step 5 | A new project's Overview screen with the Client ID / Project ID prominently displayed — that field should be the focal point of the crop. |
| `docs/screenshots/tech-volunteer/tinacloud-token-generate.png` | 06a-setup-tinacloud, Step 6 | The Tokens (or API Keys) page with the dialog/panel that appears after generating a read-only token — the token value should be visibly displayed (blur or use a test project for capture so the real value doesn't leak). The "shown only once" warning text should be included if TinaCloud shows it. |
| `docs/screenshots/tech-volunteer/tinacloud-vercel-envvars.png` | 06a-setup-tinacloud, Steps 8-9 | Vercel's Settings → Environment Variables page after both `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` have been added — both shown in the list with the Sensitive indicator visible. Mask the actual values. |
| `docs/screenshots/tech-volunteer/tinacloud-vercel-redeploy.png` | 06a-setup-tinacloud, Step 10 | The Vercel Deployments tab with the three-dot menu open on the most recent deployment, and the Redeploy confirmation dialog with the "Use existing Build Cache" checkbox visible (unchecked). |
| `docs/screenshots/tech-volunteer/tinacloud-admin-signin.png` | 06a-setup-tinacloud, Step 11 | The TinaCloud sign-in screen as seen at `your-site.vercel.app/admin/` — the branded "Sign in with GitHub" page that appears once the env vars are wired correctly. |
| `docs/screenshots/tech-volunteer/tinacloud-admin-collections.png` | 06a-setup-tinacloud, Step 11 | The TinaCMS interface after a successful sign-in — left sidebar showing collections (Site Settings, Sermons, Staff, etc.), main panel showing whichever collection is open first. This overlaps with the existing `marketing/cms-dashboard.png` capture; one good shot covers both uses. |

### Operational runbooks (`runbook-*.md`)

These runbooks are intentionally text-only for v1 because they're read under stress, when reading-tolerance is lowest. Good screenshots here are *high* impact — a glance at "this is what a failed deploy looks like" anchors the entire decision tree. Capture only when the matching UI is in the right state (you may need to deliberately break a staging deploy to capture a failure state).

| Path | Used in | What to capture |
| --- | --- | --- |
| `docs/screenshots/tech-volunteer/runbook-vercel-deployments-ready.png` | runbook-site-down, Check 2 | Vercel Deployments list with the most recent deployment showing **Ready** (green checkmark) — the healthy state to compare against. |
| `docs/screenshots/tech-volunteer/runbook-vercel-deployments-failed.png` | runbook-site-down, Check 2 | Vercel Deployments list with a recent deployment showing **Error**/**Failed** (red) — the symptom state. |
| `docs/screenshots/tech-volunteer/runbook-vercel-promote-menu.png` | runbook-site-down, "Fastest fix is rollback" | The **⋯** menu open on a Ready deployment in the Deployments list, showing the **Promote to Production** option highlighted. This is the most-referenced screenshot across all three runbooks. |
| `docs/screenshots/tech-volunteer/runbook-vercel-build-logs.png` | runbook-site-down, Check 2 | A failed-deploy detail view with the build log scrolled to show a typical "last error" — a Module not found or env-var error works well as an exemplar. |
| `docs/screenshots/tech-volunteer/runbook-vercel-runtime-logs.png` | runbook-site-down, Check 4 + runbook-emails-stopped, Check 2 | The **Runtime Logs** tab on a deployment, with filters visible (so the reader knows where to filter by route path). |
| `docs/screenshots/tech-volunteer/runbook-browser-devtools-network.png` | runbook-site-down, Check 4 | Browser DevTools Network tab with the first request highlighted and its status code visible. Either a 200 or 500 is fine; the goal is showing the reader where to look. |
| `docs/screenshots/tech-volunteer/runbook-vercel-crons-list.png` | runbook-emails-stopped, Check 2 | Vercel project Settings → Cron Jobs (or Crons) page showing both `/api/cron/devotionals` and `/api/cron/digest` with their hourly schedule and last-invocation timestamps. |
| `docs/screenshots/tech-volunteer/runbook-resend-logs.png` | runbook-emails-stopped, Check 4 | Resend dashboard Logs view filtered to the last 24 hours, showing a mix of `delivered`, `bounced`, and (ideally) a `failed` with the error reason visible. |
| `docs/screenshots/tech-volunteer/runbook-resend-api-keys.png` | runbook-emails-stopped, Check 5 + runbook-rotate-secret (RESEND_API_KEY) | Resend API Keys page with at least one key listed, the **Create API Key** button visible, and the per-key **⋯** menu hint (rotation pattern). |
| `docs/screenshots/tech-volunteer/runbook-drizzle-studio-subscribers.png` | runbook-emails-stopped, Check 1 | Drizzle Studio with the `subscribers` table open, showing the columns (id, email, status, tags, etc.) so the reader knows what to look at. Use seed data with redacted emails. |
| `docs/screenshots/tech-volunteer/runbook-vercel-env-vars.png` | runbook-rotate-secret (multiple sections) + runbook-emails-stopped, Check 3 | Vercel Settings → Environment Variables page with several vars listed (`RESEND_API_KEY`, `DATABASE_URL`, `CRON_SECRET`, etc.) and the Edit menu visible on one of them. Mask actual values. |
| `docs/screenshots/tech-volunteer/runbook-vercel-redeploy-dialog.png` | runbook-rotate-secret (all sections) | The Redeploy confirmation dialog with the "Use existing Build Cache" checkbox visible and unchecked — referenced from every rotation procedure. |
| `docs/screenshots/tech-volunteer/runbook-dnschecker-resolved.png` | runbook-site-down, Check 3 | A dnschecker.org result page showing the user's domain resolving to a Vercel IP with green checkmarks across regions — the healthy state. |

### Successor runbook (`successor-runbook.md`)

The successor runbook is text-heavy by design (the reader is anxious; we want to lower anxiety with words before adding visual complexity). But there are specific points where a screenshot would lower friction sharply — primarily the "invite a collaborator" flow for each service, because the reader is going to do this once per service back-to-back and learning each UI from scratch is a heavy ask.

Capture from a real church-instance project where possible, with sensitive emails masked. The "invite" screens look the same across all accounts so a single capture per service is reusable.

| Path | Used in section | What to capture |
| --- | --- | --- |
| `docs/screenshots/tech-volunteer/successor-github-collaborators.png` | Part 3, Scenario A | GitHub repo Settings → Collaborators page with the "Add people" / "Invite a collaborator" button visible. |
| `docs/screenshots/tech-volunteer/successor-vercel-members.png` | Part 3, Scenario A | Vercel project or account Members page with the invite-by-email form visible. |
| `docs/screenshots/tech-volunteer/successor-tinacloud-users.png` | Part 3, Scenario A | TinaCloud project → Users page with the invite button visible. Overlaps with `tinacloud-` captures already catalogued; reuse if the framing works. |
| `docs/screenshots/tech-volunteer/successor-resend-team.png` | Part 3, Scenario A | Resend Settings → Team page with the invite-member form visible. |
| `docs/screenshots/tech-volunteer/successor-neon-sharing.png` | Part 3, Scenario A | Neon project Settings → Sharing/Members page with the invite form visible. |
| `docs/screenshots/tech-volunteer/successor-gcp-iam.png` | Part 3, Scenario A | Google Cloud Console IAM page with the "Grant Access" panel open, showing the role-picker. |
| `docs/screenshots/tech-volunteer/successor-vercel-env-vars-overview.png` | Part 4, Step 3 | Vercel Settings → Environment Variables landing page — the successor's first look at what variables the site uses. Heavily anonymized. Overlaps with `runbook-vercel-env-vars.png` already catalogued; one capture serves both. |
| `docs/screenshots/tech-volunteer/successor-vercel-crons-overview.png` | Part 4, Step 5 | Vercel Settings → Cron Jobs (or Crons) showing the hourly devotional and digest crons listed with recent invocations. Overlaps with `runbook-vercel-crons-list.png`; one capture serves both. |
| `docs/screenshots/tech-volunteer/successor-drizzle-studio-overview.png` | Part 4, Step 5 | Drizzle Studio with the `subscribers` table open at a high level — successor's first look at what's in the database. Overlaps with `runbook-drizzle-studio-subscribers.png`; one capture serves both. |

## Developer track (`docs/for-developers/*`)

No screenshots needed — these are reference docs with code excerpts rather than UI walkthroughs.

---

## Capture checklist

When recording, use:

- Browser zoom at 110-125% so text is readable when scaled down in docs.
- Light theme, default GitHub appearance.
- Window width ~1280px (consistent across shots).
- Crop tight to the relevant area — full-page screenshots are usually too big.
- Annotate clicks with a circle or arrow in red — Skitch, Cleanshot, or any markup tool works.

After capture, run `git status` to confirm the path matches one in the table above. The docs should then render the image without further changes.

---

*Was this list missing a screenshot? [Open an issue](https://github.com/kbennett2000/church-site-template/issues/new).*
