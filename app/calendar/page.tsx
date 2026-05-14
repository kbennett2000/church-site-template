import type { Metadata } from "next";
import { CalendarView } from "@/components/sections/calendar-view";
import { oneOffEvents } from "@/lib/calendar-data";
import { churchInfo } from "@/lib/church-info";

export const metadata: Metadata = {
  title: "Calendar",
  description: `Everything happening at ${churchInfo.name} — Sunday services, midweek programs, and special events.`,
};

const TODAY_ISO = "2026-05-13";

export default function CalendarPage() {
  const featured = oneOffEvents.filter((e) => e.isFeatured).slice(0, 3);

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Calendar
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            What&apos;s on this season.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Sundays, midweek programs, and the occasional potluck. Click any
            event for details, an RSVP, or to add it to your phone&apos;s calendar.
          </p>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="container pt-16 md:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Coming up
          </p>
          <h2 className="mt-3 font-serif text-2xl md:text-3xl">
            Special events on the horizon.
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {featured.map((ev) => (
              <li
                key={ev.id}
                className="rounded-xl border border-border bg-card p-6"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-accent">
                  {new Date(ev.date + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h3 className="mt-2 font-serif text-xl">{ev.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {ev.time} · {ev.location}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="container py-16 md:py-20">
        <CalendarView initialDate={TODAY_ISO} />
      </section>
    </>
  );
}
