import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Elder } from "@/lib/elders";

// Function export (not top-level const) so CMS edits hot-reload in dev.
// See content/sermons.ts for the rationale.

const ELDERS_DIR = path.join(process.cwd(), "content/elders");

function loadAll(): Elder[] {
  if (!fs.existsSync(ELDERS_DIR)) return [];
  return fs
    .readdirSync(ELDERS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(ELDERS_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        name: String(data.name ?? ""),
        occupation: String(data.occupation ?? ""),
        photo: String(data.photo ?? ""),
        bio: content.trim(),
        _order: Number(data.order ?? 99),
      };
    })
    .sort((a, b) => a._order - b._order)
    .map(({ _order, ...rest }) => rest as Elder);
}

export function getElders(): Elder[] {
  return loadAll();
}
