import Link from "next/link";
import { Pin, ArrowUpRight, Megaphone } from "lucide-react";
import { getActiveAnnouncements } from "@/content/announcements";

function formatPostedDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function Announcements() {
  const items = getActiveAnnouncements();
  if (items.length === 0) return null;

  return (
    <section className="container py-20 md:py-28">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <Megaphone className="h-3.5 w-3.5" />
            Announcements
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            From this week&apos;s bulletin.
          </h2>
        </div>
      </div>

      <ul className="mt-12 grid gap-5 md:grid-cols-2">
        {items.map((a) => (
          <li
            key={a.id}
            className="flex flex-col rounded-xl border border-border bg-card p-6 transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-xl leading-snug">{a.title}</h3>
              {a.pinned ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  <Pin className="h-2.5 w-2.5 fill-current" />
                  Pinned
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-sm text-foreground/85">{a.body}</p>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">
                Posted {formatPostedDate(a.date)}
              </span>
              {a.link ? (
                <Link
                  href={a.link}
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
    </section>
  );
}
