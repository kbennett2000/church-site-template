---
type: reference
audience: tech-volunteer
length: 4 minutes
companion: /docs/for-tech-volunteers/04-first-time-setup.md
---

# Video: First-time setup (using Codespaces)

**Length:** 4 minutes
**Audience:** Tech volunteer setting up the site for the first time, using GitHub Codespaces (no local install required).
**Companion guide:** [04 First-time setup](../for-tech-volunteers/04-first-time-setup.md)

## Open with (20 sec)
**Say:** "Hi — this video walks you through setting up your church's website. No software to install. We'll do everything in your web browser using GitHub Codespaces. Total time: about 5 minutes after the video. You'll need a GitHub account ready."

## Steps (3 min)

### 1. Use the template (30 sec)
[Open the template repo on GitHub.]
[Click the green **Use this template** button at the top right.]
[Click **Create a new repository** in the dropdown.]
[Pick a name like `our-church-site`, leave the rest as defaults.]
[Click **Create repository**.]

**Say:** "Clicking 'Use this template' copies the template into your own GitHub account so you can customize it without affecting anyone else."

### 2. Open in Codespaces (40 sec)
[Click the green **Code** button.]
[Click the **Codespaces** tab.]
[Click **Create codespace on main**.]
[Wait while it sets up — ~60 seconds.]

**Say:** "Click Code, then Codespaces, then Create codespace on main. This spins up a development environment in your browser. Wait about a minute while it gets ready."

### 3. Run the setup script (1 min 50 sec)
[In the terminal at the bottom of the Codespace, type: `npm run setup`]

**Say:** "Once the environment is ready, type `npm run setup` in the terminal at the bottom and press Enter."

[The script runs. It checks Node.js — green checkmark.]
[The script asks for the church name.]

**Say:** "It checks Node.js — you'll see a green checkmark — then asks for your church's information. Type each answer and press Enter."

[Fill in: church name, short name, address, city, state, ZIP, phone, email, service time.]

**Say:** "Church name, short name, address, phone, email, service time. Press Enter to keep any default in brackets."

[On the color palette screen, four palettes show with colored swatches.]

**Say:** "Pick a color palette by typing 1, 2, 3, or 4. You can change this later."

[Type a number, press Enter.]
[Script writes files, shows the 'All set' message.]

**Say:** "When you see 'All set,' your church's information is saved and the colors are applied."

## Wrap (40 sec)
**Say:** "From here, you can run `npm run start` to preview your site, or jump to the deploy guide to put it on the internet. There's a written guide linked below with screenshots. If anything went wrong, run `npm run doctor` for a diagnostic."

## Captions
- 0:00 — Title: "Setting up your church website — Codespaces method"
- 0:20 — Caption: "You'll need: a GitHub account"
- 0:50 — Highlight the green Code button
- 1:30 — Caption: "Wait ~60 seconds for environment to set up"
- 2:00 — On-screen: `npm run setup`
- 2:30 — Caption: "Press Enter to keep [bracketed] defaults"
- 3:20 — On-screen: `npm run start` and `npm run doctor`
- 3:50 — End card: "Next: Deploy to Vercel"

## Things to watch out for
- Codespaces UI changes occasionally — re-record if the green "Code" button moves or the menu structure shifts.
- Use a fresh account / clean fork for filming so viewers see the same screens.
