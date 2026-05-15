import type { Metadata } from "next";
import { getAllReadingPlans } from "@/content/devotionals";
import { TestSendForm } from "./TestSendForm";

export const metadata: Metadata = { title: "Send Test Email — Admin" };

export default function TestSendPage() {
  const plans = getAllReadingPlans();
  return <TestSendForm plans={plans.map((p) => ({ slug: p.slug, title: p.title, entries: p.entries.map((e) => e.date) }))} />;
}
