---
type: how-to
audience: tech-volunteer
time: 20 minutes (plus DNS wait time)
---

# Connect a custom domain

**Who this is for:** Tech volunteers ready to point the church's own domain (e.g. `yourchurch.org`) at the Vercel-hosted site.
**What you'll accomplish:** Visitors can type `yourchurch.org` in their browser and see your site, with a free SSL certificate (the green padlock).
**You'll need first:**
- The site already deployed to Vercel. See [Deploy to Vercel](./06-deploy-to-vercel.md).
- The church's domain registered (GoDaddy, Namecheap, Cloudflare, Google Domains, etc.).
- The username and password for the domain registrar's website.

---

## Words you should know

- **Domain** — the address visitors type, like `yourchurch.org`.
- **Registrar** — the company that sold you the domain (GoDaddy, Namecheap, etc.). You log in there to change DNS records.
- **DNS** — Domain Name System. The internet's phone book. It tells browsers "when someone types `yourchurch.org`, send them to Vercel's servers at this IP address."
- **DNS record** — one entry in the DNS phone book. The two you'll use are **A records** (for the root domain) and **CNAME records** (for subdomains like `www`).
- **Apex/root domain** — `yourchurch.org` (no `www.`).
- **Subdomain** — anything before the domain, like `www.yourchurch.org` or `media.yourchurch.org`.
- **Propagation** — the time it takes for DNS changes to spread across the internet. Usually 5-60 minutes; up to 48 hours in extreme cases.

---

## Steps

### 1. Add the domain in Vercel

**Open** your Vercel dashboard.

**Click** your project.

**Click** **Settings** at the top.

**Click** **Domains** in the left sidebar.

You should now see a screen with an empty text field at the top labeled "Domain."

![Vercel domains page](/docs/screenshots/tech-volunteer/connect-domain-vercel-domains.png)

**Type** your domain — `yourchurch.org` (no `https://`, no trailing slash).

**Click** **Add**.

Vercel will ask whether you want to add:
- `yourchurch.org` only
- `www.yourchurch.org` only
- Both (recommended)

**Click** **Add Both** (or pick one if you prefer).

### 2. See the DNS instructions

Vercel now shows you the exact DNS records to add at your registrar.

It will look something like this:

```
yourchurch.org                       Invalid Configuration
  Set the following record on your DNS provider:
  Type   Name   Value
  A      @      76.76.21.21

www.yourchurch.org                   Invalid Configuration
  Set the following record on your DNS provider:
  Type   Name   Value
  CNAME  www    cname.vercel-dns.com
```

![Vercel DNS instructions](/docs/screenshots/tech-volunteer/connect-domain-dns-instructions.png)

**Keep this page open** — you'll copy these values into your registrar in the next step.

> **Important:** Vercel's IP address (`76.76.21.21` above) can change. **Always use the value Vercel shows you**, not one from another guide.

### 3. Log into your domain registrar

**Open** a new tab and **log in** to wherever you bought the domain.

Common registrars:
- [godaddy.com](https://godaddy.com)
- [namecheap.com](https://namecheap.com)
- [cloudflare.com](https://cloudflare.com) (DNS only)
- [domains.google](https://domains.google) (being migrated to Squarespace)
- [name.com](https://name.com)

### 4. Find the DNS settings

Every registrar puts this in a slightly different place. Look for:

- **GoDaddy:** My Products → Domains → DNS (next to your domain).
- **Namecheap:** Domain List → Manage (next to your domain) → Advanced DNS tab.
- **Cloudflare:** Pick your domain from the dashboard → DNS in the left sidebar.
- **Google Domains:** My domains → Manage (next to your domain) → DNS in the left sidebar.

The page you're looking for has a list (often a table) of DNS records.

> ⚠️ **If you can't find a DNS or "Custom Records" section anywhere in your registrar's settings:** some registrars (the cheapest GoDaddy plans, and certain "domain + hosting" bundles from companies like Wix, Squarespace, Bluehost, or 1&1/Ionos) don't expose raw DNS records — they hand you a built-in page builder instead and lock the DNS away. If yours does this, you have two options:
> 1. **Upgrade the plan** to one that includes DNS management (sometimes called "DNS hosting" or "Custom DNS"). This is usually a few dollars a month.
> 2. **Transfer the domain to a registrar that supports custom DNS** — [Cloudflare](https://cloudflare.com/products/registrar/), [Namecheap](https://www.namecheap.com/), [Porkbun](https://porkbun.com/), and [name.com](https://name.com) all do. Transfers take 5–7 days and are free or near-free; you keep the domain.
>
> You cannot use this template's Vercel hosting without DNS control — there's no workaround. Pick option 1 or 2 before continuing.

### 5. Remove any conflicting records

> **Don't panic about email.** Email and websites use completely different DNS record types. Email lives in **MX records** and (sometimes) **TXT records**. Websites live in **A records** and **CNAME records**. We're only touching the website records in this step. Your email will keep working as long as you don't touch the MX or TXT records.

Look for any **existing A records** or **CNAME records** for `@` (root) or `www` and **delete them**. These would conflict with the records Vercel wants.

> **Warning:** If you have email running through this domain, **do not delete any MX records or TXT records**. If you accidentally delete one, your registrar's UI usually lets you undo within a few minutes — but check with your email provider (Google Workspace, Microsoft 365, etc.) for the exact values to restore if you're unsure.

### 6. Add the A record (for the root domain)

**Click** **Add Record** (or **Add** or **New Record** — the button name varies).

Fill in:
- **Type:** `A`
- **Name** (or Host): `@` — this means "the root domain itself." Some registrars want you to leave this blank instead; either works.
- **Value** (or Points to): the IP address Vercel showed you (e.g. `76.76.21.21`).
- **TTL** (Time to Live): leave the default, or pick 1 hour.

**Click** **Save**.

### 7. Add the CNAME record (for www)

**Click** **Add Record** again.

Fill in:
- **Type:** `CNAME`
- **Name** (or Host): `www`
- **Value** (or Points to): the value Vercel showed you (e.g. `cname.vercel-dns.com`). **Type or paste exactly** — including any trailing dot or no trailing dot, matching what Vercel shows.
- **TTL:** leave the default.

**Click** **Save**.

### 8. Wait for DNS to propagate

DNS changes don't take effect instantly. They have to "propagate" across servers around the world. This usually takes:

- **5-15 minutes** in the best case.
- **30-60 minutes** typical.
- **Up to 48 hours** in the worst case (very rare).

> **Tip:** You can check propagation progress at [dnschecker.org](https://dnschecker.org/) — paste in your domain and pick "A" record. Green checkmarks across the world map means propagation is done.

### 9. Verify in Vercel

**Go back** to the Vercel Domains page.

**Click** the **Refresh** button next to your domain.

Within a few minutes, the **Invalid Configuration** label should change to a green **Valid Configuration** label, and Vercel will start issuing a free SSL certificate (the green padlock).

The SSL certificate takes another minute or two to issue.

### 10. Visit your domain

**Open** `https://yourchurch.org` in your browser.

You should now see your church website, with a padlock icon next to the URL meaning the connection is secure.

Also try `https://www.yourchurch.org` — both should show the site (Vercel usually auto-redirects one to the other).

---

## Subdomain only (e.g. `church.yourorg.org`)

If the church doesn't have its own domain — maybe it shares a domain with a parent organization — you can use just a subdomain.

**Repeat** steps 1-9, but in Vercel just add `church.yourorg.org` (the subdomain).

At your registrar, you only need:
- **CNAME** record: `Name: church`, `Value: cname.vercel-dns.com`.

No A record needed for subdomains.

---

## Special cases

### Cloudflare DNS

If your domain's DNS is on Cloudflare, the orange-cloud "proxy" toggle can cause issues with Vercel's SSL.

**Set** both records' proxy status to **DNS only** (grey cloud, not orange).

### Nameservers vs DNS records

Some registrars let you point the whole domain at Vercel by changing nameservers instead of adding records. Vercel offers this in the Domains panel as an alternative.

For most churches, **stick with DNS records** — nameserver delegation is more invasive and harder to undo.

### Existing site you're replacing

If `yourchurch.org` is currently hosted somewhere else (Wix, Squarespace, WordPress), changing the DNS records will swap the site over. There will be a few minutes where some visitors see the old site and some see the new one as DNS propagates. Pick a low-traffic time (early morning Saturday) if you're worried.

---

## Common Mistakes

- **"Invalid Configuration" stays red for hours.** DNS propagation may need more time. Wait 24 hours; if still red, check that you added the records correctly. Make sure A record value matches what Vercel showed you exactly.
- **Site loads but shows a "Your connection is not private" warning.** The SSL certificate hasn't been issued yet. Wait 5-10 more minutes after Vercel shows "Valid Configuration."
- **You see the old site even after DNS propagated.** Browser cache. Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac). Try a different browser or your phone's mobile data.
- **`www.yourchurch.org` works but `yourchurch.org` doesn't (or vice versa).** Missing one of the two records. Add the missing record at your registrar.
- **Email stopped working after the DNS change.** You deleted an MX record by mistake. Restore the MX records from your email provider's documentation (Google Workspace, Microsoft 365, etc.).

---

## What's next?

- [Grant editor access](./08-grant-editor-access.md) — invite the church secretary and set up CMS authentication so editors can log in at `yourchurch.org/admin/`.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- [Vercel's domain docs](https://vercel.com/docs/projects/domains)
- Open an issue: [GitHub Issues](https://github.com/kbennett2000/church-site-template/issues)

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Connect%20Domain).*
