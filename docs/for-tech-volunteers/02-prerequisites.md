---
type: reference
audience: tech-volunteer
time: 15 minutes
---

# Prerequisites

**Who this is for:** Tech volunteers about to set up the template for the first time.
**What you'll accomplish:** Have everything installed (or pick the no-install Codespaces path) so you can start setup.
**You'll need first:**
- An internet connection.
- About 1 GB of free disk space (if you choose the install path).

---

## Two paths — pick one

> **Important — read this before choosing.** Path A (Codespaces) means clicking buttons in a web browser. Path B (local install) means downloading two installers, then typing a few commands into a black terminal window. If you've never typed in a terminal before, **choose Path A**. You can always switch later.

### Path A (recommended): GitHub Codespaces — no install

If you'd rather not install software on your computer, **use Codespaces**. It runs the whole development environment in your browser.

**Pros:**
- Zero install. Works from any computer with a browser.
- The same setup every time (no "works on my machine" issues).
- Free for 60 hours per month.

**Cons:**
- Requires an internet connection.
- Slightly slower than running locally.

> **About the 60-hour quota:** Codespaces counts time only while a codespace is actively running (terminal open, editor in foreground). Casual content updates use **less than 5 hours per month** — you won't hit the limit unless you're doing serious development. If you do approach it, stopping the codespace when you're done (rather than just closing the browser tab) and deleting old codespaces clears most of it.

**Skip the rest of this page and go to [Use this template](./03-use-this-template.md).** Codespaces gives you Node.js and Git built in.

### Path B: Install Node.js and Git on your computer

> **Heads up — terminal required.** This path requires opening a terminal (a text window where you type commands) and running a couple of installation steps. If that sounds intimidating, go back and pick Path A — Codespaces is genuinely the easier option for most volunteers.

If you'd rather run everything locally, install the two tools below.

---

## Install Node.js

Node.js is the engine that runs the setup script and builds the website. You need version 18 or newer.

### Steps for Windows or Mac

1. **Open** [https://nodejs.org/en/download](https://nodejs.org/en/download) in your browser.

2. **Click** the big green **LTS** button on the homepage. ("LTS" means "Long-Term Support" — the stable version.)

   ![Node.js download page](/docs/screenshots/tech-volunteer/prerequisites-nodejs-download.png)

3. **Save** the installer file to your Downloads folder.

4. **Open** the installer.

5. **Click** **Next** through each screen, accepting the defaults.

6. **Click** **Install**. You may need to enter your computer's password.

7. **Click** **Finish** when done.

   You should now see Node.js installed in your Start menu (Windows) or Applications (Mac), but you won't use it through a graphical app — you'll use it through the terminal.

### Verify Node.js is installed

**Open** a terminal:
- **Windows:** Press the Windows key, type `cmd`, and press Enter. A black window opens.
- **Mac:** Press Cmd+Space, type `Terminal`, and press Enter. A white window opens.

**Type** this command and press Enter:

```
node --version
```

You should now see something like `v20.10.0` printed on the next line. If the version starts with `v18`, `v20`, `v22`, or higher, you're good.

If you see "command not found" or "is not recognized," Node.js didn't install correctly. Try the installer again, or see [troubleshooting](./troubleshooting.md).

---

## Install Git

Git is the tool that downloads the template code and uploads your changes to GitHub.

### Steps for Windows

1. **Open** [https://git-scm.com/download/win](https://git-scm.com/download/win).

2. **Click** **64-bit Git for Windows Setup** (the most common option).

   ![Git for Windows download](/docs/screenshots/tech-volunteer/prerequisites-git-windows-download.png)

3. **Open** the downloaded installer.

4. **Click** **Next** on each screen — every default is fine. The installer asks a lot of questions about line endings and editors; **accept every default**.

5. **Click** **Install** at the end.

6. **Click** **Finish**.

### Steps for Mac

1. **Open** a terminal (Cmd+Space, type `Terminal`, press Enter).

2. **Type** this command and press Enter:

   ```
   git --version
   ```

3. If Git is already installed, you'll see a version like `git version 2.43.0` and you're done.

   If it's not installed, macOS will pop up a dialog offering to install the **Command Line Developer Tools**. **Click** **Install**. It takes 5-10 minutes.

4. Once installed, re-run `git --version` to verify.

### Steps for Linux

Use your package manager:

```
# Ubuntu / Debian
sudo apt install git

# Fedora
sudo dnf install git
```

### Verify Git is installed

In your terminal:

```
git --version
```

You should now see something like `git version 2.43.0`.

---

## Configure Git (one-time)

Tell Git who you are. In your terminal:

```
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Use the same email as your GitHub account.

You won't see any output. That's normal — Git silently saved the settings.

---

## (Optional) Install a code editor

You can edit text files in any program, but a code editor makes it easier. Recommended:

- **Visual Studio Code** (free): [code.visualstudio.com](https://code.visualstudio.com/)

Install with the defaults.

---

## Common Mistakes

- **`node --version` says "command not found" after install.** Close your terminal window and open a new one — the new terminal picks up the updated PATH.
- **Mac terminal asks for an "Xcode license."** Type `sudo xcodebuild -license` and follow the prompts. This happens once after installing the developer tools.
- **Git installer asked about line endings — I just clicked Next.** That's fine. The default ("Checkout Windows-style, commit Unix-style") works for this project.

---

## What's next?

- [Use this template](./03-use-this-template.md) — make your church's own copy of the template.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common install problems.
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Prerequisites).*
