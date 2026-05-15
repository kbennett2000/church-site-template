---
type: how-to
---

# Set up online giving

This template supports seven giving configurations out of the box. You configure giving once in the CMS and the entire site — the Give button in the nav, the hero, the footer, and the `/give` page — updates automatically.

> **Before you start:** if you don't have an online giving platform yet, the template defaults to "Offline Only," which shows your mailing address and in-person instructions. You can launch with that and add a platform later.

---

## Step 1: Open the Giving settings in the CMS

1. Go to your site's `/admin` page and sign in.
2. In the left sidebar, click **Giving**.
3. You'll see a form with all giving configuration fields.

---

## Step 2: Choose your provider

Set the **Giving Provider** dropdown to whichever platform you use.

---

## Provider-specific setup

### Planning Center Giving

**What you'll need:** Your Planning Center subdomain.

Your subdomain is the part before `.churchcenter.com` in your giving URL. For example:
- If donors give at `mychurch.churchcenter.com/giving`, your subdomain is `mychurch`.

**Where to find it:** Sign in to [app.planningcenteronline.com](https://app.planningcenteronline.com) → click **Giving** in the top nav → the URL in your browser shows `mychurch.planningcenteronline.com`. The same subdomain applies to Church Center.

**What to fill in:**
- **Provider:** Planning Center Giving
- **How should the Give button open?** Choose "Modal overlay" if you want donors to give without leaving your site (recommended for Planning Center). Choose "New tab" if you prefer the simpler option.
- **Planning Center Subdomain:** Enter just the subdomain, not the full URL. Example: `mychurch` not `https://mychurch.churchcenter.com`.

**Test it:** Click Save, then visit your live site and click the Give button. If you chose modal, a giving overlay should appear. If you chose new tab, churchcenter.com should open.

---

### Tithe.ly

**What you'll need:** Your Tithe.ly Organization ID, or the direct giving link Tithe.ly provided.

**Where to find your Organization ID:** Sign in to [app.tithe.ly](https://app.tithe.ly) → click your organization name in the top right → **Settings** → **Organization**. The ID is a short number displayed near the top.

**Where to find a custom form URL:** Some Tithe.ly plans provide a branded giving page at a custom URL. Check your Tithe.ly admin under **Giving Forms** or ask your Tithe.ly rep.

**What to fill in:**
- **Provider:** Tithe.ly
- **Organization ID:** Your numeric ID (e.g. `12345`)
- **Custom Form URL:** Paste your direct link here if you have one. Leave blank if using the Organization ID.

If both fields are filled, the Custom Form URL takes priority.

**Test it:** Click Save, visit your live site, click the Give button. Tithe.ly's giving form should open.

---

### Pushpay

**What you'll need:** Your Pushpay merchant handle.

Your merchant handle is the part after `pushpay.com/g/` in your giving link. For example:
- If your link is `https://pushpay.com/g/mychurch`, your handle is `mychurch`.

**Where to find it:** Sign in to [pushpay.com](https://pushpay.com) → go to **Settings** → **Giving Links**. The handle appears in the giving URL listed there.

**What to fill in:**
- **Provider:** Pushpay
- **Merchant Handle:** Just the handle, not the full URL. Example: `mychurch`

**Test it:** Click Save, visit your live site, click the Give button. Pushpay's giving page should open.

---

### Subsplash Giving

**What you'll need:** The embed code Subsplash provided.

Subsplash gives each church an embed snippet — a `<script>` tag that renders an iframed giving form directly on your page. Donors give without leaving your site.

**Where to find it:** Sign in to your Subsplash dashboard → **Giving** → look for an "Embed" or "Website Integration" section. Copy the full snippet.

**What to fill in:**
- **Provider:** Subsplash Giving
- **Embed Code:** Paste the full embed snippet here (including the `<script>` tags).

The embed will render on your `/give` page. The Give button in the nav and footer links to `/give` so donors always land on the embedded form.

**Test it:** Click Save, visit `/give` on your live site. The Subsplash giving form should appear embedded on the page.

---

### Stripe Payment Link

**What you'll need:** A Stripe Payment Link URL.

Stripe Payment Links are pre-configured checkout pages hosted by Stripe. They're a good option for churches that want simple, one-time online giving without a separate giving platform subscription.

**Where to create one:** Sign in to [dashboard.stripe.com](https://dashboard.stripe.com) → **Payment Links** → **Create Link**. Set the product as a donation, set the price as "customer chooses," and copy the link (it starts with `https://buy.stripe.com/`).

**What to fill in:**
- **Provider:** Stripe Payment Link
- **Stripe Payment Link URL:** The full URL starting with `https://buy.stripe.com/`

**Test it:** Click Save, visit your live site, click the Give button. Stripe's checkout page should open.

> **Note:** Stripe charges 2.9% + $0.30 per transaction by default. Nonprofits can apply for [Stripe's discounted rate](https://stripe.com/docs/non-us-taxes) — check their website for current eligibility.

---

### Custom URL

Use this option if your giving platform isn't listed above (Vanco, Kindrid, Realm, Church Community Builder, etc.) but gives you a direct link to a hosted giving page.

**What to fill in:**
- **Provider:** Custom URL
- **Giving URL:** The full URL of your donation page.
- **Link Text:** The platform name, shown in the "Powered by" attribution on your /give page. Example: `Vanco`.

**Test it:** Click Save, click the Give button on your live site. Your giving page should open.

---

### Offline Only

Choose this if you don't have online giving. The Give button still appears site-wide, but it leads to `/give` which displays your mailing address and in-person instructions — not a payment form.

**What to fill in:**
- **Provider:** Offline Only (no online giving)
- Under **Offline Giving Options**, fill in your **Mailing Address** and **In-Person Giving Instructions**.

---

## Step 3: Configure offline giving options (optional for online providers)

For any provider, you can also display offline giving methods as supplemental options on the `/give` page. This is useful if you accept checks as well as online payments.

Under **Offline Giving Options**:
- **Show offline giving methods?** — toggle on.
- **Mailing Address** — multi-line. Include the church name and any make-checks-payable-to note.
- **In-Person Giving Instructions** — one or two sentences about where to find the giving box.
- **Text-to-Give** — toggle on and enter your phone number and keyword if your platform supports this.

---

## Step 4: Customize the button label and message

- **Button Label** — the text on the Give button everywhere on the site. Default: `Give`. You can change it to `Donate`, `Give Now`, `Support Us`, etc.
- **Supporting Message** — one sentence shown on the `/give` page below the headline. Tell donors what their gift accomplishes.

---

## Step 5: Update the FAQ

The Giving FAQ section at the bottom of `/give` pulls from the **Giving FAQ** field list. The template ships with four placeholder questions — replace the bracketed placeholder answers before you launch.

Click the FAQ accordion in the CMS to expand each question and fill in your church's real answer.

---

## Step 6: Test your giving link

After saving:

1. Visit your live site (or preview after the Vercel rebuild completes — usually under 2 minutes).
2. Click the Give button in the navigation bar.
3. Confirm the giving form opens correctly.
4. If you configured text-to-give, send a test text.
5. If you configured a mailing address, verify the address shown is correct.

If the button doesn't work as expected, double-check:
- The subdomain/ID/URL you entered has no extra spaces or typos.
- For Planning Center modal, that you also set **How should the Give button open?** to "Modal overlay."
- For Tithe.ly, that you filled in either the Organization ID **or** the Custom Form URL (not both — use one or the other).

---

## Switching providers later

You can switch providers at any time: update the **Provider** dropdown, fill in the new provider's fields, and save. The old provider's fields remain in the CMS but are ignored by the site until you switch back.

For example, switching from Planning Center to Tithe.ly:
1. Change **Provider** to "Tithe.ly."
2. Fill in your Tithe.ly Organization ID.
3. Save.
4. Test the Give button.

The site updates within ~2 minutes of saving (Vercel rebuild).
