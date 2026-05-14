"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Headphones, FileText, X, BookMarked } from "lucide-react";
import type { Sermon } from "@/lib/sermons";

function formatShortDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function WatchArchive({ sermons }: { sermons: Sermon[] }) {
  const seriesOptions = useMemo(
    () => unique(sermons.map((s) => s.series)).sort(),
    [sermons]
  );
  const speakerOptions = useMemo(
    () => unique(sermons.map((s) => s.speaker)).sort(),
    [sermons]
  );
  const bookOptions = useMemo(
    () => unique(sermons.map((s) => s.book)).sort(),
    [sermons]
  );

  const [series, setSeries] = useState("all");
  const [speaker, setSpeaker] = useState("all");
  const [book, setBook] = useState("all");

  const filtered = useMemo(
    () =>
      sermons.filter(
        (s) =>
          (series === "all" || s.series === series) &&
          (speaker === "all" || s.speaker === speaker) &&
          (book === "all" || s.book === book)
      ),
    [sermons, series, speaker, book]
  );

  const anyActive = series !== "all" || speaker !== "all" || book !== "all";

  function clear() {
    setSeries("all");
    setSpeaker("all");
    setBook("all");
  }

  return (
    <div>
      <div className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Filter
            label="Series"
            value={series}
            onChange={setSeries}
            options={seriesOptions}
            allLabel="All series"
          />
          <Filter
            label="Speaker"
            value={speaker}
            onChange={setSpeaker}
            options={speakerOptions}
            allLabel="All speakers"
          />
          <Filter
            label="Book of the Bible"
            value={book}
            onChange={setBook}
            options={bookOptions}
            allLabel="All books"
          />
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "sermon" : "sermons"}
            {anyActive ? " matching" : " total"}
          </p>
          {anyActive ? (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <BookMarked className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-4 font-serif text-xl">No sermons match those filters.</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try widening your search — or{" "}
            <button onClick={clear} className="text-accent hover:underline">
              clear filters
            </button>
            .
          </p>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
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
                <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
                  {s.series}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {formatShortDate(s.date)} · {s.speaker}
                </p>
                <h3 className="mt-2 font-serif text-lg leading-snug">
                  <Link
                    href={`/watch/${s.id}`}
                    className="hover:text-accent"
                  >
                    {s.title}
                  </Link>
                </h3>
                <p className="mt-1.5 text-sm font-medium text-accent">
                  {s.scripture}
                </p>
                <p
                  className="mt-3 line-clamp-2 text-sm text-muted-foreground"
                  title={s.description}
                >
                  {s.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                  <CardAction href={`/watch/${s.id}`} icon={Play} label="Watch" primary />
                  <CardAction href={s.audioUrl} icon={Headphones} label="Listen" />
                  <CardAction
                    href={s.notesUrl}
                    icon={FileText}
                    label="Notes"
                    download
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-11 w-full appearance-none rounded-md border border-input bg-background px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b635a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1.25rem",
          paddingRight: "2.5rem",
        }}
      >
        <option value="all">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function CardAction({
  href,
  icon: Icon,
  label,
  primary,
  download,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  primary?: boolean;
  download?: boolean;
}) {
  const baseClass =
    "inline-flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition";
  const className = primary
    ? `${baseClass} bg-primary text-primary-foreground hover:bg-primary/90`
    : `${baseClass} border border-border text-foreground/80 hover:bg-muted hover:text-foreground`;

  return (
    <Link
      href={href}
      className={className}
      {...(download ? { download: "" } : {})}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
