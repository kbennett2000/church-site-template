import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { getAllReadingPlans, getReadingPlan, getEntryForDate } from "@/content/devotionals";
import { features } from "@/content/site";
import { fetchScripture } from "@/lib/devotionals/scripture-api";
import { churchInfo } from "@/lib/church-info";
import type { ReadingPlan, ReadingPlanEntry, PassageResult } from "@/lib/devotionals/types";

export async function generateStaticParams() {
  return getAllReadingPlans().flatMap((plan) =>
    plan.entries.map((entry) => ({
      planSlug: plan.slug,
      date: entry.date,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ planSlug: string; date: string }>;
}): Promise<Metadata> {
  const { planSlug, date } = await params;
  const plan = getReadingPlan(planSlug);
  const entry = plan ? getEntryForDate(plan, date) : undefined;
  if (!plan || !entry) return {};

  const displayDate = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    title: entry.title
      ? `${entry.title} — ${plan.title}`
      : `${entry.scriptureReference} — ${plan.title}`,
    description: `${entry.scriptureReference} | ${plan.title} | ${displayDate} | ${churchInfo.name}`,
  };
}

function formatDisplayDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function SoapSection({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
        {label}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div
        className="mt-3 min-h-[80px] rounded border border-dashed border-border/60 bg-muted/30"
        aria-label="Space for journaling"
      />
    </div>
  );
}

function LectioSection({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
        {label}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function AdjacentEntry({
  plan,
  currentDate,
  direction,
}: {
  plan: ReadingPlan;
  currentDate: string;
  direction: "prev" | "next";
}) {
  const sorted = plan.entries.map((e) => e.date).sort();
  const idx = sorted.indexOf(currentDate);
  const targetIdx = direction === "prev" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= sorted.length) return null;

  const targetDate = sorted[targetIdx];
  const today = new Date().toISOString().slice(0, 10);

  if (direction === "next" && targetDate > today) {
    const displayDate = new Date(targetDate + "T12:00:00").toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric" }
    );
    return (
      <span className="flex items-center gap-1 text-sm text-muted-foreground/50 cursor-not-allowed select-none">
        {direction === "next" && <ChevronRight className="h-4 w-4" />}
        <span>Available {displayDate}</span>
      </span>
    );
  }

  const entry = getEntryForDate(plan, targetDate);
  const label = entry?.title ?? entry?.scriptureReference ?? targetDate;

  return (
    <Link
      href={`/devotionals/${plan.slug}/${targetDate}`}
      className="flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-accent transition-colors"
    >
      {direction === "prev" && <ChevronLeft className="h-4 w-4" />}
      <span className="line-clamp-1 max-w-[180px]">{label}</span>
      {direction === "next" && <ChevronRight className="h-4 w-4" />}
    </Link>
  );
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ planSlug: string; date: string }>;
}) {
  const { planSlug, date } = await params;

  if (!features?.devotionals) notFound();

  const plan = getReadingPlan(planSlug);
  if (!plan) notFound();

  const entry = getEntryForDate(plan, date);
  if (!entry) notFound();

  const today = new Date().toISOString().slice(0, 10);
  const isFuture = entry.date > today;

  if (isFuture) {
    return (
      <>
        <section className="border-b border-border bg-muted/40">
          <div className="container py-12">
            <Link
              href={`/devotionals/${plan.slug}`}
              className="text-sm text-muted-foreground hover:text-accent"
            >
              ← {plan.title}
            </Link>
          </div>
        </section>
        <section className="container py-24 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h1 className="mt-6 font-serif text-3xl">Not yet</h1>
          <p className="mt-3 text-muted-foreground">
            This entry is available on {formatDisplayDate(entry.date)}.
          </p>
          <Link
            href={`/devotionals/${plan.slug}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            ← Back to {plan.title}
          </Link>
        </section>
      </>
    );
  }

  let passage: PassageResult | null = null;
  let scriptureError = false;

  try {
    passage = await fetchScripture(entry.scriptureReference, plan.defaultTranslation);
  } catch {
    scriptureError = true;
  }

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-12 md:py-16">
          <Link
            href={`/devotionals/${plan.slug}`}
            className="text-sm text-muted-foreground hover:text-accent"
          >
            ← {plan.title}
          </Link>

          <p className="mt-6 text-sm text-muted-foreground">
            {formatDisplayDate(entry.date)}
          </p>
          <h1 className="mt-2 max-w-2xl font-serif text-4xl leading-[1.1] md:text-5xl">
            {entry.title ?? entry.scriptureReference}
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-accent">
            <BookOpen className="h-4 w-4" />
            {entry.scriptureReference} · {passage?.translation ?? plan.defaultTranslation}
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          {plan.style === "soap" && (
            <div className="mb-8 rounded-lg border border-accent/20 bg-accent/5 px-5 py-3">
              <p className="text-sm text-accent font-medium">
                S — Scripture: Read the passage below, then continue through
                Observation, Application, and Prayer.
              </p>
            </div>
          )}

          {plan.style === "lectio_divina" && (
            <div className="mb-8 rounded-lg border border-accent/20 bg-accent/5 px-5 py-3">
              <p className="text-sm text-accent font-medium">
                Lectio: Read the passage below slowly — aloud if you can. Notice
                which word or phrase stays with you.
              </p>
            </div>
          )}

          {scriptureError ? (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-900">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Scripture text unavailable</p>
                <p className="mt-1 text-sm">
                  We couldn&apos;t fetch {entry.scriptureReference} right now.
                  Please open your Bible to read the passage, then continue with
                  the reflection below.
                </p>
              </div>
            </div>
          ) : passage ? (
            <div
              className="prose prose-lg max-w-none font-serif leading-relaxed text-foreground [&_sup.verse-num]:not-prose [&_sup.verse-num]:mr-0.5 [&_sup.verse-num]:text-[0.6em] [&_sup.verse-num]:font-sans [&_sup.verse-num]:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: passage.html }}
            />
          ) : null}

          {passage?.attribution && (
            <p className="mt-4 text-xs text-muted-foreground">
              {passage.attribution}
            </p>
          )}

          {entry.leaderNotes && (
            <div className="mt-10 rounded-xl border border-border bg-muted/40 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                From the pastor
              </p>
              <div className="mt-3 text-foreground/85 whitespace-pre-line">
                {entry.leaderNotes}
              </div>
            </div>
          )}

          {plan.style === "soap" && (
            <div className="mt-10 space-y-4">
              <h2 className="font-serif text-2xl">Reflect &amp; respond</h2>
              <SoapSection
                label="O — Observation"
                description="What do you notice about this passage? What words or phrases stand out? Write down your observations."
              />
              <SoapSection
                label="A — Application"
                description="How does this passage speak to your life today? Be specific — what's one thing you can do or believe differently?"
              />
              <SoapSection
                label="P — Prayer"
                description="Respond to God in your own words. Gratitude, confession, request — whatever is honest."
              />
            </div>
          )}

          {plan.style === "lectio_divina" && (
            <div className="mt-10 space-y-4">
              <h2 className="font-serif text-2xl">The four movements</h2>
              <LectioSection
                label="Meditatio"
                description="Read the passage a second time. What word or phrase draws your attention? Sit with it quietly for a moment."
              />
              <LectioSection
                label="Oratio"
                description="Respond to God — in gratitude, longing, confession, or simply conversation. No right way to do this."
              />
              <LectioSection
                label="Contemplatio"
                description="Rest. Release the words and the effort. Simply be present to God."
              />
            </div>
          )}

          <div className="mt-12 border-t border-border pt-8">
            <div className="flex items-center justify-between">
              <AdjacentEntry plan={plan} currentDate={entry.date} direction="prev" />
              <Link
                href={`/devotionals/${plan.slug}`}
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                All entries
              </Link>
              <AdjacentEntry plan={plan} currentDate={entry.date} direction="next" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40 py-12 md:py-16">
        <div className="container max-w-lg text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Subscribe
          </p>
          <h2 className="mt-3 font-serif text-2xl">Get this delivered daily</h2>
          <p className="mt-3 text-muted-foreground">
            Receive {plan.title} in your inbox each morning. Email subscriptions
            will be available soon.
          </p>
          <button
            disabled
            title="Email subscription coming soon."
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground opacity-50 cursor-not-allowed"
          >
            Subscribe by email — coming soon
          </button>
        </div>
      </section>
    </>
  );
}
