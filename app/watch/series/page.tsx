import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookMarked } from "lucide-react";
import { getAllSeries } from "@/content/sermons-series";
import { churchInfo } from "@/lib/church-info";

export const metadata: Metadata = {
  title: "Browse by Series",
  description: `Sermon series from ${churchInfo.name} — browse messages grouped by series.`,
};

function formatLongDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function SeriesIndexPage() {
  const series = getAllSeries();

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <Link
            href="/watch"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All sermons
          </Link>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Watch & Listen
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Browse by series.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Messages grouped into the series they were preached in. Tap a
            series to see all its sermons in order.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        {series.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <BookMarked className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-4 font-serif text-xl">
              This church doesn&apos;t group sermons into series.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You can still browse every sermon in the archive.
            </p>
            <Link
              href="/watch"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Browse all sermons →
            </Link>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {series.map((s) => {
              const count = s.sermons.length;
              return (
                <li key={s.slug}>
                  <Link
                    href={`/watch/series/${s.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition hover:shadow-md"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {count} {count === 1 ? "sermon" : "sermons"} · most
                      recent {formatLongDate(s.latestDate)}
                    </p>
                    <h2 className="mt-3 font-serif text-2xl leading-snug transition group-hover:text-accent">
                      {s.name}
                    </h2>
                    <p className="mt-auto pt-6 text-sm font-medium text-accent">
                      View series →
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
