import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Calendar, BookMarked, Clock } from "lucide-react";
import { getAllReadingPlans, getTodayEntry, planDurationLabel } from "@/content/devotionals";
import { features } from "@/content/site";
import { churchInfo } from "@/lib/church-info";
import type { ReadingPlan } from "@/lib/devotionals/types";

// Revalidate hourly so "today's reading" stays current without a full rebuild.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Daily Devotionals",
  description: `Daily Bible readings from ${churchInfo.name}. Follow a reading plan and receive today's passage each morning.`,
};

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

function PlanCard({ plan }: { plan: ReadingPlan }) {
  const todayEntry = getTodayEntry(plan);
  const styleLabel = STYLE_LABELS[plan.style] ?? plan.style;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex-1 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
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

        <h2 className="mt-4 font-serif text-2xl md:text-3xl">
          <Link
            href={`/devotionals/${plan.slug}`}
            className="hover:text-accent transition-colors"
          >
            {plan.title}
          </Link>
        </h2>

        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {planDurationLabel(plan)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Starts {formatDisplayDate(plan.startDate)}
          </span>
        </div>

        {plan.description && (
          <p className="mt-4 text-foreground/80 line-clamp-3">{plan.description}</p>
        )}

        {todayEntry && (
          <div className="mt-5 rounded-lg border border-accent/20 bg-accent/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Today&apos;s reading
            </p>
            <p className="mt-1 font-serif text-lg">
              {todayEntry.title ?? todayEntry.scriptureReference}
            </p>
            <p className="text-sm text-muted-foreground">{todayEntry.scriptureReference}</p>
            <Link
              href={`/devotionals/${plan.slug}/${todayEntry.date}`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Read today&apos;s passage →
            </Link>
          </div>
        )}
      </div>

      <div className="border-t border-border px-6 py-4 md:px-8 flex items-center justify-between gap-4">
        <Link
          href={`/devotionals/${plan.slug}`}
          className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors"
        >
          View full schedule →
        </Link>
        <button
          disabled
          title="Email subscription will be available soon. Check back after your church enables the subscriber system."
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-50 cursor-not-allowed select-none"
        >
          Subscribe by email
        </button>
      </div>
    </div>
  );
}

function SoapExplainer() {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Reading method
      </p>
      <h3 className="mt-3 font-serif text-2xl">What is SOAP?</h3>
      <p className="mt-3 text-foreground/80">
        SOAP is a simple Bible study method that takes about 15 minutes. It
        works well as a morning routine or a brief midday pause.
      </p>
      <dl className="mt-5 space-y-4">
        {[
          {
            term: "S — Scripture",
            def: "Read the passage slowly, once or twice. You might read it aloud.",
          },
          {
            term: "O — Observation",
            def: "What do you notice? Write down a word or phrase that stands out.",
          },
          {
            term: "A — Application",
            def: "How does this passage speak to your life today? Be specific.",
          },
          {
            term: "P — Prayer",
            def: "Respond to God with what you've read and observed. No formula needed.",
          },
        ].map(({ term, def }) => (
          <div key={term}>
            <dt className="font-semibold text-foreground">{term}</dt>
            <dd className="mt-0.5 text-sm text-muted-foreground">{def}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function LectioExplainer() {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Reading method
      </p>
      <h3 className="mt-3 font-serif text-2xl">What is Lectio Divina?</h3>
      <p className="mt-3 text-foreground/80">
        Lectio Divina ("sacred reading") is an ancient Christian prayer
        practice — reading slowly with the whole person, not just the mind.
      </p>
      <dl className="mt-5 space-y-4">
        {[
          {
            term: "Read (Lectio)",
            def: "Read the passage aloud slowly. Notice any word or phrase that draws you.",
          },
          {
            term: "Meditate (Meditatio)",
            def: "Read again. Sit quietly with that word. Let it settle.",
          },
          {
            term: "Pray (Oratio)",
            def: "Respond to God — gratitude, confession, longing — in whatever form comes.",
          },
          {
            term: "Contemplate (Contemplatio)",
            def: "Rest. Release the words. Simply be present to God.",
          },
        ].map(({ term, def }) => (
          <div key={term}>
            <dt className="font-semibold text-foreground">{term}</dt>
            <dd className="mt-0.5 text-sm text-muted-foreground">{def}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function DevotionalsPage() {
  if (!features?.devotionals) notFound();

  const plans = getAllReadingPlans();
  const activePlans = plans.filter((p) => p.isActive);
  const inactivePlans = plans.filter((p) => !p.isActive);

  const usedStyles = new Set(plans.map((p) => p.style));

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Daily Devotionals
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Scripture, every morning.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Follow a reading plan and spend a few minutes each day with the
            Bible. Subscribe to receive today&apos;s passage by email.
          </p>
        </div>
      </section>

      {activePlans.length > 0 && (
        <section className="container py-16 md:py-20">
          <h2 className="font-serif text-2xl md:text-3xl">
            Active plans
          </h2>
          <p className="mt-2 text-muted-foreground">
            These plans are running now. Read along on the site or subscribe for
            daily email delivery.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {activePlans.map((plan) => (
              <PlanCard key={plan.slug} plan={plan} />
            ))}
          </div>
        </section>
      )}

      {inactivePlans.length > 0 && (
        <section className={`container py-16 md:py-20 ${activePlans.length > 0 ? "border-t border-border" : ""}`}>
          <h2 className="font-serif text-2xl md:text-3xl">
            Upcoming plans
          </h2>
          <p className="mt-2 text-muted-foreground">
            These plans are ready but not yet active. Subscribe when they go
            live.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {inactivePlans.map((plan) => (
              <PlanCard key={plan.slug} plan={plan} />
            ))}
          </div>
        </section>
      )}

      {plans.length === 0 && (
        <section className="container py-24 md:py-32">
          <div className="mx-auto max-w-md text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h2 className="mt-6 font-serif text-2xl">No plans yet</h2>
            <p className="mt-3 text-muted-foreground">
              Reading plans will appear here once your church creates them.
              Check back soon.
            </p>
          </div>
        </section>
      )}

      {(usedStyles.has("soap") || usedStyles.has("lectio_divina")) && (
        <section className="border-t border-border bg-muted/40 py-16 md:py-20">
          <div className="container">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              How it works
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Reading methods used in these plans
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {usedStyles.has("soap") && <SoapExplainer />}
              {usedStyles.has("lectio_divina") && <LectioExplainer />}
            </div>
          </div>
        </section>
      )}

      <section className="container py-16 md:py-20">
        <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 md:p-8">
          <BookMarked className="mt-1 h-6 w-6 shrink-0 text-accent" />
          <div>
            <h3 className="font-serif text-xl">Not sure which plan to start?</h3>
            <p className="mt-2 text-muted-foreground">
              Start with any active plan — the entry pages walk you through the
              reading and any study prompts. No signup required to read on the
              site. Subscribe by email to get today&apos;s passage delivered to
              your inbox.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
