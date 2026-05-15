import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  ReadingPlan,
  ReadingPlanEntry,
  DevotionalStyle,
  BibleTranslation,
} from "@/lib/devotionals/types";

// Reads reading plan markdown files from /content/reading-plans/ on every call.
// Files in subdirectories (e.g. _examples/) are intentionally excluded —
// the readdirSync with the .md filter skips directory entries automatically.
//
// Pattern mirrors /content/sermons.ts: functions not top-level const so that
// TinaCMS edits in dev reload without restarting the server.

const PLANS_DIR = path.join(process.cwd(), "content/reading-plans");

function isoDate(value: unknown): string {
  if (typeof value === "string") return value.slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return "";
}

function parseEntry(e: Record<string, unknown>): ReadingPlanEntry {
  return {
    date: isoDate(e.date),
    scriptureReference: String(e.scriptureReference ?? ""),
    title: e.title ? String(e.title) : undefined,
    leaderNotes: e.leaderNotes ? String(e.leaderNotes) : undefined,
  };
}

function loadAll(): ReadingPlan[] {
  if (!fs.existsSync(PLANS_DIR)) return [];

  return fs
    .readdirSync(PLANS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(PLANS_DIR, file), "utf-8");
      const { data, content } = matter(raw);

      const entries: ReadingPlanEntry[] = (
        (data.entries as Record<string, unknown>[] | undefined) ?? []
      )
        .map(parseEntry)
        .filter((e) => e.date && e.scriptureReference)
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        slug: String(data.slug ?? file.replace(/\.md$/, "")),
        title: String(data.title ?? ""),
        description: content.trim(),
        style: (data.style ?? "simple") as DevotionalStyle,
        defaultTranslation: (data.defaultTranslation ?? "WEB") as BibleTranslation,
        startDate: isoDate(data.startDate),
        endDate: isoDate(data.endDate),
        isActive: Boolean(data.isActive),
        entries,
      };
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getAllReadingPlans(): ReadingPlan[] {
  return loadAll();
}

export function getActiveReadingPlans(): ReadingPlan[] {
  return loadAll().filter((p) => p.isActive);
}

export function getReadingPlan(slug: string): ReadingPlan | undefined {
  return loadAll().find((p) => p.slug === slug);
}

/** Return the entry for a specific date, or undefined if none exists. */
export function getEntryForDate(
  plan: ReadingPlan,
  date: string
): ReadingPlanEntry | undefined {
  return plan.entries.find((e) => e.date === date);
}

/** Return today's entry for a plan using local server date (YYYY-MM-DD). */
export function getTodayEntry(plan: ReadingPlan): ReadingPlanEntry | undefined {
  const today = new Date().toISOString().slice(0, 10);
  return getEntryForDate(plan, today);
}

/** Total number of days in the plan (entries count). */
export function planDurationDays(plan: ReadingPlan): number {
  return plan.entries.length;
}

/** Human-readable duration label, e.g. "30 days" or "90 days". */
export function planDurationLabel(plan: ReadingPlan): string {
  const days = planDurationDays(plan);
  return `${days} day${days === 1 ? "" : "s"}`;
}
