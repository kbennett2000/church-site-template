import { churchInfo } from "@/lib/church-info";
import { recurringEvents } from "@/content/events";

export type RecurrenceRule =
  | { kind: "weekly"; dayOfWeek: number }
  | { kind: "nth-of-month"; n: number; dayOfWeek: number }
  | { kind: "last-of-month"; dayOfWeek: number };

export type RecurringEvent = {
  id: string;
  title: string;
  time: string;
  durationMinutes: number;
  location: string;
  description: string;
  rule: RecurrenceRule;
  needsRsvp?: boolean;
};

export type OneOffEvent = {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  durationMinutes: number;
  location: string;
  description: string;
  needsRsvp?: boolean;
  isFeatured?: boolean;
};

export type EventInstance = {
  id: string;
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  location: string;
  description: string;
  needsRsvp?: boolean;
  isFeatured?: boolean;
  isRecurring: boolean;
};

// One-off events (e.g. "VBS week", "Easter sunrise service") that don't fit
// the recurring-events model in /content/events.json. Empty by default — the
// featured "Coming up" UI on /calendar simply doesn't render until populated.
// Migrate this to /content/ once adopting churches start using it heavily.
export const oneOffEvents: OneOffEvent[] = [];

export { recurringEvents };

function nthDayOfMonth(
  year: number,
  month: number,
  n: number,
  dow: number
): number | null {
  const firstDow = new Date(year, month, 1).getDay();
  const offset = ((dow - firstDow + 7) % 7) + 1;
  const day = offset + (n - 1) * 7;
  const lastDay = new Date(year, month + 1, 0).getDate();
  return day > lastDay ? null : day;
}

function lastDayOfMonth(year: number, month: number, dow: number): number {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const lastDow = new Date(year, month, lastDay).getDay();
  const offset = (lastDow - dow + 7) % 7;
  return lastDay - offset;
}

function isoDate(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

const DAY_NAME_TO_DOW: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

function serviceEvents(): RecurringEvent[] {
  return churchInfo.services
    .filter((s) => s.day && s.time)
    .flatMap((s, i) => {
      const dow = DAY_NAME_TO_DOW[s.day.toLowerCase()];
      if (dow === undefined) return [];
      const title = s.name ? s.name : `${s.day} Service`;
      return [{
        id: `service-${i}`,
        title,
        time: s.time,
        durationMinutes: 75,
        location: "",
        description: s.note ?? "",
        rule: { kind: "weekly" as const, dayOfWeek: dow },
      }];
    });
}

export function eventsForMonth(year: number, month: number): EventInstance[] {
  const out: EventInstance[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  const allRecurring = [...serviceEvents(), ...recurringEvents];

  for (const r of allRecurring) {
    if (r.rule.kind === "weekly") {
      for (let day = 1; day <= lastDay; day++) {
        if (new Date(year, month, day).getDay() === r.rule.dayOfWeek) {
          out.push({
            id: `${r.id}-${isoDate(year, month, day)}`,
            title: r.title,
            date: isoDate(year, month, day),
            time: r.time,
            durationMinutes: r.durationMinutes,
            location: r.location,
            description: r.description,
            needsRsvp: r.needsRsvp,
            isRecurring: true,
          });
        }
      }
    } else if (r.rule.kind === "nth-of-month") {
      const day = nthDayOfMonth(year, month, r.rule.n, r.rule.dayOfWeek);
      if (day) {
        out.push({
          id: `${r.id}-${isoDate(year, month, day)}`,
          title: r.title,
          date: isoDate(year, month, day),
          time: r.time,
          durationMinutes: r.durationMinutes,
          location: r.location,
          description: r.description,
          needsRsvp: r.needsRsvp,
          isRecurring: true,
        });
      }
    } else if (r.rule.kind === "last-of-month") {
      const day = lastDayOfMonth(year, month, r.rule.dayOfWeek);
      out.push({
        id: `${r.id}-${isoDate(year, month, day)}`,
        title: r.title,
        date: isoDate(year, month, day),
        time: r.time,
        durationMinutes: r.durationMinutes,
        location: r.location,
        description: r.description,
        needsRsvp: r.needsRsvp,
        isRecurring: true,
      });
    }
  }

  for (const o of oneOffEvents) {
    const start = new Date(o.date + "T00:00:00");
    const end = new Date((o.endDate ?? o.date) + "T00:00:00");
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getFullYear() === year && d.getMonth() === month) {
        out.push({
          id: `${o.id}-${isoDate(year, month, d.getDate())}`,
          title: o.title,
          date: isoDate(year, month, d.getDate()),
          time: o.time,
          durationMinutes: o.durationMinutes,
          location: o.location,
          description: o.description,
          needsRsvp: o.needsRsvp,
          isFeatured: o.isFeatured,
          isRecurring: false,
        });
      }
    }
  }

  return out.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    return parse12hMinutes(a.time) - parse12hMinutes(b.time);
  });
}

export function upcomingEventsAfter(
  fromIso: string,
  count: number
): EventInstance[] {
  const from = new Date(fromIso + "T00:00:00");
  let year = from.getFullYear();
  let month = from.getMonth();
  const out: EventInstance[] = [];

  for (let i = 0; i < 4 && out.length < count; i++) {
    const monthEvents = eventsForMonth(year, month);
    for (const ev of monthEvents) {
      if (ev.date >= fromIso) out.push(ev);
      if (out.length >= count) break;
    }
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return out.slice(0, count);
}

export function parse12hMinutes(s: string): number {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const isPm = m[3].toUpperCase() === "PM";
  if (h === 12) h = 0;
  if (isPm) h += 12;
  return h * 60 + min;
}
