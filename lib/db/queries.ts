// Common database queries for the subscriber system.
// All functions return null (not undefined) when a record isn't found,
// which plays nicely with the `!result` check pattern in route handlers.

import { and, count, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "./index";
import { subscribers, subscriberPlans, devotionalSendLog, digestSendLog } from "./schema";
import type { Subscriber, SubscriberPlan, DevotionalSendLog, DigestSendLog } from "./schema";

// ---------------------------------------------------------------------------
// Subscriber lookups
// ---------------------------------------------------------------------------

export async function findByEmail(email: string): Promise<Subscriber | null> {
  const rows = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.email, email.toLowerCase().trim()))
    .limit(1);
  return rows[0] ?? null;
}

export async function findByVerificationToken(
  token: string
): Promise<Subscriber | null> {
  const rows = await db
    .select()
    .from(subscribers)
    .where(
      and(
        eq(subscribers.verificationToken, token),
        gt(subscribers.verificationTokenExpiresAt, new Date())
      )
    )
    .limit(1);
  return rows[0] ?? null;
}

/** For expired token check — finds by token regardless of expiry. */
export async function findByVerificationTokenAny(
  token: string
): Promise<Subscriber | null> {
  const rows = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.verificationToken, token))
    .limit(1);
  return rows[0] ?? null;
}

export async function findByUnsubscribeToken(
  token: string
): Promise<Subscriber | null> {
  const rows = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.unsubscribeToken, token))
    .limit(1);
  return rows[0] ?? null;
}

// ---------------------------------------------------------------------------
// Tag management
// ---------------------------------------------------------------------------

/** Returns true if the subscriber already has this tag. */
export async function addTagToSubscriber(
  subscriberId: string,
  tag: string
): Promise<void> {
  await db
    .update(subscribers)
    .set({ tags: sql`array_append(${subscribers.tags}, ${tag})` })
    .where(
      and(
        eq(subscribers.id, subscriberId),
        sql`NOT (${tag} = ANY(${subscribers.tags}))`
      )
    );
}

export async function removeTagFromSubscriber(
  subscriberId: string,
  tag: string
): Promise<void> {
  await db
    .update(subscribers)
    .set({ tags: sql`array_remove(${subscribers.tags}, ${tag})` })
    .where(eq(subscribers.id, subscriberId));
}

// ---------------------------------------------------------------------------
// Plan subscriptions
// ---------------------------------------------------------------------------

export async function getSubscriberPlans(
  subscriberId: string
): Promise<SubscriberPlan[]> {
  return db
    .select()
    .from(subscriberPlans)
    .where(eq(subscriberPlans.subscriberId, subscriberId));
}

export async function upsertPlanSubscription(
  subscriberId: string,
  planSlug: string
): Promise<void> {
  await db
    .insert(subscriberPlans)
    .values({ subscriberId, planSlug })
    .onConflictDoNothing();
}

export async function removePlanSubscription(
  subscriberId: string,
  planSlug: string
): Promise<void> {
  await db
    .delete(subscriberPlans)
    .where(
      and(
        eq(subscriberPlans.subscriberId, subscriberId),
        eq(subscriberPlans.planSlug, planSlug)
      )
    );
}

// ---------------------------------------------------------------------------
// Admin / stats queries
// ---------------------------------------------------------------------------

export async function getSubscriberStats() {
  const [totals] = await db
    .select({
      total: count(),
      active: sql<number>`SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)`,
      pending: sql<number>`SUM(CASE WHEN status = 'pending_verification' THEN 1 ELSE 0 END)`,
      unsubscribed: sql<number>`SUM(CASE WHEN status = 'unsubscribed' THEN 1 ELSE 0 END)`,
      bounced: sql<number>`SUM(CASE WHEN status = 'bounced' THEN 1 ELSE 0 END)`,
    })
    .from(subscribers);

  return {
    total: Number(totals?.total ?? 0),
    active: Number(totals?.active ?? 0),
    pending: Number(totals?.pending ?? 0),
    unsubscribed: Number(totals?.unsubscribed ?? 0),
    bounced: Number(totals?.bounced ?? 0),
  };
}

export async function getPlanSubscriberCounts(): Promise<
  { planSlug: string; count: number }[]
> {
  const rows = await db
    .select({
      planSlug: subscriberPlans.planSlug,
      count: count(),
    })
    .from(subscriberPlans)
    .innerJoin(subscribers, eq(subscriberPlans.subscriberId, subscribers.id))
    .where(eq(subscribers.status, "active"))
    .groupBy(subscriberPlans.planSlug);

  return rows.map((r) => ({ planSlug: r.planSlug, count: Number(r.count) }));
}

export async function getRecentActivity(limit = 20): Promise<Subscriber[]> {
  return db
    .select()
    .from(subscribers)
    .orderBy(desc(subscribers.createdAt))
    .limit(limit);
}

// ---------------------------------------------------------------------------
// Send-daily queries
// ---------------------------------------------------------------------------

export interface SubscriberWithPlans {
  id: string;
  email: string;
  name: string | null;
  timezone: string;
  sendHour: number;
  unsubscribeToken: string;
  plans: Array<{ planSlug: string; lastSentDate: string | null }>;
}

/**
 * Returns active devotional subscribers (status=active, tags contains
 * "devotionals") with their plan enrollments. Used by the daily cron.
 */
export async function getActiveSubscribersWithPlans(): Promise<SubscriberWithPlans[]> {
  const rows = await db
    .select({
      subscriberId: subscribers.id,
      email: subscribers.email,
      name: subscribers.name,
      timezone: subscribers.timezone,
      sendHour: subscribers.sendHour,
      unsubscribeToken: subscribers.unsubscribeToken,
      planSlug: subscriberPlans.planSlug,
      lastSentDate: subscriberPlans.lastSentDate,
    })
    .from(subscribers)
    .innerJoin(subscriberPlans, eq(subscriberPlans.subscriberId, subscribers.id))
    .where(
      and(
        eq(subscribers.status, "active"),
        sql`'devotionals' = ANY(${subscribers.tags})`
      )
    );

  const map = new Map<string, SubscriberWithPlans>();
  for (const row of rows) {
    if (!map.has(row.subscriberId)) {
      map.set(row.subscriberId, {
        id: row.subscriberId,
        email: row.email,
        name: row.name,
        timezone: row.timezone,
        sendHour: row.sendHour,
        unsubscribeToken: row.unsubscribeToken,
        plans: [],
      });
    }
    map.get(row.subscriberId)!.plans.push({
      planSlug: row.planSlug,
      lastSentDate: row.lastSentDate ?? null,
    });
  }
  return Array.from(map.values());
}

/** Returns active digest subscribers (status=active, tags contains "digest"). */
export async function findActiveSubscribersForDigest(): Promise<
  Pick<Subscriber, "id" | "email" | "name" | "unsubscribeToken">[]
> {
  return db
    .select({
      id: subscribers.id,
      email: subscribers.email,
      name: subscribers.name,
      unsubscribeToken: subscribers.unsubscribeToken,
    })
    .from(subscribers)
    .where(
      and(
        eq(subscribers.status, "active"),
        sql`'digest' = ANY(${subscribers.tags})`
      )
    );
}

export async function updateLastSentDate(
  subscriberId: string,
  planSlug: string,
  date: string
): Promise<void> {
  await db
    .update(subscriberPlans)
    .set({ lastSentDate: date })
    .where(
      and(
        eq(subscriberPlans.subscriberId, subscriberId),
        eq(subscriberPlans.planSlug, planSlug)
      )
    );
}

export async function markSubscriberBounced(email: string): Promise<void> {
  await db
    .update(subscribers)
    .set({ status: "bounced" })
    .where(eq(subscribers.email, email.toLowerCase().trim()));
}

export async function markSubscriberUnsubscribed(email: string): Promise<void> {
  await db
    .update(subscribers)
    .set({ status: "unsubscribed", unsubscribedAt: new Date() })
    .where(eq(subscribers.email, email.toLowerCase().trim()));
}

// ---------------------------------------------------------------------------
// Send log queries
// ---------------------------------------------------------------------------

export async function logDevotionalSend(
  date: string,
  stats: { attempted: number; sent: number; skipped: number; failed: number },
  errors: Array<{ subscriberId: string; planSlug: string; message: string }>
): Promise<void> {
  await db.insert(devotionalSendLog).values({
    date,
    attempted: stats.attempted,
    sent: stats.sent,
    skipped: stats.skipped,
    failed: stats.failed,
    errors: errors.length > 0 ? JSON.stringify(errors) : null,
  });
}

export async function getRecentSendLogs(limit = 30): Promise<DevotionalSendLog[]> {
  return db
    .select()
    .from(devotionalSendLog)
    .orderBy(desc(devotionalSendLog.runAt))
    .limit(limit);
}

// ---------------------------------------------------------------------------
// Digest send log queries
// ---------------------------------------------------------------------------

/** Returns the digest send log entry for the given week, or null. */
export async function getDigestSendLog(
  weekStart: string
): Promise<DigestSendLog | null> {
  const rows = await db
    .select()
    .from(digestSendLog)
    .where(eq(digestSendLog.weekStart, weekStart))
    .limit(1);
  return rows[0] ?? null;
}

export async function getRecentDigestSendLogs(limit = 30): Promise<DigestSendLog[]> {
  return db
    .select()
    .from(digestSendLog)
    .orderBy(desc(digestSendLog.sentAt))
    .limit(limit);
}

export async function logDigestSend(args: {
  weekStart: string;
  weekEnd: string;
  attempted: number;
  sent: number;
  failed: number;
  errors: Array<{ subscriberId: string; message: string }>;
}): Promise<void> {
  await db.insert(digestSendLog).values({
    weekStart: args.weekStart,
    weekEnd: args.weekEnd,
    attempted: args.attempted,
    sent: args.sent,
    failed: args.failed,
    errors: args.errors.length > 0 ? JSON.stringify(args.errors) : null,
  });
}

/** Used by the manual send-now endpoint to overwrite a prior log row when force=true. */
export async function deleteDigestSendLog(weekStart: string): Promise<void> {
  await db.delete(digestSendLog).where(eq(digestSendLog.weekStart, weekStart));
}

/**
 * On a hard bounce of a digest email, strip the "digest" tag from the subscriber.
 * They may still have other tags (e.g. "devotionals") and should continue to receive
 * those — this is narrower than markSubscriberBounced which would block all email.
 */
export async function removeDigestTagOnBounce(email: string): Promise<void> {
  await db
    .update(subscribers)
    .set({ tags: sql`array_remove(${subscribers.tags}, 'digest')` })
    .where(eq(subscribers.email, email.toLowerCase().trim()));
}

// ---------------------------------------------------------------------------
// Export query
// ---------------------------------------------------------------------------

export async function getActiveSubscribersForExport(): Promise<
  Pick<Subscriber, "email" | "name" | "tags" | "timezone" | "sendHour" | "createdAt" | "verifiedAt">[]
> {
  return db
    .select({
      email: subscribers.email,
      name: subscribers.name,
      tags: subscribers.tags,
      timezone: subscribers.timezone,
      sendHour: subscribers.sendHour,
      createdAt: subscribers.createdAt,
      verifiedAt: subscribers.verifiedAt,
    })
    .from(subscribers)
    .where(eq(subscribers.status, "active"))
    .orderBy(subscribers.email);
}
