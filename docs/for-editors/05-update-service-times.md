---
type: how-to
audience: editor
time: 3 minutes
---

# Update service times (and other church-wide info)

**Who this is for:** Whoever needs to change the Sunday service time, the church address, the phone number, or any other piece of information that appears in many places on the site.
**What you'll accomplish:** Change one setting in one place, and watch it update everywhere on the site automatically.
**You'll need first:**
- Logged in to the editor at `/admin/`. See [Getting started](./01-getting-started.md).
- The new value (the new service time, new phone number, etc.).

## Why this is a one-stop edit

The service time appears in at least five places on the website: the homepage hero, the footer, the "Plan a Visit" page, the Contact page, and the calendar. Same with the phone number, address, and social links.

You only edit it once — in **Site Settings** — and every page updates automatically.

## Steps

### 1. Open Site Settings

**Click** **Site Settings** in the left sidebar.

You should now see a list with one entry: **Church Info & Site Copy**.

![Site Settings list](/docs/screenshots/editor/update-service-times-list.png)

### 2. Click Church Info & Site Copy

**Click** the row.

You should now see a long form grouped into sections: Church Information, Address, Sunday Service, Office Hours, Social Media, Homepage Copy, About Page Copy.

### 3. Find the section you want to change

Scroll through the form to find the right section.

For service times, **scroll** to the **Sunday Service** section.

For the phone number, address, or email, **scroll** to the **Church Information** section.

For Facebook or YouTube links, **scroll** to **Social Media**.

![Sunday Service section](/docs/screenshots/editor/update-service-times-section.png)

### 4. Update the service time

In the **Sunday Service** section:

**Click** the **Service Start Time** field.

**Type** the new time. Use the format `9:00 AM` or `10:30 AM` — include the space before AM/PM and use capital letters.

If the day changed too (rare), **edit** the **Day** field. Use `Sunday`, not `Sundays`.

If the after-service activity changed, **edit** the **After-Service Note**. Example: `Fellowship & coffee after the service.`

### 5. (Or) update any other field

Same pattern for any field on the form:

- **Phone Number** — use the format `555-123-4567` (hyphens, no parentheses).
- **Church Email** — the general office inbox.
- **Office Hours** — for example `Mon-Thu` or `Tue-Fri, 9 AM - 3 PM`.
- **Address** — street, city, state (two letters), ZIP code.
- **Social Media** — paste the full URL (for example, `https://facebook.com/yourchurch`).

### 6. Save

**Click** the **Save** button at the top.

TinaCMS commits (saves a snapshot of) the change directly to the site. Within 2-3 minutes, every page that shows that information will update automatically.

## What about the homepage headline?

Scroll down to the **Homepage Copy** section. The **Headline** field is the big sentence that appears over the church photo on the home page. Edit it the same way.

The **About Page Copy** section has a separate headline for the About page.

## Common Mistakes

- **Service time looks weird on the published page (`9:00am` instead of `9:00 AM`).** Use the format `9:00 AM` — include the space before AM/PM, and capitalize the letters.
- **Phone number doesn't work as a click-to-call link on phones.** Use straight hyphens (`555-123-4567`), not parentheses or periods.
- **You changed the time but the homepage still says the old time.** The site may still be rebuilding — wait 2-3 minutes. Or your browser cached the old version. Refresh with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).

## What's next?

- [Add an event](./06-add-an-event.md) — for one-off or recurring events on the calendar.
- [Publishing changes](./08-publishing-changes.md) — what happens between **Publish** and the change being live.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Update%20Service%20Times).*
