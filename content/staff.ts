import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { StaffMember } from "@/lib/staff";

// Function export (not top-level const) so CMS edits hot-reload in dev.
// See content/sermons.ts for the rationale.

const STAFF_DIR = path.join(process.cwd(), "content/staff");

function loadAll(): StaffMember[] {
  if (!fs.existsSync(STAFF_DIR)) return [];
  return fs
    .readdirSync(STAFF_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(STAFF_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        name: String(data.name ?? ""),
        role: String(data.role ?? ""),
        email: String(data.email ?? ""),
        photo: String(data.photo ?? ""),
        bio: content.trim(),
        _order: Number(data.order ?? 99),
      };
    })
    .sort((a, b) => a._order - b._order)
    .map(({ _order, ...rest }) => rest as StaffMember);
}

export function getStaff(): StaffMember[] {
  return loadAll();
}
