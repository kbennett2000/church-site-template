"use client";

import { useEffect, useState } from "react";
import { X, Clock, MapPin, Calendar, Repeat, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EventInstance } from "@/lib/calendar-data";
import { parse12hMinutes } from "@/lib/calendar-data";
import { churchInfo } from "@/lib/church-info";

function formatLongDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIcsFloating(iso: string, time: string, plusMinutes = 0) {
  const [y, m, d] = iso.split("-").map(Number);
  const startMinutes = parse12hMinutes(time) + plusMinutes;
  const hh = Math.floor(startMinutes / 60) % 24;
  const mm = startMinutes % 60;
  return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
}

function buildIcs(event: EventInstance) {
  const dtStart = toIcsFloating(event.date, event.time);
  const dtEnd = toIcsFloating(event.date, event.time, event.durationMinutes);
  const escape = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${churchInfo.name}//Calendar//EN`,
    "BEGIN:VEVENT",
    `UID:${event.id}@${churchInfo.email.split("@")[1] ?? "example.church"}`,
    `DTSTAMP:${dtStart}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(event.description)}`,
    `LOCATION:${escape(`${event.location} · ${churchInfo.address.full}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcs(event: EventInstance) {
  const blob = new Blob([buildIcs(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function EventModal({
  event,
  onClose,
}: {
  event: EventInstance | null;
  onClose: () => void;
}) {
  const [rsvpCount, setRsvpCount] = useState("2");
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    if (!event) return;
    setRsvpSubmitted(false);
    setRsvpName("");
    setRsvpCount("2");
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [event, onClose]);

  if (!event) return null;

  function onRsvp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("[RSVP]", { eventId: event!.id, name: rsvpName, count: rsvpCount });
    setRsvpSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-foreground/55 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-6 pb-5">
          <div className="min-w-0">
            {event.isRecurring ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <Repeat className="h-3 w-3" />
                Recurring
              </span>
            ) : event.isFeatured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-accent">
                Special event
              </span>
            ) : null}
            <h3
              id="event-modal-title"
              className="mt-2 font-serif text-2xl leading-snug"
            >
              {event.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-6 text-sm">
          <Row icon={Calendar}>{formatLongDate(event.date)}</Row>
          <Row icon={Clock}>{event.time}</Row>
          <Row icon={MapPin}>{event.location}</Row>
          <p className="pt-2 text-foreground/85">{event.description}</p>
        </div>

        {event.needsRsvp ? (
          <div className="border-t border-border bg-muted/40 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              RSVP
            </p>
            <h4 className="mt-1 font-serif text-lg">
              {rsvpSubmitted
                ? "Thanks — we’re saving you a seat."
                : "Let us know how many are coming."}
            </h4>

            {rsvpSubmitted ? (
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary">
                <Check className="h-4 w-4" />
                You&apos;re on the list.
              </p>
            ) : (
              <form
                onSubmit={onRsvp}
                className="mt-4 grid gap-3 sm:grid-cols-[1fr_120px_auto]"
              >
                <Input
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-label="Your name"
                />
                <Input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={rsvpCount}
                  onChange={(e) => setRsvpCount(e.target.value)}
                  placeholder="# attending"
                  aria-label="Number attending"
                />
                <Button type="submit" variant="accent">
                  RSVP
                </Button>
              </form>
            )}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-border p-6 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => downloadIcs(event)}>
            <Download className="h-4 w-4" />
            Add to my calendar
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-foreground/85">
      <Icon className="h-4 w-4 text-accent" />
      <span>{children}</span>
    </div>
  );
}
