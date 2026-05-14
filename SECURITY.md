# Security Policy

Thank you for helping keep churches' websites safe.

## Supported versions

This is an actively maintained open-source template. Security fixes are released for the latest `main` branch. We don't backport fixes to older tags.

## Reporting a vulnerability

**Do not open a public GitHub issue for a security vulnerability.** A public report gives bad actors time to exploit it before churches have a chance to update.

Instead, report privately using one of these:

1. **GitHub Security Advisory (preferred):** click [**Report a vulnerability**](https://github.com/kbennett2000/church-site-template/security/advisories/new) on the project's Security tab. GitHub handles the disclosure dance.
2. **Email:** send details to `security@your-domain.example` (replace once project email exists).

### What to include

- A clear description of the vulnerability.
- Steps to reproduce (or proof-of-concept).
- The impact: what an attacker could do.
- Your affiliation, if you'd like credit.

### What to expect

- **Acknowledgment within 72 hours** that we received your report.
- **A first-pass assessment within 7 days** (is it valid, severity, scope).
- **A fix or mitigation timeline** within 14 days, depending on severity.
- **Credit in the release notes**, if you'd like it (or anonymous if you prefer).

## Scope

This project is in scope:
- The template code (`/app`, `/components`, `/lib`, `/content`, `/scripts`).
- The default `public/admin/config.yml` configuration.
- Setup, deploy, and doctor scripts.
- Documentation that, if misleading, could cause unsafe deployments.

Out of scope (report to the upstream project):
- Next.js, React, Tailwind, TinaCMS, Vercel, GitHub — upstream security teams handle their own.
- A church's own modifications to a fork.
- Vulnerabilities in third-party services (Vercel, Pushpay, etc.).

## Non-vulnerability issues

If you found a **bug** (not a security risk), open a normal [bug report](https://github.com/kbennett2000/church-site-template/issues/new?template=bug-report.yml).

If a documentation gap could lead a church to deploy something unsafe (e.g. exposing PII in a form, missing CSRF, etc.), that *is* a security issue — please report privately.
