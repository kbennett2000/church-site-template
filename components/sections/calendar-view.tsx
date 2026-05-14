"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { eventsForMonth, type EventInstance } from "@/lib/calendar-data";
import { EventModal } from "@/components/sections/event-modal";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfCalendarGrid(year: number, month: number): Date {
  const first = new Date(year, month, 1);
  const d = new Date(first);
  d.setDate(first.getDate() - first.getDay());
  return d;
}

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

export function CalendarView({ initialDate }: { initialDate: string }) {
  const init = new Date(initialDate + "T12:00:00");
  const [year, setYear] = useState(init.getFullYear());
  const [month, setMonth] = useState(init.getMonth());
  const [selected, setSelected] = useState<EventInstance | null>(null);

  const events = useMemo(() => eventsForMonth(year, month), [year, month]);
  const byDate = useMemo(() => {
    const map = new Map<string, EventInstance[]>();
    for (const e of events) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return map;
  }, [events]);

  const todayIso = isoDate(new Date());

  const gridStart = startOfCalendarGrid(year, month);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function goPrev() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }
  function goNext() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }
  function goToday() {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth());
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border p-4 md:p-5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous month"
              className="grid h-10 w-10 place-items-center rounded-md hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next month"
              className="grid h-10 w-10 place-items-center rounded-md hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goToday}
              className="ml-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
            >
              Today
            </button>
          </div>
          <h2 className="font-serif text-xl md:text-2xl">{monthLabel}</h2>
          <div className="w-[156px]" aria-hidden="true" />
        </div>

        <div className="hidden grid-cols-7 border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-2 py-3 text-center">
              {d}
            </div>
          ))}
        </div>

        <div className="hidden grid-cols-7 grid-rows-6 divide-x divide-y divide-border md:grid">
          {days.map((d, i) => {
            const inMonth = d.getMonth() === month;
            const iso = isoDate(d);
            const cellEvents = byDate.get(iso) ?? [];
            const isToday = iso === todayIso;
            return (
              <div
                key={i}
                className={
                  "relative min-h-[120px] p-2 " +
                  (inMonth ? "bg-card" : "bg-muted/30")
                }
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span
                    className={
                      "inline-grid h-7 w-7 place-items-center rounded-full text-sm " +
                      (isToday
                        ? "bg-accent font-semibold text-accent-foreground"
                        : inMonth
                          ? "text-foreground"
                          : "text-muted-foreground/70")
                    }
                  >
                    {d.getDate()}
                  </span>
                </div>

                <ul className="space-y-1">
                  {cellEvents.slice(0, 3).map((ev) => (
                    <li key={ev.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(ev)}
                        className={
                          "block w-full truncate rounded px-1.5 py-1 text-left text-[11px] font-medium transition " +
                          (ev.isFeatured
                            ? "bg-accent/15 text-accent hover:bg-accent/25"
                            : ev.needsRsvp
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : "bg-muted text-foreground/80 hover:bg-muted/70")
                        }
                      >
                        <span className="font-mono text-[10px] opacity-70">
                          {ev.time.replace(/:00/, "").replace(" ", "")}
                        </span>{" "}
                        {ev.title}
                      </button>
                    </li>
                  ))}
                  {cellEvents.length > 3 ? (
                    <li>
                      <button
                        type="button"
                        onClick={() => setSelected(cellEvents[3])}
                        className="inline-flex items-center gap-0.5 px-1.5 text-[11px] font-medium text-muted-foreground hover:text-accent"
                      >
                        <Plus className="h-3 w-3" />
                        {cellEvents.length - 3} more
                      </button>
                    </li>
                  ) : null}
                </ul>
              </div>
            );
          })}
        </div>

        <ul className="divide-y divide-border md:hidden">
          {events.length === 0 ? (
            <li className="p-6 text-center text-sm text-muted-foreground">
              No events this month.
            </li>
          ) : null}
          {events.map((ev) => (
            <li key={ev.id}>
              <button
                type="button"
                onClick={() => setSelected(ev)}
                className="flex w-full items-start gap-4 p-4 text-left hover:bg-muted/40"
              >
                <MobileDateBlock iso={ev.date} highlight={ev.date === todayIso} />
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-base leading-tight">{ev.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ev.time} · {ev.location}
                  </p>
                </div>
                {ev.needsRsvp ? (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    RSVP
                  </span>
                ) : ev.isFeatured ? (
                  <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                    Special
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <Legend className="bg-accent/15 text-accent">Special event</Legend>
        <Legend className="bg-primary/10 text-primary">RSVP needed</Legend>
        <Legend className="bg-muted text-foreground/80">Regular gathering</Legend>
      </div>

      <EventModal event={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function MobileDateBlock({ iso, highlight }: { iso: string; highlight?: boolean }) {
  const d = new Date(iso + "T12:00:00");
  return (
    <div
      className={
        "grid w-14 shrink-0 place-items-center rounded-md border py-1.5 text-center " +
        (highlight
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-background")
      }
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider">
        {d.toLocaleDateString("en-US", { month: "short" })}
      </span>
      <span className="font-serif text-xl leading-none">{d.getDate()}</span>
      <span className="text-[10px] uppercase tracking-wider opacity-80">
        {d.toLocaleDateString("en-US", { weekday: "short" })}
      </span>
    </div>
  );
}

function Legend({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${className}`} aria-hidden="true" />
      {children}
    </span>
  );
}
