ALTER TABLE "subscribers" ADD COLUMN "tags" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
-- Backfill: every subscriber who signed up before the tags column existed
-- subscribed when devotionals was the only option, so they get the
-- "devotionals" tag. Pending-verification rows are included because they
-- may verify after this migration runs.
UPDATE "subscribers"
  SET "tags" = ARRAY['devotionals']::text[]
  WHERE "status" IN ('active', 'pending_verification');