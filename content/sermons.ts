import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Sermon } from "@/lib/sermons";

// Reads sermon markdown files from /content/sermons/ on every call.
//
// Why functions instead of top-level `const`: Next.js's file watcher tracks
// modules that are imported (JS/TS/JSON), but not files read via `fs` at
// module-load time. If we cached the array at the top level, CMS edits to
// .md files would only appear after a full dev-server restart. Functions
// re-read on each render in dev (server components re-execute per request)
// AND still work fine at build time for static export.

const SERMONS_DIR = path.join(process.cwd(), "content/sermons");
const DEFAULT_THUMBNAIL = "/images/placeholders/hero.svg";

function isoDate(value: unknown): string {
  if (typeof value === "string") return value.slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return "";
}

function loadAll(): Sermon[] {
  if (!fs.existsSync(SERMONS_DIR)) return [];
  return fs
    .readdirSync(SERMONS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(SERMONS_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        id: file.replace(/\.md$/, ""),
        title: String(data.title ?? ""),
        series: String(data.series ?? "").trim(),
        speaker: String(data.speaker ?? ""),
        date: isoDate(data.date),
        scripture: String(data.scripture ?? ""),
        book: String(data.book ?? ""),
        description: content.trim(),
        youtubeId: String(data.youtubeId ?? ""),
        thumbnail: String(data.thumbnail ?? "") || DEFAULT_THUMBNAIL,
        audioUrl: String(data.audioUrl ?? "") || "#",
        notes: typeof data.notes === "string" ? data.notes.trim() : "",
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllSermons(): Sermon[] {
  return loadAll();
}

export function getLatestSermon(): Sermon | undefined {
  return loadAll()[0];
}

export function getSermon(id: string): Sermon | undefined {
  return loadAll().find((s) => s.id === id);
}
