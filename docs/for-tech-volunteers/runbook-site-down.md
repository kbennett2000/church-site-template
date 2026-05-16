---
type: how-to
audience: tech-volunteer
---

# Runbook — site is down

**When to open this:** the website is showing one of:

- A blank page where the homepage should be.
- A generic Vercel error page.
- "404 Not Found" on the homepage (not a missing inner page).
- A domain that doesn't resolve at all.
- A "500 Internal Server Error" page.

Or someone at church told you "the website is broken" and you need to figure out fast whether they're right.

---

## Before you panic

Most "the site is down" reports are *one user's* problem — a stale cache, a typo in the URL, an in-progress browser update — not an outage.

1. **Ask the reporter what URL they tried.** A typo'd `youchurch.org` (missing the `r`) doesn't resolve and looks just like an outage.
2. **Ask them to try in an incognito/private window.** This rules out a cached old version.
3. **Open the site yourself on cellular data** (not your office WiFi). If it loads on your phone, the public site is fine; the problem is on the reporter's end.

If multiple unrelated people are reporting, or you can't reach the site from cellular either, continue with the checks below.

---

## The fastest fix is rollback

At any point in this runbook, the quickest path back to a working site is:

1. **Open** Vercel → your project → **Deployments**.
2. **Find** the most recent deployment marked **Ready** with a green checkmark — the one from *before* things broke.
3. **Click** the **⋯** menu next to it.
4. **Click** **Promote to Production**.

That deployment becomes the live site within seconds. The broken state is no longer in front of visitors. **Then** you can investigate without time pressure.

Use the checks below to find the *cause*. Use rollback when you need the *site back* immediately.

---

## Check 1 — Is Vercel itself having an outage?

**Open** [status.vercel.com](https://status.vercel.com).

- **Anything red or yellow related to Deployments, Domains, or Edge Network?** → That's the cause. Vercel will resolve it; nothing for you to do but wait. Check back in 10 minutes.
- **All green?** → Continue to Check 2.

---

## Check 2 — Is the latest deployment healthy?

**Open** Vercel → your project → **Deployments**.

Look at the most recent deployment at the top of the list.

- **Status is "Ready" (green)** → deployment is healthy; the cause is elsewhere. Continue to Check 3.
- **Status is "Error" or "Failed" (red)** → this is your problem. Read on.

### A failed deployment is live? Read this.

If the latest build failed, Vercel keeps the previous successful deployment live by default — so a build failure doesn't always cause an outage. But if the failure was during a rollback, an env-var change, or a content edit that broke build, the site may be serving an older state than expected, or no state at all.

Diagnose the failure:

1. **Click** into the failed deployment.
2. **Scroll** to the build logs.
3. **Look** at the *last* error message printed (not the first — the last is the one that actually stopped the build).

Common causes:

| What the logs say | Likely cause | Fix |
|---|---|---|
| `Module not found: '...'` | Recent code edit referenced something that doesn't exist. | Revert the commit, or fix the import. |
| `process.env.X is not defined` (during build) | An env var was deleted or renamed in Vercel. | Restore it: Settings → Environment Variables. |
| `Failed to compile` with a TypeScript error | Recent code change has a type error. | Revert the commit, or fix the type. |
| `npm install` errors / `EACCES` | A dependency upgrade went sideways. | Roll back `package.json`/`package-lock.json` to the previous version, redeploy. |

**While you investigate:** use the rollback procedure above to restore service. Nothing in your investigation requires the broken deployment to stay live.

---

## Check 3 — Is the domain resolving?

If Vercel is healthy and the latest deploy succeeded, the next suspect is DNS.

**Open** a terminal and run:

```
nslookup yourdomain.com
```

- **You see one or more IP addresses listed** → DNS is fine. Continue to Check 4.
- **You see "no answer," "NXDOMAIN," or "can't find"** → DNS is broken.

Common causes of broken DNS:

| Symptom | Likely cause | Fix |
|---|---|---|
| `NXDOMAIN` and your registrar dashboard says expired | Domain registration lapsed. | Renew immediately at the registrar (most allow renewal during a grace period of 30+ days after expiry). |
| Used to work, now `NXDOMAIN` after recent DNS changes | A DNS record was edited or deleted. | Compare against the values in [07-connect-domain.md](./07-connect-domain.md) — the A record for `@` and CNAME for `www` must match what Vercel told you to set. |
| Domain points to a different IP than Vercel's | An old A record from a previous host. | Replace it with the Vercel-provided A record. |

After fixing DNS, propagation usually takes 5–60 minutes. Check progress at [dnschecker.org](https://dnschecker.org/).

---

## Check 4 — What is the site actually returning?

If Vercel is healthy, the deploy is green, and DNS resolves — but the site still looks broken — find out what the server is actually sending back.

1. **Open** the site in your browser.
2. **Press** F12 to open DevTools.
3. **Click** the **Network** tab.
4. **Reload** the page (Ctrl+R or Cmd+R).
5. **Click** the first request in the list (your domain itself).
6. **Look** at the **Status** column or the response details.

Interpret the status code:

| Status | What it means | Next step |
|---|---|---|
| `200` with no visible content | Page loaded but front-end didn't render. | Continue to Check 5. |
| `401` or `403` | Auth is blocking the request. Check 6 applies. | Continue to Check 6. |
| `500` | Server-side error during page render. | Open Vercel → Deployments → latest → **Runtime Logs** tab. Find the matching log line near the time of your reload. The stack trace tells you which page/component failed. |
| `502` / `503` / `504` | Vercel can't reach your function, or it timed out. | Usually a Vercel hiccup — retry in 30 seconds. If persistent, check Vercel status again and check runtime logs. |
| Anything else | Copy the status code and search Vercel runtime logs for it. | Logs are at: Deployments → latest → Runtime Logs. |

---

## Check 5 — Is the homepage rendering content?

If the response was `200` but the page looks blank:

1. **Right-click** the page → **View Page Source** (or Ctrl+U).
2. **Look** at the HTML.

- **HTML is present but page is blank in browser** → front-end issue. Open DevTools → **Console** tab and look for JavaScript errors (red messages). A failed CSS or JS bundle can cause this.
- **HTML is empty or just a shell** → server-side rendering produced nothing. Check Vercel **Runtime Logs** for errors around the time of the request.

A failed JS bundle is often caused by a content reference to a deleted file — e.g., a sermon entry referencing a missing image. Check the most recent CMS commits in GitHub for anything suspicious.

---

## Check 6 — Is `/admin/` the only thing broken?

If the public homepage works but `/admin/` returns 401, 403, or a redirect loop:

- **TinaCloud admin** (`/admin/` for editors): see the Troubleshooting section in [06a-setup-tinacloud.md](./06a-setup-tinacloud.md).
- **Custom admin pages** (`/admin/devotionals`, `/admin/digest`): see the Troubleshooting section in [admin-access-google-oauth.md](./admin-access-google-oauth.md) (Google auth) or [admin-access-basic-auth.md](./admin-access-basic-auth.md) (basic auth).

A broken admin doesn't affect public visitors — handle it without panic.

---

## Still stuck?

Capture before you ask for help:

1. **Screenshot** of what visitors see (the broken page).
2. **Vercel deployment URL** of the most recent successful deploy, and of any failed deploy.
3. **Runtime log excerpt** — find the most recent error in Vercel's Runtime Logs and copy the stack trace.
4. **Browser console output** (DevTools → Console) if there are errors there.

Then:

- Open an issue at [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues) with the four items above.
- If your church has a Slack or other channel where the previous tech volunteer hangs out, post there too.

Most outages have a single small cause. The four items above are usually enough for someone to diagnose remotely.

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Runbook%20Site%20Down).*
