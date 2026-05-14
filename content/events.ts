import type { RecurringEvent } from "@/lib/calendar-data";
import data from "./events.json";

export const recurringEvents: RecurringEvent[] = data.events as RecurringEvent[];
