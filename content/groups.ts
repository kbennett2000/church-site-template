import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Group = {
  id: string;
  name: string;
  day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  time: string;
  neighborhood: string;
  lifeStage: "Young Adults" | "Couples" | "Men" | "Women" | "Moms" | "Mixed" | "Empty Nesters";
  leader: string;
  leaderPhoto: string;
  description: string;
  contactEmail: string;
};

const DIR = path.join(process.cwd(), "content/groups");

export function getGroups(): Group[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), "utf-8");
      const { data } = matter(raw);
      return {
        id: file.replace(/\.md$/, ""),
        name: String(data.name ?? ""),
        day: (data.day ?? "Sunday") as Group["day"],
        time: String(data.time ?? ""),
        neighborhood: String(data.neighborhood ?? ""),
        lifeStage: (data.lifeStage ?? "Mixed") as Group["lifeStage"],
        leader: String(data.leader ?? ""),
        leaderPhoto: String(data.leaderPhoto ?? ""),
        description: String(data.description ?? ""),
        contactEmail: String(data.contactEmail ?? ""),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getGroup(id: string): Group | undefined {
  return getGroups().find((g) => g.id === id);
}
