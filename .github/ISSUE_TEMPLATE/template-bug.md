---
name: Bug in the template
about: Something in the template itself is broken — not a problem specific to one church's instance
title: 'Bug: '
labels: 'bug'
assignees: ''
---

> Use this for bugs in the template itself — issues that would affect every church adopting the template, not just yours.
>
> **Bug only in your own church's repo?** Open the issue in your own repo, not here. Common signs it's instance-specific:
> - Caused by edits to your `content/`, `app/globals.css`, or `lib/church-info.ts`.
> - Started after you customized branding or content.
> - Doesn't reproduce on a fresh "Use this template" → `npm install` → `npm run setup`.

**What's broken?**

One or two sentences describing the bug.

**Steps to reproduce**

What does someone need to do to see this bug? Be specific — the more reliably we can reproduce it, the faster it can be fixed.

1. ...
2. ...
3. ...

**Expected behavior**

What should happen instead?

**Actual behavior**

What actually happens? Include the error message or unexpected output.

**Screenshots or terminal output**

(If applicable. Long terminal output can go in a [GitHub Gist](https://gist.github.com/) — paste the link here.)

**Environment**

- Template version (commit SHA or release tag): <!-- run `git log -1 --format=%H` -->
- Node.js version: <!-- run `node -v` -->
- npm version: <!-- run `npm -v` -->
- Operating system: <!-- macOS 14.5 / Windows 11 / Ubuntu 22.04 / etc. -->
- Browser (if a frontend bug): <!-- e.g. Chrome 124, Safari 17 -->

**Does it reproduce on a fresh clone?**

If you have time, try this:

1. Click "Use this template" to create a fresh, unmodified copy.
2. Run `npm install` and `npm run setup` (accept defaults).
3. Try to reproduce the bug there.

If the bug doesn't appear on a fresh clone, it's likely caused by something you changed in your church's instance — try the diagnostic above before filing here.

**Anything else?**

(Optional. Workarounds you've tried, related issues, etc.)
