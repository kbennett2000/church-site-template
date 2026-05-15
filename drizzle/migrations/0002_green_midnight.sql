CREATE TABLE IF NOT EXISTS "digest_send_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_start" varchar(10) NOT NULL,
	"week_end" varchar(10) NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"attempted" integer DEFAULT 0 NOT NULL,
	"sent" integer DEFAULT 0 NOT NULL,
	"failed" integer DEFAULT 0 NOT NULL,
	"errors" text,
	CONSTRAINT "digest_send_log_week_start_unique" UNIQUE("week_start")
);
