---
title: "Subscriber Tags"
type: reference
---

# Subscriber Tags

This document explains the tag-based subscriber model introduced alongside the weekly digest feature, and how to use it when adding new email types.

---

## Background

Before this model, every subscriber in the database was implicitly a "devotional subscriber." The schema had no concept of what someone subscribed *to* — if you were in the table with `status='active'`, you got devotional emails.

That worked fine with one email type. It breaks as soon as you add a second: a subscriber who wants only the weekly digest would still receive devotionals, and a subscriber who wants both would need two separate rows.

The tags column solves this by making subscriptions explicit.

---

## How tags work

Every subscriber row now has a `tags` column (`text[]`, default `'{}'`).

Values currently in use:

| Tag | Meaning |
|---|---|
| `"devotionals"` | Subscriber wants the daily devotional emails |
| `"digest"` | Subscriber wants the weekly church digest |

A subscriber can have zero, one, or both tags. The send jobs filter on tags — the devotional cron only sends to subscribers with `'devotionals' = ANY(tags)`, the digest cron only sends to subscribers with `'digest' = ANY(tags)`.

---

## Migration and backfill

The `tags` column was added in migration `0001_cool_paper_doll.sql`. That migration also backfills all existing active and pending-verification subscribers with `tags = ARRAY['devotionals']`, since they all subscribed when devotionals was the only option.

New subscribers set `tags` explicitly at subscribe time. The `/api/devotionals/subscribe` route accepts a `tags` field in the request body.

---

## Queries

### Check for devotionals subscribers

```ts
import { getActiveSubscribersWithPlans } from "@/lib/db/queries";
// Returns active subscribers with the "devotionals" tag + their plan enrollments.
const subscribers = await getActiveSubscribersWithPlans();
```

### Check for digest subscribers

```ts
import { findActiveSubscribersForDigest } from "@/lib/db/queries";
const subscribers = await findActiveSubscribersForDigest();
```

### Add a tag to a subscriber

```ts
import { addTagToSubscriber } from "@/lib/db/queries";
await addTagToSubscriber(subscriberId, "digest");
```

The function is idempotent — it uses `array_append` with a `NOT (tag = ANY(tags))` guard, so adding a tag a subscriber already has is a no-op.

### Remove a tag from a subscriber

```ts
import { removeTagFromSubscriber } from "@/lib/db/queries";
await removeTagFromSubscriber(subscriberId, "digest");
```

---

## Why tags over separate tables

The main alternatives considered:

**Separate `subscriber_tags` join table** — More relational, easier to query with JOINs, but adds another table to migrate and another round-trip for most queries. Overkill for a handful of string values that change infrequently.

**Separate subscriber tables per email type** — Simplest model per type, but would mean the same email address can appear in multiple tables. Unsubscribing from one wouldn't affect the other. Managing "unsubscribe from everything" links becomes complex.

**`jsonb` column** — More flexible than `text[]` (can store metadata per tag) but harder to query and more opaque to Drizzle Studio's table view. Unnecessary for now.

**Text array** — Clean, native Postgres, easy to query with `ANY()`, visible in Drizzle Studio as a readable list. The right default for a small fixed set of string tags.

---

## Adding a new email type

To add a new email type (e.g., `"events"` for a weekly events digest):

1. **Choose a tag name.** Lowercase, no spaces. Example: `"events"`.

2. **Add the subscribe flow.** In the subscribe form/page for this new type, pass `tags: ["events"]` to `/api/devotionals/subscribe`. The route handles any tag set. No new subscribe route needed.

3. **Update the preferences page.** In `app/preferences/page.tsx`, add an entry to the `SUBSCRIPTION_TYPES` array:
   ```ts
   { tag: "events", label: "Weekly Events", description: "..." }
   ```

4. **Add a send query.** In `lib/db/queries.ts`, add:
   ```ts
   export async function findActiveSubscribersForEvents() {
     return db.select(...).from(subscribers).where(
       and(
         eq(subscribers.status, "active"),
         sql`'events' = ANY(${subscribers.tags})`
       )
     );
   }
   ```

5. **Write the send cron.** Follow the pattern in `lib/devotionals/send-daily.ts` and `app/api/cron/devotionals/route.ts`. Add a new cron entry to `vercel.json`.

6. **Add the feature flag.** Add `myType: false` to `content/site.json` under `features`, update `content/site.ts` comments, and add a boolean field to the `features` object in `tina/config.ts`.

That's it. No schema migration needed — the `tags` column already exists and handles any string value.

---

## Unsubscribing

A subscriber with `status='unsubscribed'` is excluded from all sends regardless of their tags. The "unsubscribe from everything" action on the preferences page sets `status='unsubscribed'` and clears the `tags` array.

For selective unsubscription (e.g., keeping devotionals but dropping digest), the preferences page saves the updated `tags` array via `POST /api/preferences`. The subscriber stays active; the send jobs just won't pick them up for the removed tag.

---

## Important invariant

**The devotional cron must never query all active subscribers — it must filter by the `devotionals` tag.** If you update `getActiveSubscribersWithPlans()` or introduce a new path that fetches "all active subscribers," add the tag filter. Otherwise, digest-only subscribers will start receiving devotionals they didn't sign up for.

The current `getActiveSubscribersWithPlans()` in `lib/db/queries.ts` already applies this filter.

---

## Worked example: the weekly digest

The weekly digest is the canonical example of the tag pattern in use. It's worth tracing through end to end:

### 1. Subscribing

The `/digest/subscribe` page renders `<DigestSubscribeForm>` (`components/digest/digest-subscribe-form.tsx`), which POSTs to the **same** `/api/devotionals/subscribe` route used by devotional signups — only with `tags: ["digest"]` in the body. The route merges this tag with whatever the subscriber already has, so a user who was already a devotional subscriber and then subscribes to the digest ends up with `tags: ["devotionals", "digest"]`.

### 2. Send-time filtering

When the digest cron fires (`app/api/cron/digest/route.ts`), it calls `sendWeeklyDigest`, which calls `findActiveSubscribersForDigest()`. That query filters on `status='active' AND 'digest' = ANY(tags)`. Devotional-only subscribers are correctly excluded.

### 3. Bounce isolation

Hard bounces in the digest send loop call `removeTagFromSubscriber(id, "digest")` — narrower than the devotional pattern, which marks the whole subscriber as `bounced`. A digest bounce drops them from digest sends only; if they also subscribed to devotionals, those continue.

### 4. Preferences

The preferences page at `/preferences?token=…` reads the subscriber's `tags` array, renders one checkbox per known tag, and saves the updated array back via `/api/preferences`. A subscriber can toggle either tag independently. Unchecking the last tag is allowed — the subscriber stays in the table with an empty `tags` array, and no cron picks them up.

### 5. Idempotency

The digest cron also tracks per-week idempotency in `digest_send_log` (one row per `weekStart`, unique index). Tag filtering and idempotency are orthogonal: the tag filter decides *who* gets this week's digest; the send log decides *whether* this week's digest sends at all.
