---
type: explanation
---

# Admin access — follow-up items

Issues identified but deferred for a later decision. Don't act on these without confirmation.

> **Note:** the stale-JWT gotcha below is now surfaced in user-facing docs as well —
> [`managing-admin-access.md`](../for-editors/managing-admin-access.md#common-issue-a-new-admin-still-cant-sign-in)
> for editors and
> [`admin-access-google-oauth.md`](../for-tech-volunteers/admin-access-google-oauth.md#known-limitation-stale-jwt-after-allowlist-change)
> for tech volunteers. This file remains the canonical place for the technical
> root-cause analysis and the fix-options discussion.

## Stale JWT after allowlist change

**Symptom (user-facing):** A user is added to the admin allowlist (either in
`/content/admin-access.json` via the CMS, or in `ADMIN_ALLOWLIST`) but still
gets redirected to `/admin/access-denied`. They report "I was added to the
list but I still can't get in."

**Root cause:** [auth.ts](../../auth.ts) `jwt` callback only re-evaluates
`isAdmin` on first sign-in (when `user` is defined) or when the token has
no prior `isAdmin` value. On every subsequent request the callback is a
passthrough — the existing `isAdmin: false` rides along until the JWT
expires.

JWT lifetime is currently 30 days
([auth.ts session.maxAge](../../auth.ts)). So a user who tried to sign in
**before** being added to the allowlist is locked out for up to 30 days
unless they manually sign out and sign back in.

**Workaround for now:** Sign out (clear the cookie) and sign in again. A
fresh sign-in passes through the `user?.email` branch and re-evaluates
the allowlist.

**Options for a real fix:**

a) **Re-evaluate `isAdmin` on every JWT callback.** Cheap — `isEmailAdmin`
   reads a bundled JSON file and one env var, no I/O. Adds negligible
   latency per protected request. Removes the bootstrap-order trap
   entirely.

b) **Update [`/admin/access-denied`](../../app/admin/access-denied)** to
   explicitly say: *"If you were just added to the admin list, sign out
   and sign back in for the change to take effect."* Plus a sign-out
   button on that page if there isn't one already.

c) **Both.** (a) eliminates the failure mode; (b) helps anyone who hits
   it during the rollout window before (a) ships, and is also useful if
   we ever decide we *want* JWT caching for some other reason.

**Recommendation when revisiting:** (c) — the cost of (a) is essentially
zero and the cost of (b) is one paragraph of copy. Doing both means
nobody is locked out, and the doc copy is also useful guidance for
sysadmins reading the access-denied page over a user's shoulder.

**Discovered:** 2026-05-15, during the Google-sign-in bootstrap diagnosis
that traced an "access denied despite correct env var" report to a stale
JWT from a pre-env-var sign-in attempt.
