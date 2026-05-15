import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { DigestNote } from "./types";

const NOTES_DIR = path.join(process.cwd(), "content/digest-notes");

function isoDate(value: unknown): string {
  if (typeof value === "string") return value.slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return "";
}

/** Loads all digest notes (excluding the _examples/ subdirectory). */
function loadAll(): DigestNote[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(NOTES_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const body = content.trim();
      return {
        id: file.replace(/\.md$/, ""),
        weekOf: isoDate(data.weekOf),
        title: data.title ? String(data.title) : undefined,
        signedBy: data.signedBy ? String(data.signedBy) : undefined,
        status: ((["draft", "ready", "sent"].includes(String(data.status))
          ? data.status
          : "draft") as DigestNote["status"]),
        bodyHtml: marked.parse(body, { async: false }) as string,
        bodyText: body,
      };
    });
}

/**
 * Returns the most-recent ready note whose `weekOf` falls within [weekStart, weekEnd].
 * Returns null if no matching ready note exists.
 */
export function findReadyNoteForWeek(
  weekStart: string,
  weekEnd: string
): DigestNote | null {
  const candidates = loadAll()
    .filter((n) => n.status === "ready")
    .filter((n) => n.weekOf >= weekStart && n.weekOf <= weekEnd)
    .sort((a, b) => (a.weekOf < b.weekOf ? 1 : -1));
  return candidates[0] ?? null;
}
