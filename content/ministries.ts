import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Ministry } from "@/lib/ministries";

// Function exports (not top-level const) so CMS edits hot-reload in dev.
// See content/sermons.ts for the rationale.

const MINISTRIES_DIR = path.join(process.cwd(), "content/ministries");

// Display order for the homepage grid and the /ministries index. Slugs not
// listed here fall to the end. Reorder by editing this array. Adding a new
// ministry? Create the .md file in /content/ministries/ first, then add its
// slug to this list in the position you want it to appear.
const SLUG_ORDER = [
  "kids",
  "youth",
  "young-adults",
  "women",
  "men",
  "recovery",
  "missions",
];

function loadAll(): Ministry[] {
  if (!fs.existsSync(MINISTRIES_DIR)) return [];
  return fs
    .readdirSync(MINISTRIES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(MINISTRIES_DIR, file), "utf-8");
      const { data } = matter(raw);
      return data as Ministry;
    })
    .sort((a, b) => {
      const ai = SLUG_ORDER.indexOf(a.slug);
      const bi = SLUG_ORDER.indexOf(b.slug);
      if (ai === -1 && bi === -1) return a.title.localeCompare(b.title);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
}

export function getMinistries(): Ministry[] {
  return loadAll();
}

export function getMinistry(slug: string): Ministry | undefined {
  return loadAll().find((m) => m.slug === slug);
}
