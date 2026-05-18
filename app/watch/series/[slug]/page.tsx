import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play, Headphones } from "lucide-react";
import { getAllSeries, getSeries } from "@/content/sermons-series";
import { churchInfo } from "@/lib/church-info";

type Params = { slug: string };

export function generateStaticParams() {
  return getAllSeries().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) return { title: "Series not found" };
  return {
    title: series.name,
    description: `Sermons in the "${series.name}" series at ${churchInfo.name}.`,
  };
}

function formatLongDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) notFound();

  // Within-series order: ascending (oldest first) so sequential series read
  // part 1 → N. Flip the comparator to reverse for newest-first.
  // Single-line change by design.
  const sermons = [...series.sermons].sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <Link
            href="/watch/series"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All series
          </Link>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Sermon series
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            {series.name}
          </h1>
          <p className="mt-5 text-sm text-muted-foreground">
            {sermons.length} {sermons.length === 1 ? "sermon" : "sermons"} ·
            most recent {formatLongDate(series.latestDate)}
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.map((s) => (
            <li
              key={s.id}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-md"
            >
              <Link
                href={`/watch/${s.id}`}
                className="relative block aspect-video overflow-hidden"
                aria-label={`Watch ${s.title}`}
              >
                <Image
                  src={s.thumbnail}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent" />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg transition group-hover:scale-110">
                    <Play className="h-5 w-5 translate-x-0.5 fill-current" />
                  </span>
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {formatLongDate(s.date)} · {s.speaker}
                </p>
                <h3 className="mt-2 font-serif text-lg leading-snug">
                  <Link href={`/watch/${s.id}`} className="hover:text-accent">
                    {s.title}
                  </Link>
                </h3>
                {s.scripture ? (
                  <p className="mt-1.5 text-sm font-medium text-accent">
                    {s.scripture}
                  </p>
                ) : null}
                {s.description ? (
                  <p
                    className="mt-3 line-clamp-2 text-sm text-muted-foreground"
                    title={s.description}
                  >
                    {s.description}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                  <Link
                    href={`/watch/${s.id}`}
                    className="inline-flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Watch
                  </Link>
                  <a
                    href={s.audioUrl}
                    className="inline-flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
                  >
                    <Headphones className="h-3.5 w-3.5" />
                    Listen
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
