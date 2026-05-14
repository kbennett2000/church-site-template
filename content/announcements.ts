import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Announcement } from "@/lib/announcements";

// Function exports (not top-level const) so CMS edits hot-reload in dev.
// See content/sermons.ts for the rationale.

const DIR = path.join(process.cwd(), "content/announcements");

function isoDate(value: unknown): string {
  if (typeof value === "string") return value.slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return "";
}

function loadAll(): Announcement[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        id: file.replace(/\.md$/, ""),
        title: String(data.title ?? ""),
        date: isoDate(data.date),
        expires: data.expires ? isoDate(data.expires) : undefined,
        pinned: Boolean(data.pinned),
        link: data.link ? String(data.link) : undefined,
        linkLabel: data.linkLabel ? String(data.linkLabel) : undefined,
        body: content.trim(),
      };
    })
    .sort((a, b) => {
      // Pinned first, then most-recent date first.
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.date < b.date ? 1 : -1;
    });
}

export function getAllAnnouncements(): Announcement[] {
  return loadAll();
}

// Only the items that haven't yet expired. "Today" is the build/render moment
// — Vercel rebuilds when the CMS publishes, so expired items disappear at
// the next publish.
export function getActiveAnnouncements(): Announcement[] {
  const today = new Date().toISOString().slice(0, 10);
  return loadAll().filter((a) => !a.expires || a.expires >= today);
}
