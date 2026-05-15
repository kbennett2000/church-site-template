CREATE TYPE "public"."subscriber_status" AS ENUM('pending_verification', 'active', 'unsubscribed', 'bounced');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "devotional_send_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" varchar(10) NOT NULL,
	"run_at" timestamp with time zone DEFAULT now() NOT NULL,
	"attempted" integer DEFAULT 0 NOT NULL,
	"sent" integer DEFAULT 0 NOT NULL,
	"skipped" integer DEFAULT 0 NOT NULL,
	"failed" integer DEFAULT 0 NOT NULL,
	"errors" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriber_plans" (
	"subscriber_id" uuid NOT NULL,
	"plan_slug" varchar(255) NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_sent_date" varchar(10),
	CONSTRAINT "subscriber_plans_subscriber_id_plan_slug_pk" PRIMARY KEY("subscriber_id","plan_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"status" "subscriber_status" DEFAULT 'pending_verification' NOT NULL,
	"timezone" varchar(100) DEFAULT 'America/New_York' NOT NULL,
	"send_hour" integer DEFAULT 6 NOT NULL,
	"verification_token" varchar(64),
	"verification_token_expires_at" timestamp with time zone,
	"unsubscribe_token" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email"),
	CONSTRAINT "subscribers_verification_token_unique" UNIQUE("verification_token"),
	CONSTRAINT "subscribers_unsubscribe_token_unique" UNIQUE("unsubscribe_token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriber_plans" ADD CONSTRAINT "subscriber_plans_subscriber_id_subscribers_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
