import Link from "next/link";
import Image from "next/image";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLatestSermon } from "@/content/sermons";

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function LatestSermon() {
  const latestSermon = getLatestSermon();
  if (!latestSermon) return null;
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Latest sermon
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              This past Sunday.
            </h2>
          </div>
          <Link
            href="/watch"
            className="text-sm font-medium text-foreground/80 hover:text-accent"
          >
            All sermons →
          </Link>
        </div>

        <div className="mt-12 grid gap-8 overflow-hidden rounded-xl border border-border bg-card md:grid-cols-5">
          <Link
            href={`/watch/${latestSermon.id}`}
            className="group relative aspect-video md:col-span-3 md:aspect-auto"
            aria-label={`Watch ${latestSermon.title}`}
          >
            <Image
              src={latestSermon.thumbnail}
              alt={latestSermon.title}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg transition group-hover:scale-110 md:h-20 md:w-20">
                <Play className="h-7 w-7 translate-x-0.5 fill-current" />
              </span>
            </div>
          </Link>

          <div className="flex flex-col justify-between gap-6 p-8 md:col-span-2 md:p-10">
            <div>
              {latestSermon.series ? (
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  {latestSermon.series}
                </p>
              ) : null}
              <h3 className="mt-2 font-serif text-2xl leading-snug md:text-3xl">
                {latestSermon.title}
              </h3>
              <p className="mt-4 text-sm text-muted-foreground">
                {formatDate(latestSermon.date)} · {latestSermon.speaker}
              </p>
              <p className="mt-4 text-foreground/80">
                {latestSermon.description}
              </p>
            </div>
            <Button asChild>
              <Link href={`/watch/${latestSermon.id}`}>
                Watch the sermon
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
