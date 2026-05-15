---
type: how-to
audience: editor
---

# Managing who has admin access

If your church uses **Google sign-in** for the admin pages, this is how
you add or remove people from the list — no developer needed.

> If this section doesn't look familiar in your CMS, your church might
> still be using the older shared-password setup. There's nothing to
> manage in that case — anyone with the password has access. Talk to
> your tech volunteer if you want to switch.

---

## Who needs admin access?

Most people in your church don't. Admin access is for the small group
who do behind-the-scenes work:

- Sending the weekly digest email.
- Reviewing devotional subscribers.
- Running the occasional CSV export.

Regular content edits (sermons, announcements, staff bios, etc.) happen
in the *CMS* — that's a different list, managed at <https://app.tina.io>.
Adding someone to the admin access list does *not* give them content
editing rights, and vice versa.

---

## Adding a new admin

1. Sign in to your CMS at `your-site.com/admin/`.
2. In the left sidebar, click **Admin Access**.
3. Click **+ Add** under the Admins list.
4. Fill in:
   - **Email** — the Google email this person uses to sign in. *This must match exactly what's on their Google account.* If you're not sure, ask them to send it to you from that account.
   - **Role** — leave as "Admin (full access)". This is the only role today.
   - **Added On** — today's date. This is just for your records — the system doesn't enforce it.
   - **Added By (note)** — optional, but useful later: "Pastor invited 2026-05-01 — leads digest" beats trying to remember why someone is on the list two years from now.
5. Click **Save**.

That's it. Behind the scenes, the CMS commits the change to your site's
repository, and the site rebuilds automatically. Within a minute or two
the new admin can visit `/admin/digest` (or any admin page), click
**Sign in with Google**, and they're in.

If they get the "you don't have admin access" page instead, the email
they signed in with doesn't match what you typed. Common causes:

- Typo in the email.
- They signed in with a personal Gmail when the address you added is their work Workspace email (or vice versa).

Have them sign out (the button is on the access-denied page) and try the
right account.

## Common issue: a new admin still can't sign in

If you just added someone and they tell you they still see **Access
Denied** — and you've already confirmed the email matches their Google
account — ask them to **sign out and sign back in**.

The site remembers who's signed in for up to 30 days. If they tried to
sign in *before* you added them to the list, the site is still
remembering that earlier attempt and won't re-check the list until they
start a fresh session. Signing out clears that memory; signing back in
re-checks the list and lets them through.

Their sign-out button is on the access-denied page they're stuck on.
After they sign out and click **Sign in with Google** again, they should
land on the admin page.

## Removing an admin

1. Same page — **Admin Access** in the CMS sidebar.
2. Find their row in the Admins list. Click the three-dot menu on the row → **Delete**.
3. Save.

A few minutes later (after the site rebuilds), they can no longer sign in.

**One caveat:** if they're currently signed in on a device, that session
stays valid until they sign out manually or the session expires (after
30 days). If you need to revoke access *right now* — for example, if a
volunteer left under bad circumstances — ask your tech volunteer to
rotate `NEXTAUTH_SECRET`. That signs everyone out instantly. Use it
sparingly; everyone has to sign in again afterward.

## Viewing who currently has access

Open **Admin Access** in the CMS. Everyone on the Admins list has access.

You may also see a note in your tech volunteer's setup that mentions
`ADMIN_ALLOWLIST`. That's an environment variable used for the initial
bootstrap (when the list was empty). If it's still set, it grants admin
access to whichever emails it lists, in addition to the CMS list. Your
tech volunteer normally removes it after bootstrap.

---

## What if I lock myself out?

Don't worry — this happens to most people once. If you accidentally
remove your own row and save, you can't sign back in to fix it.

Your tech volunteer can rescue you in three steps:

1. Set `ADMIN_ALLOWLIST=your-email@example.com` in the Vercel environment variables.
2. Redeploy.
3. You sign in, add your own row back to the CMS, save, and ask your tech volunteer to remove the env var again.

Avoid this by always making sure at least one other person — preferably
your tech volunteer — is on the list before removing anyone else.

---

## Common questions

**Can I add a non-Google email?** No. The sign-in is specifically through
Google. If someone has, say, a Yahoo email, they can either create a
Google account using that address (it doesn't have to be Gmail —
"add an existing email" works), or use a different Google account.

**Can I limit what an admin can do?** Not yet. Right now anyone with
admin access can use every admin page. The "role" field is in the CMS
already so we can add narrower roles later (e.g. "digest only") without
schema changes, but today every admin is a full admin.

**Will admins get a notification?** No — the system doesn't send "you've
been added" emails. Tell them yourself, and point them at
`yourchurch.org/admin/digest` (or wherever you want them to start).
