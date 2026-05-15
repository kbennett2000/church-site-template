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

// GET /api/devotionals/manage?token=<unsubscribeToken>
// Returns the subscriber's current preferences so the manage page can hydrate.
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
    timezone: subscriber.timezone,
    sendHour: subscriber.sendHour,
    subscribedPlanSlugs: plans.map((p) => p.planSlug),
    availablePlans: allPlans.map((p) => ({ slug: p.slug, title: p.title })),
  });
}

// POST /api/devotionals/manage?token=<unsubscribeToken>
// Updates name, timezone, sendHour, and plan list.
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

  const { name, timezone, sendHour, planSlugs } = body as {
    name?: string;
    timezone?: string;
    sendHour?: number;
    planSlugs?: string[];
  };

  await db
    .update(subscribers)
    .set({
      name: name ?? subscriber.name,
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
