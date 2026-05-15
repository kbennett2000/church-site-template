---
title: "Subscriber Data Model"
type: reference
---

# Subscriber Data Model

This document describes the database schema, query layer, and token design for the devotional subscriber system.

---

## Overview

The subscriber system uses two tables:

- **`subscribers`** — one row per unique email address, holds identity and delivery preferences
- **`subscriber_plans`** — join table linking subscribers to reading plans

The schema is defined in [lib/db/schema.ts](../../lib/db/schema.ts) using Drizzle ORM. Schema changes are managed through committed SQL migration files — see [database-migrations.md](./database-migrations.md) for the workflow. The stack is Vercel Postgres + `@vercel/postgres` + `drizzle-orm/vercel-postgres`.

---

## `subscribers` table

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Auto-generated (random). |
| `email` | `varchar(255)` unique | Stored lowercase. Unique constraint at the DB level. |
| `name` | `varchar(255)` nullable | Optional display name from the sign-up form. |
| `status` | `subscriber_status` enum | `pending_verification`, `active`, `unsubscribed`, `bounced` |
| `timezone` | `varchar(100)` | IANA timezone string. Default: `America/New_York`. |
| `send_hour` | `integer` | Local hour (0–23) for delivery. Default: `6` (6 AM). |
| `verification_token` | `varchar(64)` nullable unique | 64-char hex (32 random bytes). Nulled after verification. |
| `verification_token_expires_at` | `timestamptz` nullable | 24 hours after token creation. |
| `unsubscribe_token` | `varchar(64)` not-null unique | 64-char hex. Long-lived — never expires. Used for manage + unsubscribe. |
| `created_at` | `timestamptz` | Default `now()`. |
| `verified_at` | `timestamptz` nullable | Set when status transitions to `active`. |
| `unsubscribed_at` | `timestamptz` nullable | Set when status transitions to `unsubscribed`. |

### Re-subscribing

When a subscriber re-subscribes (emails already exist in the table), the same row is reused. The status flips back to `pending_verification`, a new verification token is issued, and `verified_at`/`unsubscribed_at` are cleared. This keeps the `subscriber_plans` join table tidy and avoids duplicate rows.

---

## `subscriber_plans` table

| Column | Type | Notes |
|---|---|---|
| `subscriber_id` | `uuid` FK | References `subscribers.id`. Cascade deletes. |
| `plan_slug` | `varchar(255)` | Matches `ReadingPlan.slug` from `/content/reading-plans/*.md`. |
| `subscribed_at` | `timestamptz` | When the subscriber signed up for this plan. |
| `last_sent_date` | `varchar(10)` nullable | `YYYY-MM-DD` of the last entry successfully delivered. Used by the cron job for idempotency. |

Primary key: `(subscriber_id, plan_slug)`.

---

## Status lifecycle

```
sign-up POST → pending_verification
                    │
            email link clicked
                    │
                    ▼
                  active  ←──── re-subscribe
                    │
            unsubscribe clicked
                    │
                    ▼
               unsubscribed
```

`bounced` is set by the cron job or a Resend webhook when a hard bounce occurs. There is no automated path back from `bounced` — a church admin would need to manually update the status.

---

## Token design

Generated in [lib/devotionals/tokens.ts](../../lib/devotionals/tokens.ts):

```typescript
export function generateToken(): string {
  return randomBytes(32).toString("hex"); // 64 hex chars
}

export function verificationExpiresAt(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}
```

**Verification token** — short-lived (24 hours). Stored in `verification_token`. Cleared (set to `null`) after successful verification. The expiry is checked server-side in the query (`gt(subscribers.verificationTokenExpiresAt, new Date())`).

**Unsubscribe token** — long-lived (never expires). Stored in `unsubscribe_token`. Included in every outgoing devotional email. Used as authentication for both the manage-preferences flow and the one-click unsubscribe.

---

## Query layer

All queries are in [lib/db/queries.ts](../../lib/db/queries.ts):

| Function | Purpose |
|---|---|
| `findByEmail(email)` | Look up a subscriber by email (lowercase). |
| `findByVerificationToken(token)` | Find an unexpired verification token. |
| `findByVerificationTokenAny(token)` | Find by token regardless of expiry (for expired-token UI). |
| `findByUnsubscribeToken(token)` | Find by unsubscribe/manage token. |
| `getSubscriberPlans(subscriberId)` | Get all plans a subscriber is enrolled in. |
| `upsertPlanSubscription(subscriberId, planSlug)` | Add a plan enrollment (no-op if already exists). |
| `removePlanSubscription(subscriberId, planSlug)` | Remove a plan enrollment. |
| `getSubscriberStats()` | Admin totals: total, active, pending, unsubscribed, bounced. |
| `getPlanSubscriberCounts()` | Active subscriber count per plan slug. |
| `getRecentActivity(limit)` | Most recently created subscribers (default 20). |
| `getActiveSubscribersForExport()` | Selected fields for CSV export (active only). |

All functions return `null` (not `undefined`) when a record isn't found, matching the `!result` check pattern used in route handlers.

---

## Database connection

`lib/db/index.ts` creates the Drizzle client:

```typescript
import { drizzle } from "drizzle-orm/vercel-postgres";
import { createPool } from "@vercel/postgres";

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
const pool = createPool({ connectionString });
export const db = drizzle(pool, { schema });
```

`DATABASE_URL` is the canonical env var. `POSTGRES_URL` is the name Vercel auto-sets when you add a Postgres database to your project — having both as a fallback means adopting churches can use either name without changing code.

---

## Drizzle migrations

Schema source: `lib/db/schema.ts`. Drizzle config: `drizzle.config.ts`. Migration files live in `drizzle/migrations/` and are committed to git.

For the full workflow (generate → review → commit → apply), how to handle renames safely, and recovery from a failed migration, see [database-migrations.md](./database-migrations.md).

---

## Admin page

`app/admin/devotionals/page.tsx` is a React Server Component that calls the stats queries directly. It's protected by HTTP Basic Auth in `middleware.ts` (requires `ADMIN_PASSWORD` env var). The CSV export is at `GET /api/admin/devotionals/export`, also protected by the same middleware.

---

## Adding columns

1. Add the column to `lib/db/schema.ts`.
2. Run `npm run db:generate` to produce a new SQL file in `drizzle/migrations/`.
3. Review the generated SQL, then commit it.
4. Run `npm run db:migrate` to apply it locally; production picks it up on the next deploy that runs `db:migrate`.
5. Update `lib/db/queries.ts` if the new column needs to be read or written.

The source of truth is the committed migration files plus `schema.ts`. See [database-migrations.md](./database-migrations.md) for full details, including how to handle renames without data loss.
