import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { LucideIcon } from "lucide-react";
import {
  HandHeart,
  Baby,
  BookOpenCheck,
  Music,
  Coffee,
  Sliders,
  UtensilsCrossed,
  HandHelping,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  HandHeart,
  Baby,
  BookOpenCheck,
  Music,
  Coffee,
  Sliders,
  UtensilsCrossed,
  HandHelping,
};

export type ServeRole = {
  id: string;
  title: string;
  team: string;
  commitment: string;
  training: string;
  description: string;
  icon: LucideIcon;
};

const DIR = path.join(process.cwd(), "content/serve-roles");

export function getServeRoles(): ServeRole[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), "utf-8");
      const { data } = matter(raw);
      return {
        _order: Number(data.order ?? 99),
        id: file.replace(/\.md$/, ""),
        title: String(data.title ?? ""),
        team: String(data.team ?? ""),
        commitment: String(data.commitment ?? ""),
        training: String(data.training ?? ""),
        description: String(data.description ?? ""),
        icon: ICON_MAP[String(data.icon ?? "")] ?? HandHeart,
      };
    })
    .sort((a, b) => a._order - b._order || a.title.localeCompare(b.title))
    .map(({ _order, ...role }) => role);
}
