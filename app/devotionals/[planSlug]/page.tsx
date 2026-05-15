import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Calendar, ChevronRight, Lock } from "lucide-react";
import {
  getAllReadingPlans,
  getReadingPlan,
  planDurationLabel,
} from "@/content/devotionals";
import { features } from "@/content/site";
import { churchInfo } from "@/lib/church-info";
import type { ReadingPlan, ReadingPlanEntry } from "@/lib/devotionals/types";
import { SubscribeForm } from "@/components/devotionals/subscribe-form";

export const revalidate = 3600;

export async function generateStaticParams() {
  // Pre-generate a page for every plan. If features.devotionals is off,
  // getAll returns plans from files that might already exist (the feature flag
  // only gates the page itself, not the static generation step).
  return getAllReadingPlans().map((plan) => ({ planSlug: plan.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ planSlug: string }>;
}): Promise<Metadata> {
  const { planSlug } = await params;
  const plan = getReadingPlan(planSlug);
  if (!plan) return {};
  return {
    title: plan.title,
    description: `${plan.title} — a ${planDurationLabel(plan)} reading plan from ${churchInfo.name}. ${plan.description.slice(0, 120)}`,
  };
}

const STYLE_LABELS: Record<string, string> = {
  soap: "SOAP",
  simple: "Verse of the Day",
  lectio_divina: "Lectio Divina",
};

function formatDisplayDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function EntryRow({
  entry,
  planSlug,
  isPast,
  isToday,
}: {
  entry: ReadingPlanEntry;
  planSlug: string;
  isPast: boolean;
  isToday: boolean;
}) {
  const isFuture = !isPast && !isToday;

  if (isFuture) {
    return (
      <li className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-muted-foreground">
        <span className="w-20 shrink-0 text-xs tabular-nums">
          {formatShortDate(entry.date)}
        </span>
        <Lock className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1 text-sm">
          {entry.title ?? entry.scriptureReference}
        </span>
        <span className="text-xs">Available {formatDisplayDate(entry.date)}</span>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={`/devotionals/${planSlug}/${entry.date}`}
        className={`flex items-center gap-4 rounded-lg border px-4 py-3 transition hover:bg-accent/5 ${
          isToday
            ? "border-accent bg-accent/5 shadow-sm"
            : "border-border/60 bg-card"
        }`}
      >
        <span
          className={`w-20 shrink-0 text-xs tabular-nums ${isToday ? "font-semibold text-accent" : "text-muted-foreground"}`}
        >
          {isToday ? "Today" : formatShortDate(entry.date)}
        </span>
        <span className="flex-1 text-sm font-medium">
          {entry.title ?? entry.scriptureReference}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {entry.scriptureReference}
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
}

function ProgressBar({ plan }: { plan: ReadingPlan }) {
  const today = new Date().toISOString().slice(0, 10);
  const doneCount = plan.entries.filter((e) => e.date <= today).length;
  const total = plan.entries.length;
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
        <span>{doneCount} of {total} days</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  );
}

export default async function PlanPage({
  params,
}: {
  params: Promise<{ planSlug: string }>;
}) {
  const { planSlug } = await params;

  if (!features?.devotionals) notFound();

  const plan = getReadingPlan(planSlug);
  if (!plan) notFound();

  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = plan.entries.find((e) => e.date === today);
  const styleLabel = STYLE_LABELS[plan.style] ?? plan.style;

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-12 md:py-16">
          <Link
            href="/devotionals"
            className="text-sm text-muted-foreground hover:text-accent"
          >
            ← All plans
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
              {styleLabel}
            </span>
            {plan.isActive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
                Active
              </span>
            )}
          </div>

          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl">
            {plan.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDisplayDate(plan.startDate)} – {formatDisplayDate(plan.endDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {planDurationLabel(plan)} · {plan.defaultTranslation}
            </span>
          </div>

          {plan.description && (
            <p className="mt-5 max-w-2xl text-foreground/80">{plan.description}</p>
          )}

          <div className="mt-6 max-w-sm">
            <ProgressBar plan={plan} />
          </div>
        </div>
      </section>

      {todayEntry && (
        <section className="container py-10 md:py-12">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Today&apos;s reading
            </p>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl">
              {todayEntry.title ?? todayEntry.scriptureReference}
            </h2>
            <p className="mt-1 text-muted-foreground">{todayEntry.scriptureReference}</p>
            <div className="mt-5">
              <Link
                href={`/devotionals/${plan.slug}/${todayEntry.date}`}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
              >
                Read today&apos;s passage
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="container py-10 md:py-16">
        <h2 className="font-serif text-2xl">Full schedule</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Past entries are readable. Future entries unlock on their date.
        </p>
        <ul className="mt-6 space-y-2">
          {plan.entries.map((entry) => {
            const isPast = entry.date < today;
            const isToday = entry.date === today;
            return (
              <EntryRow
                key={entry.date}
                entry={entry}
                planSlug={plan.slug}
                isPast={isPast}
                isToday={isToday}
              />
            );
          })}
        </ul>
      </section>

      <section className="border-t border-border bg-muted/40 py-16 md:py-20">
        <div className="container max-w-lg">
          <SubscribeForm
            plans={getAllReadingPlans().map((p) => ({
              slug: p.slug,
              title: p.title,
              isActive: p.isActive,
            }))}
            preselectedSlug={plan.slug}
          />
        </div>
      </section>
    </>
  );
}
