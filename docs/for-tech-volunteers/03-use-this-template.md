---
type: how-to
audience: tech-volunteer
time: 10 minutes
---

# Use the template to create your church's repo

**Who this is for:** Tech volunteers ready to make their church's own copy of the template repository.
**What you'll accomplish:** Have your own GitHub copy of the template, open and ready to customize — either in Codespaces (browser) or on your computer.
**You'll need first:**
- A free GitHub account ([github.com/signup](https://github.com/signup)).
- (Path B only) Node.js and Git installed. See [Prerequisites](./02-prerequisites.md).

---

## "Use this template" vs forking — pick the right one

GitHub gives you two ways to copy someone else's repo. They look similar but behave very differently.

| | "Use this template" *(recommended)* | Fork |
|---|---|---|
| Creates an independent repo | ✅ Yes | ❌ No — your fork stays linked to the original |
| History is clean (no upstream commits) | ✅ Yes | ❌ Your fork carries the full upstream history |
| You can later "sync from upstream" | ❌ Not directly (manual cherry-pick) | ✅ Yes, via GitHub's "Sync fork" button |
| You can open pull requests against the template | ❌ Not directly (you'd have to fork separately) | ✅ Yes |
| Best for | Most churches adopting the template for their own site | Developers who plan to contribute back to the template |

**For 99% of churches: use "Use this template."** It gives you a clean, independent codebase that's genuinely yours. The drawback (no automatic sync from upstream) doesn't matter for most adopters — you'll customize the template once and run it for years without needing the latest upstream changes.

If you want to keep your church's site in sync with template improvements over time, see [the developer notes on syncing](../for-developers/contributing.md#keeping-a-church-instance-in-sync-with-the-template). That document describes the manual cherry-pick approach.

---

## Path A (recommended): Use this template

### 1. Sign in to GitHub

**Open** [github.com](https://github.com) in your browser and **sign in** (or create an account).

### 2. Open the template repository

**Open** the template page: [github.com/kbennett2000/church-site-template](https://github.com/kbennett2000/church-site-template).

### 3. Click "Use this template"

Near the top right of the repo, **click** the green **Use this template** button.

A dropdown opens with two options: **Create a new repository** and **Open in a codespace**. **Click** **Create a new repository**.

![GitHub Use-this-template button](/docs/screenshots/tech-volunteer/use-template-button.png)

### 4. Pick the owner and name

A form opens.

- **Owner:** Leave it as your personal GitHub account, or pick a GitHub Organization if the church has one.
- **Repository name:** Something like `church-site`, `our-church-website`, or `firstbaptist-site`. Keep it lowercase, hyphens not spaces.
- **Description (optional):** "Our church website" or similar.
- **Visibility:** **Private** is fine if you want; **Public** is also fine — there's nothing sensitive in here yet. (You can change this later in repo Settings.)
- **Include all branches:** Leave unchecked. You only need `main`.

**Click** the green **Create repository** button.

You should now be looking at your church's own copy of the repository at `https://github.com/your-username/church-site` (or whatever name you picked).

![New repo created from template](/docs/screenshots/tech-volunteer/use-template-created-repo.png)

---

## Now open it — pick a path

### Path A1 (easiest): Open in Codespaces (browser)

Codespaces runs the project in your browser. No install needed.

#### 1. Click the Code button

On your new repository page, **click** the green **Code** button.

A dropdown opens with two tabs: **Local** and **Codespaces**.

#### 2. Switch to the Codespaces tab

**Click** the **Codespaces** tab inside the dropdown.

#### 3. Create a codespace

**Click** the **Create codespace on main** button.

A new browser tab opens with a loading screen. After about 60 seconds, you'll see a full code editor in your browser with a terminal at the bottom.

You should now see a welcome message in the terminal:

```
Welcome! Run npm run setup on first use, or npm run start to see the site.
```

If the welcome message doesn't show, **click** in the terminal area at the bottom of the screen.

You're done with this doc. Go to [First-time setup](./04-first-time-setup.md).

> **Tip:** When you close the browser tab, the codespace pauses (but isn't deleted). Come back anytime by going to your repository page → **Code** → **Codespaces** → click the existing codespace name. Codespaces auto-delete after 30 days of inactivity, but you can keep them indefinitely by visiting them periodically.

---

### Path A2: Clone to your computer

Use this path if you've installed Node.js and Git locally.

#### 1. Copy the clone URL

On your repository page, **click** the green **Code** button, **stay** on the **Local** tab, and **click** the small **copy** icon next to the HTTPS URL. The URL looks like `https://github.com/your-username/church-site.git`.

#### 2. Open a terminal

- **Windows:** Press the Windows key, type `cmd`, press Enter. (Or use PowerShell or Windows Terminal — any will work.)
- **Mac:** Press Cmd+Space, type `Terminal`, press Enter.
- **Linux:** Open your terminal app.

#### 3. Navigate to where you want the project

By default, your terminal starts in your home folder. To put the project on your desktop:

```
cd Desktop
```

(Or pick any folder — `Documents`, `Projects`, wherever you keep code.)

#### 4. Clone the repository

**Type** this command, replacing the URL with the one you copied:

```
git clone https://github.com/your-username/church-site.git
```

**Press** Enter. You should see output like:

```
Cloning into 'church-site'...
remote: Enumerating objects: 1234, done.
...
Receiving objects: 100% (1234/1234), 5.6 MiB | 4.2 MiB/s, done.
```

When it finishes, a new folder named `church-site` (or whatever you called it) appears in the location you `cd`'d into.

#### 5. Enter the project folder

```
cd church-site
```

You're now inside the project. Every command in the rest of these docs assumes you're in this folder.

#### 6. (Optional) Open in VS Code

If you installed VS Code:

```
code .
```

The `.` means "open the current folder." VS Code launches with the project ready to edit.

---

## Path B (advanced users only): Fork instead

Only use forking if you specifically want to:
- Stay in sync with template updates over time (using GitHub's "Sync fork" button).
- Contribute pull requests back to the template.

Most churches won't need this. If you're not sure, **use "Use this template" above** — you can always change later.

To fork:

1. **Open** [github.com/kbennett2000/church-site-template](https://github.com/kbennett2000/church-site-template).
2. **Click** the **Fork** button at the top right.
3. Choose owner and name as above.
4. **Click** **Create fork**.

Then either open in Codespaces or clone locally (same steps as Path A1/A2 above, just starting from your fork's page).

---

## Common Mistakes

- **The "Use this template" button isn't visible.** You're probably not signed in to GitHub. **Sign in** at the top right. Also: the template repo must be configured as a template by the owner — if the button is missing, the template owner hasn't enabled it.
- **Codespaces says "you've used all your hours."** Check your usage at [github.com/settings/billing](https://github.com/settings/billing). Codespaces gives 60 hours/month free — if you've blown through it, you can either wait until the next month or pay for more.
- **`git clone` says "Permission denied (publickey)."** You copied an SSH URL instead of HTTPS. Go back to GitHub, click **Code**, make sure the dropdown is set to **HTTPS**, copy that URL.
- **`git clone` worked, but `cd church-site` says "No such file or directory."** Either the clone didn't finish (scroll up in the terminal to see if there were errors), or you're typing the folder name with the wrong case. **Type** `ls` to see what's actually there.

---

## What's next?

- [First-time setup](./04-first-time-setup.md) — run `npm run setup` to configure the site.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new).*
