import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PrayerRequest = {
  id: string;
  initials: string;
  request: string;
  daysAgo: number;
};

const DIR = path.join(process.cwd(), "content/prayer-requests");

export function getPrayerRequests(): PrayerRequest[] {
  if (!fs.existsSync(DIR)) return [];
  const now = Date.now();
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const posted = data.date ? new Date(String(data.date)).getTime() : now;
      const daysAgo = Math.max(0, Math.floor((now - posted) / 86_400_000));
      return {
        id: file.replace(/\.md$/, ""),
        initials: String(data.initials ?? "Anonymous"),
        request: content.trim(),
        daysAgo,
      };
    })
    .sort((a, b) => a.daysAgo - b.daysAgo);
}
