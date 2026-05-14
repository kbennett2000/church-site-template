# Usability review — raw findings

**Reviewer:** Claude (sub-agent) acting as the 65-year-old church-secretary persona.
**Files reviewed:** 20
**Total issues flagged:** 175

---

## docs/for-editors/01-getting-started.md

- **Line 12 — jargon-undefined:** "A free GitHub account" — she's never heard of GitHub. The doc later says "GitHub is a free service that stores the website's files," but that's not until step 2, and the prerequisites list hits her first.
- **Line 13 — jargon-undefined:** "to invite you to the church's GitHub" — invite her how? To what? She'd picture an email invitation but not understand what she's joining.
- **Line 14 — assumed-knowledge:** "The web address of your church's site, with `/admin/` on the end" — she may not understand why you'd add `/admin/` and might worry she's not "allowed" to go there.
- **Line 16 — missing-context:** "the tech volunteer at your church has to add your GitHub username to the website" — she doesn't yet know what a GitHub username is or where to find hers.
- **Line 20 — jargon-undefined:** "**CMS** (Content Management System...)" — fine, defined inline; good pattern. (good)
- **Line 26 — ambiguous-step:** "**Type** your church's web address followed by `/admin/`" — she might literally type "yourchurch.org/admin/" because the example uses that placeholder.
- **Line 44 — assumed-knowledge:** "Your username is how other people on the team will recognize you — use something like `jane-smith` or `jsmith-mvc`" — she might wonder what characters are allowed, whether to use her real name, and whether punctuation/uppercase matters.
- **Line 52 — ambiguous-step:** "My GitHub username is `@jane-smith`" — she may not know where to find her username on GitHub once she's signed up.
- **Line 58 — jargon-undefined:** "Decap (the editor)" — first time "Decap" appears without explanation. She'll wonder if Decap is something separate from "the editor."
- **Line 66 — missing-context:** "GitHub's authorization screen" — she has no idea what authorization means or what she's agreeing to. Brief reassurance would help.
- **Line 84 — jargon-undefined:** "**Collections** (categories of things you can edit)" — defined inline. (good)
- **Line 95 — jargon-undefined:** "**Workflow**. That's where drafts and changes waiting for review show up" — "drafts" and "waiting for review" are new concepts not yet introduced.
- **Line 117 — assumed-knowledge:** "open an issue: [GitHub Issues]" — she has no idea what "opening an issue" means, and the link looks technical and intimidating.

## docs/for-editors/02-add-a-sermon.md

- **Line 75 — missing-context:** "This is the part most people get stuck on, so go slowly." — Good framing. (good)
- **Line 79 — assumed-knowledge:** "**Look** at the address bar. The URL looks like one of these:" — She knows what a URL is, but might not have the YouTube video open, or might not realize the "address bar" is the same on YouTube as on any site.
- **Line 85 — ambiguous-step:** "The **Video ID** is the 11-character code after `v=` (or after `youtu.be/`, or after `/live/`)." — Counting characters and finding "after `v=`" assumes she can parse URL parameters. The example screenshot helps; without it she'd likely give up.
- **Line 109 — missing-context:** "(Don't worry that it says 'image' — Decap reuses the same picker for files.)" — Nice acknowledgment but the word "Decap" might confuse — earlier docs called this "the editor."
- **Line 129 — ambiguous-step:** "Pick a wide photo (about twice as wide as it is tall — for example, 1600 by 900 pixels)" — She may not know how to find or determine a photo's dimensions before uploading.
- **Line 149 — assumed-knowledge:** "**Click** the **Status: Draft** dropdown at the top of the form." — Status concept introduced abruptly; "dropdown" she knows from forms, fine.
- **Line 169 — jargon-undefined:** "Series names are case- and spelling-sensitive" — "case-sensitive" is a technical term she may not know.
- **Line 180 — assumed-knowledge:** "open an issue: [GitHub Issues]" — repeated across docs; she still doesn't know what this means.

## docs/for-editors/03-edit-a-page.md

- **Line 39 — jargon-undefined:** "**Story** field is a WYSIWYG editor — 'What You See Is What You Get.'" — defined inline. (good)
- **Line 45 — assumed-knowledge:** "(or press Ctrl+B on Windows, Cmd+B on Mac)" — She'll know one of these from Word — likely OK.
- **Line 47 — jargon-undefined:** "Don't use **Heading 1** — that's reserved for the page title." — "reserved for" is vague; she may not understand why or what would happen if she did.
- **Line 83 — give-up-risk:** "There's also a small text-mode toggle for editors who want to write in Markdown (a simple text-with-symbols format). Don't worry about this — the toolbar handles everything for you." — Multiple unfamiliar terms (text-mode toggle, Markdown, "text-with-symbols") even though it says don't worry; the warning may itself cause uncertainty.
- **Line 109 — assumed-knowledge:** "Try pasting with Ctrl+Shift+V (Windows) or Cmd+Shift+V (Mac) — this pastes as plain text." — She might not know what plain text means in this context, but the keyboard shortcut is followable.
- **Line 119 — assumed-knowledge:** "open an issue: [GitHub Issues]" — repeat issue.

## docs/for-editors/04-add-a-staff-member.md

- **Line 15 — ambiguous-step:** "A square headshot photo (about 800 by 800 pixels works best)" — She may not know how to determine a photo's pixel dimensions before clicking upload.
- **Line 68 — missing-context:** "Set Display Order (this is the tricky one)" — Good warning. (good)
- **Line 87 — assumed-knowledge:** "Give the new person `2.5` — fractional numbers work fine." — Conceptually clever, but she might worry "is that wrong, won't 2.5 break something?"
- **Line 155 — assumed-knowledge:** "open an issue: [GitHub Issues]" — repeat issue.

## docs/for-editors/05-update-service-times.md

- **Line 68 — ambiguous-step:** "Address — street, city, state (two letters), ZIP code." — Unclear if these are separate fields or one. She'll find out, but a screenshot or "you'll see four fields" would help.
- **Line 101 — assumed-knowledge:** "your browser cached the old version. Refresh the page with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)." — "Cached" not defined. The instruction is followable, but if it doesn't work she has no fallback.
- **Line 111 — assumed-knowledge:** "open an issue: [GitHub Issues]" — repeat issue.

## docs/for-editors/06-add-an-event.md

- **Line 51 — missing-context:** "**Internal ID** is a short nickname for the event in the system" — She might not understand why it needs to be lowercase with hyphens. Examples help, but the constraint is computer-y.
- **Line 62 — assumed-knowledge:** "Once you publish an event, don't change its Internal ID later. If you do, links and RSVPs tied to it can break." — "Links and RSVPs tied to it" is hand-wavy; she'd want concrete reassurance.
- **Line 99 — give-up-risk:** "`weekly` — for events that happen every week on the same day. / `nth-of-month` — for events like 'the second Saturday of every month.' / `last-of-month` — for events like 'the last Sunday of every month.'" — The hyphenated lowercase values (`nth-of-month`, `last-of-month`) look code-like and unfamiliar. She'd worry she's "supposed to type that exactly."
- **Line 107 — ambiguous-step:** "**Type** a number in the **Day of Week** field" — using 0-6 to represent days is unintuitive; the doc warns "Sunday is `0`, that's a computer thing" but she may still misremember and pick wrong.
- **Line 120 — missing-context:** "The numbering starts at zero — that's a computer thing." — Honest, but doesn't reassure her; she may worry she'll mess this up.
- **Line 222 — assumed-knowledge:** "open an issue: [GitHub Issues]" — repeat issue.

## docs/for-editors/07-upload-photos.md

- **Line 21 — jargon-undefined:** "1200 pixels wide on the long edge" — "long edge" may be unclear; she'd interpret "1200 pixels" as a unit she's heard of but never measured.
- **Line 22 — assumed-knowledge:** "under 2 megabytes (MB). Huge files make the site slow." — She knows MB roughly from email attachments. OK.
- **Line 29 — assumed-knowledge:** "1920 × 1080 pixels — Wide rectangle (16:9)" — "16:9" ratio terminology is technical; the "wide rectangle" plain-language label helps.
- **Line 40 — jargon-undefined:** "**JPG** (also called JPEG)" — fine, but next line: "Smaller files, faster pages." — clear.
- **Line 41 — jargon-undefined:** "**PNG** — for logos, screenshots, or anything with sharp edges or transparent backgrounds." — "transparent background" may be unfamiliar.
- **Line 52 — assumed-knowledge:** "**Windows:** Open the photo in **Paint** or **Photos**, choose **Resize**, change the width, save." — She likely uses Photos; OK. But specifics of "change the width" without saying which value to enter could trip her up.
- **Line 56 — assumed-knowledge:** "[squoosh.app](https://squoosh.app/) — drag a photo in, drag the slider to shrink it, download the smaller version." — "Drag a photo in" assumes drag-and-drop familiarity.
- **Line 104 — missing-context:** "Every photo you upload is stored in the website's `images/uploads/` folder." — She wouldn't recognize this as a path; harmless but mildly unsettling.
- **Line 112 — jargon-undefined:** "Decap won't overwrite a file with the same name" — "Decap" mentioned again without re-explaining.
- **Line 123 — assumed-knowledge:** "open an issue: [GitHub Issues]" — repeat issue.

## docs/for-editors/08-publishing-changes.md

- **Line 19 — jargon-undefined:** "sends your change to GitHub as a 'change ticket' (a pull request)." — Defined inline. (good)
- **Line 26 — assumed-knowledge:** The ASCII flow diagram — she'd see "boxes and arrows" but might find it more confusing than helpful.
- **Line 45 — jargon-undefined:** "**commit** — a snapshot of what you changed" — defined inline. (good)
- **Line 47 — jargon-undefined:** "GitHub opens a **pull request** — think of it as a 'please merge this change' ticket." — defined inline. (good)
- **Line 50 — missing-context:** "'Commit,' 'pull request,' 'merge' — these are all GitHub words. You don't need to know them." — Good reassurance. (good)
- **Line 57 — jargon-undefined:** "**In Review** — you've marked it Ready for Review and clicked Publish." — Reasonably introduced.
- **Line 110 — missing-context:** "The old version is preserved in GitHub's history — nothing is ever truly lost" — Reassuring. (good)
- **Line 133 — assumed-knowledge:** "open an issue: [GitHub Issues]" — repeat issue.

## docs/for-editors/glossary.md

- **Line 41 — assumed-knowledge:** "Clicking **Publish → Publish now** sends your change to a tech volunteer for a quick review." — Glossary entries are written with implicit context. The arrow `→` notation isn't explained — she'd interpret it as "then click," which is correct, but isn't obvious.
- **Line 47 — jargon-undefined:** "It's stored on a service called GitHub." — Fine.
- **Line 87 — jargon-undefined:** "**Markdown** — A simple way to write formatted text using symbols instead of buttons — for example, `**bold**` for **bold** or `# Heading` for a heading." — Defined, but the asterisks-as-formatting concept may confuse her even with the explanation.
- **Line 105 — assumed-knowledge:** "open an issue: [GitHub Issues]" — repeat issue.

## docs/for-editors/troubleshooting.md

- **Line 21 — jargon-undefined:** "GitHub repository (the website's filing cabinet)" — defined inline. (good)
- **Line 33 — ambiguous-step:** "ask your tech volunteer to confirm they added the username spelled exactly as it appears on your GitHub profile page (at `github.com/yourusername`)" — She may not know how to find her own GitHub profile page; the URL with `yourusername` could be read literally.
- **Line 35 — assumed-knowledge:** "Cookies cleared, or you logged out of GitHub between sessions." — "Cookies" and "session" are technical terms.
- **Line 39 — assumed-knowledge:** "Pop-up blocker is hiding the GitHub login window." — "Pop-up blocker" she might know vaguely; the fix is okay.
- **Line 41 — assumed-knowledge:** "Check the address bar for a small 'pop-up blocked' icon. **Click** it and **allow** pop-ups from the church's site" — Specific enough she could try; depends on browser.
- **Line 109 — assumed-knowledge:** "Your GitHub login expired, or someone changed your access permissions while you were working." — "Expired login" is jargon she'd vaguely understand.
- **Line 191 — assumed-knowledge:** "The URL of the editor page you were on." — Clear instruction.
- **Line 202 — assumed-knowledge:** "open an issue: [GitHub Issues]" — repeat issue.

## docs/for-tech-volunteers/01-overview.md

(Note: this section is for "semi-technical" people, but persona still flagged.)

- **Line 8 — missing-context:** "The semi-technical person at the church" — She might read this thinking "is that me?" and quickly conclude no, but at least the audience is signaled.
- **Line 20 — jargon-undefined:** "powered by Next.js" — Undefined; she'd ignore but it adds friction.
- **Line 22 — jargon-undefined:** "Decap CMS" — first appearance.
- **Line 33 — give-up-risk:** "Install Node.js and Git (or use Codespaces, no install)" — Three unfamiliar terms in one cell of a table: Node.js, Git, Codespaces. She'd close the doc.
- **Line 38 — jargon-undefined:** "set up CMS authentication" — undefined.
- **Line 50 — jargon-undefined:** "live website at a `*.vercel.app` URL" — `*.vercel.app` is unfamiliar pattern.
- **Line 52 — jargon-undefined:** "A **GitHub repository** that stores all the website's content."
- **Line 63 — give-up-risk:** "Node.js is the engine that builds and previews the site on your computer. Git is the version-control tool that talks to GitHub. **Or** you can skip both by using GitHub Codespaces, which runs everything in your browser." — Three concepts back-to-back; would overwhelm.
- **Line 65 — jargon-undefined:** "**Fork the repository** — You copy the template to your own GitHub account so you can customize it." — Defined inline. (good)
- **Line 73 — give-up-risk:** "Point `yourchurch.org` at Vercel by adding two DNS records at your domain registrar (the place you bought the domain)." — DNS, records, registrar all hit at once.
- **Line 75 — jargon-undefined:** "set up the Decap authentication so they can log in" — undefined.
- **Line 89 — jargon-undefined:** "username and password at GoDaddy, Namecheap, Cloudflare, or wherever the domain is registered" — She'd know GoDaddy maybe; "domain registered" concept fuzzy.
- **Line 96 — assumed-knowledge:** "A database — there isn't one. All content is stored as files in GitHub." — Reassuring, but mentioning a database is itself confusing.

## docs/for-tech-volunteers/02-prerequisites.md

- **Line 20 — give-up-risk:** "**Path A (recommended): GitHub Codespaces — no install**" — She'd want this option but doesn't know what Codespaces is yet.
- **Line 22 — jargon-undefined:** "It runs the whole development environment in your browser." — "development environment" is jargon.
- **Line 31 — assumed-knowledge:** "Codespaces gives you Node.js and Git built in." — Even bypassing install, she'd worry she's missing something.
- **Line 42 — jargon-undefined:** "Node.js is the engine that runs the setup script and builds the website. You need version 18 or newer." — "Engine," "setup script," "version 18" — multiple terms.
- **Line 48 — ambiguous-step:** "**Click** the big green **LTS** button on the homepage. ('LTS' means 'Long-Term Support' — the stable version.)" — Inline explanation helps. (good)
- **Line 56 — assumed-knowledge:** "**Click** **Next** through each screen, accepting the defaults." — Familiar pattern from Windows installers — OK.
- **Line 66 — give-up-risk:** "**Open** a terminal:" — She has never opened a terminal; the instruction "Press the Windows key, type `cmd`, press Enter. A black window opens." is followable but the appearance of a black command window would alarm her.
- **Line 72 — give-up-risk:** "**Type** this command and press Enter: `node --version`" — Cliff: she's now typing commands. Two unfamiliar terms (terminal, command) and a syntax (`--`) that looks alien.
- **Line 76 — ambiguous-step:** "If the version starts with `v18`, `v20`, `v22`, or higher, you're good." — Familiar pattern, but she'd need to literally compare numbers.
- **Line 78 — assumed-knowledge:** "If you see 'command not found' or 'is not recognized,' Node.js didn't install correctly." — She'd assume something was broken.
- **Line 91 — ambiguous-step:** "**Click** **64-bit Git for Windows Setup** (the most common option)." — "64-bit" is undefined; she might not know what to pick.
- **Line 96 — ambiguous-step:** "The installer asks a lot of questions about line endings and editors; **accept every default**." — "Line endings" is opaque; "accept every default" is good reassurance.
- **Line 114 — jargon-undefined:** "**Command Line Developer Tools**" — undefined.
- **Line 119 — give-up-risk:** "Use your package manager:" + bash commands `sudo apt install git` — Total cliff. "Package manager," "sudo," "apt" all unknown.
- **Line 146 — give-up-risk:** "git config --global user.name 'Your Name'" — She'd need to literally type these, with quotes, and the `--global` flag looks alien.
- **Line 152 — missing-context:** "You won't see any output. That's normal — Git silently saved the settings." — Good reassurance. (good)
- **Line 159 — jargon-undefined:** "a code editor" — "Visual Studio Code" she'd Google.
- **Line 170 — give-up-risk:** "Mac terminal asks for an 'Xcode license.' Type `sudo xcodebuild -license` and follow the prompts." — Multiple unknowns; she'd give up.
- **Line 171 — jargon-undefined:** "'Checkout Windows-style, commit Unix-style' works for this project" — pure jargon.

## docs/for-tech-volunteers/03-fork-and-clone.md

- **Line 18 — jargon-undefined:** "A **fork** is GitHub's word for 'make my own copy of someone else's repository.'" — Defined inline. (good)
- **Line 33 — ambiguous-step:** "The URL looks like `https://github.com/kbennett2000/church-site-template` (replace with the actual template URL when published)." — "kbennett2000/church-site-template" is placeholder she'd type literally.
- **Line 45 — jargon-undefined:** "Leave it as your personal GitHub account, or pick a GitHub Organization if the church has one." — "Organization" undefined; she'd not know.
- **Line 51 — jargon-undefined:** "**Leave** the **Copy the main branch only** checkbox checked." — "branch" undefined.
- **Line 67 — give-up-risk:** "Codespaces runs the project in your browser. No install needed." — Reassuring, but the next steps still expect terminal familiarity.
- **Line 88 — assumed-knowledge:** "A new browser tab opens with a loading screen. After about 60 seconds, you'll see a full code editor in your browser with a terminal at the bottom." — She's never seen a "code editor"; the appearance would be intimidating.
- **Line 91 — ambiguous-step:** "If the welcome message doesn't show, **click** in the terminal area at the bottom of the screen." — She wouldn't know which area is "the terminal."
- **Line 109 — give-up-risk:** "**Click** the small **copy** icon next to the HTTPS URL. The URL looks like `https://github.com/your-username/church-site.git`." — `.git` suffix unfamiliar; "HTTPS URL" vs SSH not explained.
- **Line 121 — ambiguous-step:** "By default, your terminal starts in your home folder. To put the project on your desktop: `cd Desktop`" — `cd` command unknown to her.
- **Line 134 — give-up-risk:** "`git clone https://github.com/your-username/church-site.git`" — She'd type "your-username" literally.
- **Line 141 — assumed-knowledge:** Output snippet "remote: Enumerating objects: 1234, done." — Total gibberish, but only used to confirm success.
- **Line 153 — ambiguous-step:** "`cd church-site`" — She wouldn't know that this is "entering" a folder.
- **Line 163 — jargon-undefined:** "If you installed VS Code: `code .`" — `code .` looks bizarre.
- **Line 174 — give-up-risk:** "`git clone` says 'Permission denied (publickey).' You copied an SSH URL instead of HTTPS." — SSH, public key, HTTPS — pile of unknowns.

## docs/for-tech-volunteers/04-first-time-setup.md

- **Line 22 — jargon-undefined:** "Installs the project's software dependencies (about 100 packages — runs once)." — "Dependencies," "packages" undefined.
- **Line 26 — jargon-undefined:** "Writes those answers into `content/site.json` and `app/globals.css`." — File paths and `.json`/`.css` extensions unfamiliar.
- **Line 41 — give-up-risk:** "In your terminal, type: `ls`" — Two-letter command, unfamiliar.
- **Line 44 — assumed-knowledge:** "(On Windows native command prompt, use `dir` instead of `ls`.)" — Adds branching complexity.
- **Line 46 — assumed-knowledge:** "You should now see a list of files and folders including `package.json`, `content`, `app`, and `scripts`." — She'd see a list but wouldn't know what those mean.
- **Line 52 — give-up-risk:** "`npm run setup`" — "npm" is alien; she would have hit it many times now.
- **Line 76 — missing-context:** "Don't interrupt this step. If the install gets cut off halfway, the project won't work and you'll have to delete `node_modules/` and re-run setup." — Recoverable, but mentions `node_modules/` ominously.
- **Line 100 — assumed-knowledge:** "**Short name / acronym:** The 2-3 letter version used inside the placeholder logo. The script auto-suggests one based on the church name's initials." — Clear once read.
- **Line 148 — give-up-risk:** "`npm run start`" — Another alien command.
- **Line 162 — ambiguous-step:** "**Open** [http://localhost:3000](http://localhost:3000) in a browser." — "localhost" undefined; she'd worry "isn't a website on the internet?"
- **Line 166 — jargon-undefined:** "**Codespaces note:** In Codespaces, the URL is different — VS Code in the browser shows a small popup... Or click the **Ports** tab in the bottom panel and click the globe icon next to port 3000." — "Ports tab," "port 3000" full jargon.
- **Line 170 — assumed-knowledge:** "press **Ctrl+C** to stop the running site." — She knows Ctrl+C as copy; might be confused.
- **Line 178 — jargon-undefined:** "`content/site.json`" — file path with extension.
- **Line 179 — jargon-undefined:** "`app/globals.css`" — `.css` undefined.
- **Line 192 — jargon-undefined:** "'npm: command not found.' Node.js isn't installed correctly." — Persona would think the whole project broke.

## docs/for-tech-volunteers/05-customize-branding.md

- **Line 13 — jargon-undefined:** "logo as an image file (PNG or SVG, ideally with a transparent background)" — "SVG" undefined here.
- **Line 14 — jargon-undefined:** "Hex codes or names for the church's official brand colors." — "Hex codes" undefined.
- **Line 25 — assumed-knowledge:** "the setup script generated a basic logo using the church's initials and dropped it at `public/logo.svg`" — file path; she'd not know how to find it.
- **Line 33 — jargon-undefined:** "**PNG** with a transparent background, OR **SVG** (better — scales perfectly to any size)." — "Transparent background" and "scales perfectly" partially understandable.
- **Line 35 — assumed-knowledge:** "[Photopea](https://www.photopea.com/) — free browser-based option." — Suggested but she wouldn't know how to use it.
- **Line 41 — give-up-risk:** "In Codespaces or VS Code, you can drag-and-drop the file from your desktop into the `public/` folder in the file tree." — "File tree" undefined; she may not even know where files live in VS Code.
- **Line 42 — give-up-risk:** "If you named the file something other than `logo.svg`, **open** `components/site-header.tsx` (or wherever the logo is referenced) and update the `src=` path." — `.tsx`, `src=`, "update the path" — total cliff.
- **Line 53 — give-up-risk:** "The four palettes are starting points. To match your church's exact brand colors, edit the CSS variables in `app/globals.css`." — CSS, variables, file path — multiple cliffs.
- **Line 56 — give-up-risk:** "The site uses **semantic color tokens** — names like `primary`, `accent`, and `background` instead of specific hex codes." — "Semantic color tokens," "hex codes" all unknown.
- **Line 60 — give-up-risk:** "The variables are HSL values (Hue, Saturation, Lightness)." — Mathematical color theory.
- **Line 62 — give-up-risk:** "`--primary: 120 14% 32%;`" — CSS syntax that looks like nonsense.
- **Line 69 — jargon-undefined:** "**Hue** (0-360)" — explained but the persona would struggle.
- **Line 78 — assumed-knowledge:** "[hslpicker.com](https://hslpicker.com/) — drag, get HSL." — Too terse.
- **Line 86 — give-up-risk:** Entire CSS code block in `app/globals.css` — Would be completely opaque.
- **Line 128 — assumed-knowledge:** "Don't put hex codes (`#ff0000`) directly into `globals.css`. Stick with HSL triplets" — Now she's expected to know two color systems.
- **Line 141 — give-up-risk:** "Browse [fonts.google.com](https://fonts.google.com/) and pick: One **sans-serif** for body... One **serif** for headings..." — "Sans-serif" and "serif" she may know from Word; OK.
- **Line 150 — give-up-risk:** "Near the top of the file, you'll find the font imports. They look like this: `import { Inter, Fraunces } from 'next/font/google';`" — JavaScript/TypeScript code to be edited — she's deep in code now.
- **Line 187 — give-up-risk:** "`<html lang='en' className={`${inter.variable} ${lora.variable}`}>`" — Backticks, JSX, dollar braces; she'd have no idea what to change.
- **Line 204 — jargon-undefined:** "Convert your logo to an ICO file" — "ICO" undefined.
- **Line 213 — assumed-knowledge:** "Browsers cache favicons aggressively." — "Cache" used as a verb.
- **Line 234 — give-up-risk:** "Use [webaim.org/resources/contrastchecker]... to verify a 4.5:1 contrast ratio." — Technical jargon.

## docs/for-tech-volunteers/06-deploy-to-vercel.md

- **Line 8 — jargon-undefined:** "publish the site to the internet" — fine.
- **Line 11 — jargon-undefined:** "live at a public `*.vercel.app` URL, with automatic re-deploys every time content changes." — `*.vercel.app` syntax and "re-deploys" unfamiliar.
- **Line 20 — jargon-undefined:** "Next.js (the framework this site uses)" — "framework" undefined.
- **Line 22 — assumed-knowledge:** "static church site" — "static" used technically.
- **Line 38 — give-up-risk:** "`npm run deploy`" — terminal again.
- **Line 53 — give-up-risk:** "If you've been editing locally (not in Codespaces), you need to push your changes up to GitHub first." — "push" undefined.
- **Line 59 — give-up-risk:** "`git add .` / `git commit -m 'Initial setup for our church'` / `git push`" — Three terminal commands in a row.
- **Line 66 — assumed-knowledge:** "Enumerating objects: 50, done." — Output is gibberish but used as success indicator.
- **Line 76 — assumed-knowledge:** "the source control panel on the left has the same buttons (Stage → Commit → Push)" — Jargon as labels.
- **Line 86 — missing-context:** "**Authorize** Vercel to access your GitHub repositories when GitHub prompts you." — She'd worry about granting access.
- **Line 104 — assumed-knowledge:** "**Click** **Adjust GitHub App Permissions** at the top of the list." — "App permissions" technical.
- **Line 120 — assumed-knowledge:** Big config list with "Framework Preset," "Build Command: `next build`," "Output Directory," etc. — Reassuring "don't change anything," but list itself is intimidating.
- **Line 152 — assumed-knowledge:** "https://church-site-xyz.vercel.app" — She'd type this literally or worry about the `xyz`.
- **Line 175 — assumed-knowledge:** "**In** your project's dashboard, **click** **Settings** → **Domains**." — Clear once in Vercel UI.
- **Line 197 — give-up-risk:** "Run `git status` — if it lists modified files, run `git add .`, `git commit -m 'Updates'`, `git push`." — Stack of git commands again.
- **Line 200 — jargon-undefined:** "Serverless Function has timed out." — Jargon.

## docs/for-tech-volunteers/07-connect-domain.md

- **Line 12 — jargon-undefined:** "free SSL certificate (the green padlock)" — defined inline by example. (good)
- **Line 20 — give-up-risk:** Glossary block: "Domain," "Registrar," "DNS," "DNS record," "Apex/root domain," "Subdomain," "Propagation" — Seven new terms in a row. The persona explicitly gives up at 2+ unfamiliar terms.
- **Line 22 — jargon-undefined:** "**DNS** — Domain Name System. The internet's phone book." — Analogy helps. (good)
- **Line 23 — jargon-undefined:** "**A records** (for the root domain) and **CNAME records** (for subdomains)" — Defined as terms, but she'd not retain.
- **Line 26 — jargon-undefined:** "Propagation — the time it takes for DNS changes to spread across the internet." — Defined.
- **Line 64 — give-up-risk:** Raw DNS output: `A      @      76.76.21.21` / `CNAME  www    cname.vercel-dns.com` — Strings of arbitrary characters; intimidating.
- **Line 79 — missing-context:** "Vercel's IP address (`76.76.21.21` above) can change. **Always use the value Vercel shows you**, not one from another guide." — Good warning.
- **Line 94 — ambiguous-step:** "Every registrar puts this in a slightly different place." — She'd panic if hers isn't listed.
- **Line 105 — give-up-risk:** "Look for any **existing A records** or **CNAME records** for `@` (root) or `www` and **delete them**." — Delete is scary; she'd worry about breaking email.
- **Line 107 — missing-context:** "If you have email running through this domain, **do not delete any MX records or TXT records**." — Critical warning, but "MX records" and "TXT records" are new terms.
- **Line 117 — assumed-knowledge:** "**TTL** (Time to Live): leave the default, or pick 1 hour." — TTL defined inline. (good)
- **Line 128 — ambiguous-step:** "**Type or paste exactly** — including any trailing dot or no trailing dot, matching what Vercel shows." — Hyper-specific detail she might miss.
- **Line 138 — assumed-knowledge:** "[dnschecker.org]... paste in your domain and pick 'A' record. Green checkmarks across the world map" — Followable; OK.
- **Line 180 — give-up-risk:** "If your domain's DNS is on Cloudflare, the orange-cloud 'proxy' toggle can cause issues with Vercel's SSL." — Cloudflare-specific jargon.
- **Line 186 — jargon-undefined:** "Some registrars let you point the whole domain at Vercel by changing nameservers instead of adding records." — "Nameservers" new term.
- **Line 191 — assumed-knowledge:** "If `yourchurch.org` is currently hosted somewhere else (Wix, Squarespace, WordPress)" — She'd know these names.
- **Line 202 — assumed-knowledge:** "Restore the MX records from your email provider's documentation (Google Workspace, Microsoft 365, etc.)" — She'd be panicked about broken email.

## docs/for-tech-volunteers/08-grant-editor-access.md

- **Line 16 — jargon-undefined:** "30 minutes — most of which is the Decap OAuth setup." — "OAuth" undefined.
- **Line 22 — give-up-risk:** "They need to be a collaborator on the GitHub repository." + "The CMS at `/admin/` needs an OAuth (authentication) proxy so that Decap can talk to GitHub on their behalf without exposing your church's credentials." — Multiple technical concepts at once.
- **Line 31 — give-up-risk:** "Open `public/admin/config.yml` in your code editor." — `.yml` file, code editor.
- **Line 38 — give-up-risk:** YAML block: "`backend: name: github / repo: kbennett2000/church-site-template / branch: main`" — Edit YAML at a specific line.
- **Line 58 — give-up-risk:** "`git add public/admin/config.yml` / `git commit -m 'Point CMS at our GitHub repo'` / `git push`" — Terminal again.
- **Line 70 — give-up-risk:** "`npm run doctor`" — Yet another terminal command.
- **Line 86 — ambiguous-step:** "You may be asked to confirm your GitHub password." — Fine.
- **Line 104 — give-up-risk:** Decap OAuth section — "options ranked by ease," "Cloudflare Workers," "Vercel-hosted serverless function," "Self-hosted OAuth server" — Wall of foreign concepts.
- **Line 119 — give-up-risk:** "**Open** [Decap CMS: External OAuth Clients]... **Follow** the steps in their docs." — Sending her to external docs that will be even more technical.
- **Line 125 — give-up-risk:** "**Register** a new **GitHub OAuth App** at github.com/settings/applications/new" — Technical setup.
- **Line 130 — assumed-knowledge:** "Note down the Client ID and generate a Client Secret — both are shown only on the GitHub OAuth App page. Save them somewhere safe (a password manager works)." — Familiar concept of password manager. (good)
- **Line 132 — jargon-undefined:** "Cloudflare Worker or whatever you picked" — Worker undefined.
- **Line 192 — assumed-knowledge:** ASCII diagram of OAuth flow — Visualization would help her IF she understood the components.
- **Line 213 — jargon-undefined:** "OAuth proxy is misconfigured." — Jargon.

## docs/for-tech-volunteers/09-maintenance.md

- **Line 18 — jargon-undefined:** "Approve pending pull requests" — already familiar by now? Maybe.
- **Line 28 — jargon-undefined:** "Dependabot, if enabled" — undefined.
- **Line 32 — give-up-risk:** "`npm outdated`" / "`npm update`" / "`npm install <package-name>@latest`" — Three terminal commands.
- **Line 50 — give-up-risk:** "`npm run build`" + "`npm run start`" — Terminal.
- **Line 58 — give-up-risk:** "`git add package.json package-lock.json` / `git commit -m 'Update dependencies'` / `git push`" — Git stack.
- **Line 65 — jargon-undefined:** "Major version updates (e.g. `next` going from `15.x` to `16.x`) sometimes have breaking changes." — "Major version," "breaking changes" jargon.
- **Line 88 — assumed-knowledge:** "`npm run doctor`" — Now established but still terminal.
- **Line 111 — jargon-undefined:** "Rotate the OAuth client secret" — undefined.
- **Line 158 — assumed-knowledge:** "GitHub maintains its own backups, and you have a full history of every change." — Reassuring.
- **Line 168 — assumed-knowledge:** "Click the green Code button. Click Download ZIP. This downloads everything — code, content, photos — as a ZIP file." — Followable. (good)
- **Line 187 — give-up-risk:** "Find the commit that deleted the entry (the message will say 'Remove sermons xyz'). Click Revert at the top of the commit page." — Multiple new GitHub UI concepts.
- **Line 213 — give-up-risk:** "**`npm run build` fails after updating.** A package introduced a breaking change. Roll back the change: `git checkout package.json package-lock.json`, then `npm install`." — Total cliff.

## docs/for-tech-volunteers/troubleshooting.md

- **Line 13 — assumed-knowledge:** "Always run `npm run doctor` first." — Terminal-first.
- **Line 27 — give-up-risk:** "Delete the `node_modules/` folder if it exists: `rm -rf node_modules` (Mac/Linux) or delete it via Explorer (Windows). Delete the `package-lock.json` file in the project root. Run `npm cache clean --force`. Re-run `npm install`." — Sequence of destructive-feeling commands.
- **Line 59 — give-up-risk:** "'Permission denied (publickey)' — You're trying to push using SSH, but you haven't set up SSH keys." — SSH, public keys.
- **Line 72 — give-up-risk:** "GitHub stopped accepting passwords in 2021. You need a **Personal Access Token** instead." — Token-based auth setup is detailed.
- **Line 87 — give-up-risk:** "'Failed to push some refs' — Cause: Someone (or something — like an automated bot) pushed to your repo while you weren't looking, so your local copy is behind. Fix: `git pull --rebase` / `git push`. If `git pull --rebase` shows conflicts, resolve them and continue with `git rebase --continue`." — Rebase, conflicts, refs all alien.
- **Line 113 — jargon-undefined:** "ENOENT: no such file or directory" — Raw error code.
- **Line 119 — assumed-knowledge:** "Vercel's build uses Linux, which is case-sensitive. A file named `Sermon.md` is different from `sermon.md`." — Case-sensitivity again.
- **Line 121 — jargon-undefined:** "'Type error: Property X does not exist' — TypeScript type mismatch — usually after you customized code." — TypeScript.
- **Line 134 — give-up-risk:** "Roll back your most recent code change with `git revert HEAD`, then investigate." — Terminal.
- **Line 169 — assumed-knowledge:** "Check the browser console (F12 → Console tab) for error messages." — Developer console is unknown to her.
- **Line 173 — jargon-undefined:** "CORS misconfiguration on the OAuth proxy, or GitHub rate limiting." — CORS, rate limiting.
- **Line 214 — jargon-undefined:** "Vercel may have lost the GitHub webhook." — Webhook undefined.
- **Line 240 — assumed-knowledge:** "Audit `public/images/uploads/` and `public/images/imported/`." — File system paths.

---
