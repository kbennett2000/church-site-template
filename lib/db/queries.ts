// Common database queries for the subscriber system.
// All functions return null (not undefined) when a record isn't found,
// which plays nicely with the `!result` check pattern in route handlers.

import { and, count, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "./index";
import { subscribers, subscriberPlans } from "./schema";
import type { Subscriber, SubscriberPlan } from "./schema";

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

export async function getActiveSubscribersForExport(): Promise<
  Pick<Subscriber, "email" | "name" | "timezone" | "sendHour" | "createdAt" | "verifiedAt">[]
> {
  return db
    .select({
      email: subscribers.email,
      name: subscribers.name,
      timezone: subscribers.timezone,
      sendHour: subscribers.sendHour,
      createdAt: subscribers.createdAt,
      verifiedAt: subscribers.verifiedAt,
    })
    .from(subscribers)
    .where(eq(subscribers.status, "active"))
    .orderBy(subscribers.email);
}
