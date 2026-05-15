---
title: "Database Migrations"
type: reference
---

# Database Migrations

This document covers how the church-site-template manages Postgres schema changes using Drizzle ORM's migration file workflow.

---

## Why migration files instead of drizzle-kit push

`drizzle-kit push` synchronises your TypeScript schema directly to the database by introspecting the current state and applying whatever diffs it needs. On a fresh dev database this is convenient. On a production database with real subscriber data, it is dangerous: Drizzle will DROP and recreate columns or tables when it can't apply a change non-destructively, with no recovery path.

Migration files solve this by making every schema change an explicit, reviewable SQL file that is committed to git. The apply step (`drizzle-kit migrate`) is safe to run repeatedly — it tracks which files have already been applied and skips them.

---

## Scripts

| Script | Command | When to use |
|---|---|---|
| `npm run db:generate` | `drizzle-kit generate` | After editing `lib/db/schema.ts`. Produces a SQL file in `drizzle/migrations/`. Does **not** touch the database. |
| `npm run db:migrate` | `drizzle-kit migrate` | Applies any unapplied migration files to the database. Safe to run repeatedly. |
| `npm run db:push` | `drizzle-kit push` | Dev-only shortcut. **Never run against a production database.** Can DROP tables. |
| `npm run db:studio` | `drizzle-kit studio` | Opens Drizzle Studio — a browser-based visual of your database. |

---

## The standard workflow for schema changes

```bash
# 1. Edit the schema
#    Open lib/db/schema.ts and make your changes.

# 2. Generate the migration
npm run db:generate
#    Creates drizzle/migrations/NNNN_<slug>.sql
#    Also creates drizzle/migrations/meta/NNNN_snapshot.json (don't edit this)

# 3. Review the SQL
#    Open the new .sql file and confirm it contains only safe DDL.
#    Look for DROP TABLE or DROP COLUMN — if you see these and didn't
#    intend to destroy data, fix the schema and regenerate.

# 4. Commit the migration file to git
git add drizzle/migrations/
git commit -m "db: add <description> migration"

# 5. Apply to the database
npm run db:migrate
```

Vercel will apply pending migrations automatically if you add `npm run db:migrate` to your build command or a Vercel deploy hook. Without that, run it manually after each deploy that includes a new migration file.

---

## Common operations

### Add a nullable column

In `lib/db/schema.ts`:

```ts
// Before
export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

// After — add a nullable notes column
export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  notes: text("notes"),          // nullable = no .notNull()
});
```

Run `db:generate`. The SQL will be:

```sql
ALTER TABLE "subscribers" ADD COLUMN "notes" text;
```

Safe — no data loss.

### Add a NOT NULL column with a default

In `lib/db/schema.ts`:

```ts
preferredLanguage: varchar("preferred_language", { length: 10 })
  .notNull()
  .default("en"),
```

Run `db:generate`. The SQL will be:

```sql
ALTER TABLE "subscribers" ADD COLUMN "preferred_language" varchar(10) DEFAULT 'en' NOT NULL;
```

Safe — the default fills existing rows before the constraint is applied.

### Drop a column

Remove the column from `lib/db/schema.ts` and run `db:generate`. Review the SQL before applying — `DROP COLUMN` is irreversible. Back up or export the data first if it matters.

```sql
ALTER TABLE "subscribers" DROP COLUMN "notes";
```

### Rename a column

Drizzle does not know whether you renamed a column or dropped one and added another — it sees the same diff either way. If you rename in TypeScript and generate, the SQL will be a `DROP COLUMN` + `ADD COLUMN`, which destroys the data in that column.

To rename without data loss, write the migration by hand:

```sql
ALTER TABLE "subscribers" RENAME COLUMN "notes" TO "internal_notes";
```

Save that as a new file in `drizzle/migrations/` following the naming convention (`0002_rename_notes.sql`), then update `meta/_journal.json` to include the new entry, or regenerate from scratch after the rename is already applied. The safest path: apply the hand-written rename migration to the DB first, then sync the schema file to match, and run `db:generate` — Drizzle will see no diff and produce no file.

### Add an index

```ts
import { index } from "drizzle-orm/pg-core";

export const subscribers = pgTable(
  "subscribers",
  { ... },
  (table) => [index("subscribers_status_idx").on(table.status)]
);
```

Generated SQL:

```sql
CREATE INDEX "subscribers_status_idx" ON "subscribers" ("status");
```

---

## Migration file format

Each file is plain SQL with Drizzle's `-->statement-breakpoint` delimiter:

```sql
ALTER TABLE "subscribers" ADD COLUMN "notes" text;--> statement-breakpoint
CREATE INDEX "subscribers_notes_idx" ON "subscribers" ("notes");
```

The delimiter tells `drizzle-kit migrate` where one statement ends and the next begins, so failures mid-file don't leave the database in an ambiguous state.

---

## Handling a failed migration

If `db:migrate` fails partway through:

1. **Check the error message.** It will name the statement that failed (e.g., "column already exists").
2. **Fix the cause.** Often it means the database is already partially ahead (e.g., you ran `db:push` earlier and some columns exist).
3. **Don't re-run migrate blindly.** The migration tracking table (`drizzle_migrations` in your database) records which files have been applied. If a file is listed there but the schema is wrong, you have a divergence.
4. **Reconcile via Drizzle Studio** (`npm run db:studio`) — inspect the actual table structure against what the migration expected.
5. **If the database is empty or expendable**, run `db:push` once to resync, then use migration files going forward. Do not do this on a database with real data.

---

## The drizzle/migrations/ directory

```
drizzle/
└── migrations/
    ├── 0000_nebulous_puff_adder.sql   ← baseline (creates all tables)
    ├── meta/
    │   ├── _journal.json              ← list of all migrations (managed by drizzle-kit)
    │   └── 0000_snapshot.json         ← schema snapshot (managed by drizzle-kit)
```

**Commit all of these to git.** The `meta/` files are required for `drizzle-kit generate` to compute future diffs correctly. Do not edit them by hand unless you know what you're doing.

---

## Neon point-in-time recovery

The recommended Postgres provider (Neon) keeps 7 days of history on the free tier. If you apply a migration that damages data:

1. Neon dashboard → your project → **Branches** → **Restore**.
2. Choose a timestamp before the bad migration.
3. Neon creates a branch at that point — verify the data, then restore to main.

Documentation: https://neon.tech/docs/guides/branch-restore
