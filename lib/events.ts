// Legacy single-event type. The site now uses the recurring/one-off event
// model in /lib/calendar-data.ts, which reads from /content/events.json.
// Kept here as a type only in case any imports still reference it.

export type ChurchEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
  recurrence?: string;
};
