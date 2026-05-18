import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { marked } from "marked";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllSermons, getSermon } from "@/content/sermons";

type Params = { id: string };

export function generateStaticParams() {
  return getAllSermons().map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const sermon = getSermon(id);
  if (!sermon) return { title: "Sermon not found" };
  return {
    title: sermon.title,
    description: sermon.description,
  };
}

function formatLongDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function SermonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const sermon = getSermon(id);
  if (!sermon) notFound();

  // Find neighbors for prev/next navigation. allSermons is sorted newest-first.
  const all = getAllSermons();
  const idx = all.findIndex((s) => s.id === id);
  const newer = idx > 0 ? all[idx - 1] : undefined;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  const hasAudio = sermon.audioUrl && sermon.audioUrl !== "#";
  const notesHtml = sermon.notes ? await marked.parse(sermon.notes) : "";

  return (
    <>
      <section className="container py-10 md:py-14">
        <Link
          href="/watch"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All sermons
        </Link>

        <div className="mt-7 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {sermon.series}
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight md:text-4xl lg:text-5xl">
            {sermon.title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {formatLongDate(sermon.date)} · {sermon.speaker}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-accent">
            <BookOpen className="h-4 w-4" />
            {sermon.scripture}
          </p>
        </div>

        <div className="mt-10 aspect-video overflow-hidden rounded-xl border border-border bg-card">
          {sermon.youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${sermon.youtubeId}`}
              title={sermon.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={sermon.thumbnail}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 grid place-items-center bg-foreground/55">
                <p className="rounded-md bg-background/95 px-4 py-2 text-sm font-medium">
                  Video coming soon
                </p>
              </div>
            </div>
          )}
        </div>

        {sermon.description ? (
          <div className="mt-10 max-w-3xl">
            <p className="text-lg leading-relaxed text-foreground/90">
              {sermon.description}
            </p>
          </div>
        ) : null}

        {hasAudio ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={sermon.audioUrl}>
                <Headphones className="h-4 w-4" />
                Listen (audio)
              </a>
            </Button>
          </div>
        ) : null}

        {notesHtml ? (
          <div className="mt-12 max-w-3xl border-t border-border pt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Sermon notes
            </p>
            <h2 className="mt-3 font-serif text-2xl leading-tight md:text-3xl">
              Outline &amp; notes
            </h2>
            <div
              className="prose prose-stone mt-6 max-w-none"
              dangerouslySetInnerHTML={{ __html: notesHtml }}
            />
          </div>
        ) : null}
      </section>

      {newer || older ? (
        <section className="border-t border-border bg-muted/40 py-14 md:py-16">
          <div className="container grid gap-5 md:grid-cols-2">
            {older ? (
              <Link
                href={`/watch/${older.id}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition hover:shadow-md"
              >
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <ArrowLeft className="h-3 w-3" />
                  Older sermon
                </p>
                <p className="mt-3 font-serif text-lg leading-snug transition group-hover:text-accent">
                  {older.title}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatLongDate(older.date)} · {older.speaker}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {newer ? (
              <Link
                href={`/watch/${newer.id}`}
                className="group flex flex-col items-end rounded-xl border border-border bg-card p-6 text-right transition hover:shadow-md"
              >
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Newer sermon
                  <ArrowRight className="h-3 w-3" />
                </p>
                <p className="mt-3 font-serif text-lg leading-snug transition group-hover:text-accent">
                  {newer.title}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatLongDate(newer.date)} · {newer.speaker}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      ) : null}
    </>
  );
}
