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

## Marketing (used in README)

| Path | What to capture |
| --- | --- |
| `docs/screenshots/marketing/homepage.png` | Wide shot of the live site homepage — hero with the church exterior photo, service time visible, "Plan Your Visit" CTA. Mobile-first composition but desktop crop. |
| `docs/screenshots/marketing/cms-dashboard.png` | The Decap CMS dashboard at `/admin/` showing the collections sidebar (Sermons, Ministries, Staff, etc.) and the main content area listing entries. |

## Editor track (`docs/for-editors/*`)

These are the highest-stakes screenshots — a church secretary will follow this track step by step. Each shot should match the action described in the surrounding step.

| Path | Used in | What to capture |
| --- | --- | --- |
| `docs/screenshots/editor/getting-started-login.png` | 01-getting-started | The Decap login page with the "Login with GitHub" button visible. |
| `docs/screenshots/editor/getting-started-authorize.png` | 01-getting-started | GitHub's authorization page asking the user to grant Decap access. |
| `docs/screenshots/editor/getting-started-dashboard.png` | 01-getting-started | Decap dashboard after login, full-window, collections sidebar on the left labeled. |
| `docs/screenshots/editor/add-a-sermon-list.png` | 02-add-a-sermon | Sermons collection list view, with at least 3 sermons visible and the "New Sermon" button highlighted in the top right. |
| `docs/screenshots/editor/add-a-sermon-new-form.png` | 02-add-a-sermon | Blank new-sermon form, fields visible: Title, Date Preached, Speaker, Series, Scripture, Book of the Bible. |
| `docs/screenshots/editor/add-a-sermon-youtube-id.png` | 02-add-a-sermon | A YouTube video URL in the browser address bar with the 11-character video ID highlighted/circled. Annotate to show what to copy. |
| `docs/screenshots/editor/add-a-sermon-saved-draft.png` | 02-add-a-sermon | Sermon form with a populated title and a "Draft" status badge visible near the top. |
| `docs/screenshots/editor/edit-a-page-list.png` | 03-edit-a-page | Pages collection list showing the "Our Story" entry. |
| `docs/screenshots/editor/edit-a-page-toolbar.png` | 03-edit-a-page | The WYSIWYG markdown toolbar in Decap with bold/italic/heading/link buttons labeled. |
| `docs/screenshots/editor/add-a-staff-member-list.png` | 04-add-a-staff-member | Staff collection list with the "New Staff Member" button visible. |
| `docs/screenshots/editor/update-service-times-list.png` | 05-update-service-times | Site Settings list showing the "Church Info & Site Copy" entry. |
| `docs/screenshots/editor/update-service-times-section.png` | 05-update-service-times | The Sunday Service section of the Site Settings form, with Service Start Time field highlighted. |
| `docs/screenshots/editor/add-an-event-list.png` | 06-add-an-event | Recurring Events list showing existing events. |
| `docs/screenshots/editor/upload-photos-picker.png` | 07-upload-photos | Decap's media picker modal — the file grid with the Upload button visible. |

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
| `docs/screenshots/tech-volunteer/grant-editor-access-collaborators.png` | 08-grant-editor-access | GitHub repository's Settings → Collaborators page with the "Add people" button visible. |

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
