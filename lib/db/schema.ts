import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  integer,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const subscriberStatusEnum = pgEnum("subscriber_status", [
  "pending_verification",
  "active",
  "unsubscribed",
  "bounced",
]);

// ---------------------------------------------------------------------------
// subscribers
// ---------------------------------------------------------------------------
// One row per unique email address. Re-subscribing reuses the same row
// (status flips back to pending_verification) rather than inserting a new one,
// which keeps the subscriber_plans join table tidy and avoids duplicate rows.

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),

  /** Stored lowercase. Unique constraint enforced at the DB level. */
  email: varchar("email", { length: 255 }).notNull().unique(),

  name: varchar("name", { length: 255 }),

  status: subscriberStatusEnum("status")
    .notNull()
    .default("pending_verification"),

  /** IANA timezone string, e.g. "America/Denver". Used by the cron scheduler. */
  timezone: varchar("timezone", { length: 100 }).notNull().default("America/New_York"),

  /** Local hour (0–23) at which to send the daily email. Default 6 = 6 AM. */
  sendHour: integer("send_hour").notNull().default(6),

  /** 64-char hex token. Expires after 24 hours (see verificationTokenExpiresAt). */
  verificationToken: varchar("verification_token", { length: 64 }).unique(),

  verificationTokenExpiresAt: timestamp("verification_token_expires_at", {
    withTimezone: true,
  }),

  /**
   * 64-char hex token for the manage-preferences and unsubscribe flows.
   * Long-lived (never expires). Included in every outgoing devotional email.
   */
  unsubscribeToken: varchar("unsubscribe_token", { length: 64 })
    .notNull()
    .unique(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  verifiedAt: timestamp("verified_at", { withTimezone: true }),

  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
});

// ---------------------------------------------------------------------------
// subscriber_plans  (join table)
// ---------------------------------------------------------------------------
// A subscriber can follow multiple plans. lastSentDate lets the cron job be
// idempotent — if it runs twice on the same day it skips already-sent entries.

export const subscriberPlans = pgTable(
  "subscriber_plans",
  {
    subscriberId: uuid("subscriber_id")
      .notNull()
      .references(() => subscribers.id, { onDelete: "cascade" }),

    /** Matches ReadingPlan.slug from /content/reading-plans/*.md. */
    planSlug: varchar("plan_slug", { length: 255 }).notNull(),

    subscribedAt: timestamp("subscribed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    /** YYYY-MM-DD of the last entry successfully sent to this subscriber. */
    lastSentDate: varchar("last_sent_date", { length: 10 }),
  },
  (table) => [primaryKey({ columns: [table.subscriberId, table.planSlug] })]
);

// ---------------------------------------------------------------------------
// Inferred TypeScript types
// ---------------------------------------------------------------------------

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
export type SubscriberPlan = typeof subscriberPlans.$inferSelect;
