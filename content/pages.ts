import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Page = {
  slug: string;
  title: string;
  description?: string;
  body: string;
};

const DIR = path.join(process.cwd(), "content/pages");

// Function exports (not top-level const) so CMS edits hot-reload in dev.
export function getPages(): Page[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title ?? ""),
        description: data.description ? String(data.description) : undefined,
        body: content.trim(),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getPage(slug: string): Page | undefined {
  return getPages().find((p) => p.slug === slug);
}
