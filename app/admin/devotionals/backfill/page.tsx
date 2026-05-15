import type { Metadata } from "next";
import { getAllReadingPlans } from "@/content/devotionals";
import { BackfillForm } from "./BackfillForm";

export const metadata: Metadata = { title: "Backfill Missed Sends — Admin" };

export default function BackfillPage() {
  const plans = getAllReadingPlans();
  return (
    <BackfillForm
      plans={plans.map((p) => ({ slug: p.slug, title: p.title }))}
    />
  );
}
