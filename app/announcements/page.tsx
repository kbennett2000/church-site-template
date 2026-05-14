import type { Metadata } from "next";
import Link from "next/link";
import { Pin, ArrowUpRight, Megaphone } from "lucide-react";
import { churchInfo } from "@/lib/church-info";
import { getActiveAnnouncements } from "@/content/announcements";

export const metadata: Metadata = {
  title: "Announcements",
  description: `The latest news and updates from ${churchInfo.name}.`,
};

function formatPostedDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function AnnouncementsPage() {
  const items = getActiveAnnouncements();

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <Megaphone className="h-3.5 w-3.5" />
            Announcements
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            From this week&apos;s bulletin.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            News, updates, and upcoming opportunities from {churchInfo.name}.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        {items.length === 0 ? (
          <p className="text-muted-foreground">
            No announcements right now — check back soon.
          </p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {items.map((a) => (
              <li
                key={a.id}
                className="flex flex-col rounded-xl border border-border bg-card p-6 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif text-xl leading-snug">{a.title}</h2>
                  {a.pinned ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
                      <Pin className="h-2.5 w-2.5 fill-current" />
                      Pinned
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/85">{a.body}</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">
                    Posted {formatPostedDate(a.date)}
                  </span>
                  {a.link ? (
                    <Link
                      href={a.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                    >
                      {a.linkLabel || "Learn more"}
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
