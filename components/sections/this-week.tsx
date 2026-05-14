import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";
import { upcomingEventsAfter } from "@/lib/calendar-data";

const TODAY_ISO = "2026-05-13";

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.getDate(),
  };
}

export function ThisWeek() {
  const events = upcomingEventsAfter(TODAY_ISO, 5);

  if (events.length === 0) return null;

  return (
    <section className="container py-20 md:py-28">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            This week at church
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            What&apos;s coming up.
          </h2>
        </div>
        <Link
          href="/calendar"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-accent"
        >
          <Calendar className="h-4 w-4" />
          Full calendar →
        </Link>
      </div>

      <ul className="mt-12 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {events.map((event) => {
          const d = formatDate(event.date);
          return (
            <li
              key={event.id}
              className="group flex items-start gap-5 p-5 transition hover:bg-muted/40 sm:items-center sm:p-6"
            >
              <div className="grid w-16 shrink-0 place-items-center rounded-md border border-border bg-background py-2 text-center sm:w-20">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                  {d.month}
                </span>
                <span className="font-serif text-2xl leading-none sm:text-3xl">
                  {d.day}
                </span>
                <span className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {d.weekday}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg leading-tight sm:text-xl">
                  {event.title}
                </h3>
                {event.description ? (
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {event.description}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </span>
                  {event.location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
