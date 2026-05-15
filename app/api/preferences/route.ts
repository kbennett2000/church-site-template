import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import {
  findByUnsubscribeToken,
  getSubscriberPlans,
  upsertPlanSubscription,
  removePlanSubscription,
} from "@/lib/db/queries";
import { getActiveReadingPlans } from "@/content/devotionals";
import { eq } from "drizzle-orm";

// GET /api/preferences?token=<unsubscribeToken>
// Returns the subscriber's current preferences for the preferences page.
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  const subscriber = await findByUnsubscribeToken(token);
  if (!subscriber || subscriber.status === "unsubscribed") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const plans = await getSubscriberPlans(subscriber.id);
  const allPlans = getActiveReadingPlans();

  return NextResponse.json({
    name: subscriber.name,
    email: subscriber.email,
    tags: subscriber.tags,
    timezone: subscriber.timezone,
    sendHour: subscriber.sendHour,
    subscribedPlanSlugs: plans.map((p) => p.planSlug),
    availablePlans: allPlans.map((p) => ({ slug: p.slug, title: p.title })),
  });
}

// POST /api/preferences?token=<unsubscribeToken>
// Updates name, tags, timezone, sendHour, and plan list.
// Body: { name?, tags?, timezone?, sendHour?, planSlugs?, unsubscribeAll? }
export async function POST(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  const subscriber = await findByUnsubscribeToken(token);
  if (!subscriber || subscriber.status === "unsubscribed") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, tags, timezone, sendHour, planSlugs, unsubscribeAll } = body as {
    name?: string;
    tags?: string[];
    timezone?: string;
    sendHour?: number;
    planSlugs?: string[];
    unsubscribeAll?: boolean;
  };

  if (unsubscribeAll) {
    await db
      .update(subscribers)
      .set({ status: "unsubscribed", unsubscribedAt: new Date(), tags: [] })
      .where(eq(subscribers.id, subscriber.id));
    return NextResponse.json({ ok: true, unsubscribed: true });
  }

  await db
    .update(subscribers)
    .set({
      name: name ?? subscriber.name,
      tags: tags ?? subscriber.tags,
      timezone: timezone ?? subscriber.timezone,
      sendHour: sendHour ?? subscriber.sendHour,
    })
    .where(eq(subscribers.id, subscriber.id));

  if (planSlugs !== undefined) {
    const currentPlans = await getSubscriberPlans(subscriber.id);
    const currentSlugs = new Set(currentPlans.map((p) => p.planSlug));
    const desiredSlugs = new Set(planSlugs);

    for (const slug of desiredSlugs) {
      if (!currentSlugs.has(slug)) {
        await upsertPlanSubscription(subscriber.id, slug);
      }
    }
    for (const slug of currentSlugs) {
      if (!desiredSlugs.has(slug)) {
        await removePlanSubscription(subscriber.id, slug);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
