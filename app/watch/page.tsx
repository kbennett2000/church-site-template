import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Headphones,
  Youtube,
  Rss,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllSermons, getLatestSermon } from "@/content/sermons";
import { getAllSeries } from "@/content/sermons-series";
import { churchInfo } from "@/lib/church-info";
import { findSocial } from "@/lib/social";
import { WatchArchive } from "@/components/sections/watch-archive";

export const metadata: Metadata = {
  title: "Watch",
  description: `Sermons from ${churchInfo.name} — watch the latest message, browse the archive by series or book of the Bible, or subscribe to the podcast.`,
};

function formatLongDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function WatchPage() {
  const allSermons = getAllSermons();
  const latestSermon = getLatestSermon();
  const archiveSermons = allSermons.slice(1);
  const hasSeries = getAllSeries().length > 0;
  const youtubeSocial = findSocial(churchInfo.social, "youtube");

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Watch & Listen
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Every Sunday, the Bible — taught and held close.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Catch the latest message, browse the archive, or read the pastor&apos;s sermon notes to chew on through the week.
          </p>
        </div>
      </section>

      {latestSermon ? (
      <section className="container py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Featured · This past Sunday
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Start here.
            </h2>
          </div>
          <Link
            href={`/watch/${latestSermon.id}`}
            className="text-sm font-medium text-foreground/80 hover:text-accent"
          >
            Open this sermon →
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid lg:grid-cols-5">
            <Link
              href={`/watch/${latestSermon.id}`}
              aria-label={`Watch ${latestSermon.title}`}
              className="group relative block aspect-video lg:col-span-3 lg:aspect-auto"
            >
              <Image
                src={latestSermon.thumbnail}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-accent text-accent-foreground shadow-xl transition group-hover:scale-110 md:h-24 md:w-24">
                  <Play className="h-8 w-8 translate-x-0.5 fill-current md:h-10 md:w-10" />
                </span>
              </div>
              {latestSermon.series ? (
                <span className="absolute left-5 top-5 inline-flex items-center rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                  {latestSermon.series}
                </span>
              ) : null}
            </Link>

            <div className="flex flex-col justify-between gap-6 p-8 lg:col-span-2 lg:p-10">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {formatLongDate(latestSermon.date)} · {latestSermon.speaker}
                </p>
                <h3 className="mt-3 font-serif text-2xl leading-snug md:text-3xl">
                  {latestSermon.title}
                </h3>
                <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-accent">
                  <BookOpen className="h-4 w-4" />
                  {latestSermon.scripture}
                </p>
                <p className="mt-5 text-foreground/85">
                  {latestSermon.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={`/watch/${latestSermon.id}`}>
                    <Play className="h-4 w-4" />
                    Watch
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <a href={latestSermon.audioUrl}>
                    <Headphones className="h-4 w-4" />
                    Listen
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : null}

      <section className="bg-muted/40 py-16 md:py-20">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Sermon archive
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                Browse the back catalog.
              </h2>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <p className="max-w-md text-sm text-muted-foreground">
                Filter by series, speaker, or book of the Bible.
              </p>
              {hasSeries ? (
                <Link
                  href="/watch/series"
                  className="text-sm font-medium text-foreground/80 hover:text-accent"
                >
                  Browse by series →
                </Link>
              ) : null}
            </div>
          </div>

          <div className="mt-10">
            <WatchArchive sermons={archiveSermons} />
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
          <div
            className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--accent)),transparent_55%)]"
            aria-hidden="true"
          />
          <div className="relative grid gap-10 p-10 md:grid-cols-2 md:p-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                Subscribe
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                Take Sunday with you.
              </h2>
              <p className="mt-4 max-w-md text-primary-foreground/85">
                New sermons go up Sunday afternoon. Subscribe on YouTube for video, or in your podcast app for the audio — whatever fits your week.
              </p>
            </div>

            <div className="grid gap-4 self-center">
              {youtubeSocial && (
                <SubscribeCard
                  icon={Youtube}
                  title="On YouTube"
                  description="Video of every Sunday sermon, plus the weekly livestream."
                  href={youtubeSocial.url}
                  cta="Open YouTube"
                />
              )}
              <SubscribeCard
                icon={Rss}
                title="Sermon Podcast"
                description="Audio in Apple Podcasts, Spotify, or any podcast player."
                href="/feed/sermons.xml"
                cta="Copy podcast feed"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SubscribeCard({
  icon: Icon,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="group flex items-start gap-4 rounded-lg border border-primary-foreground/15 bg-primary-foreground/[0.04] p-5 transition hover:bg-primary-foreground/[0.08]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <p className="font-serif text-lg">{title}</p>
        <p className="mt-0.5 text-sm text-primary-foreground/75">
          {description}
        </p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 text-primary-foreground/60 transition group-hover:translate-x-0.5 group-hover:text-primary-foreground" />
      <span className="sr-only">{cta}</span>
    </a>
  );
}
