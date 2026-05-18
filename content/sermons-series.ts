import { slugify } from "@/lib/utils";
import type { Sermon } from "@/lib/sermons";
import { getAllSermons } from "@/content/sermons";

// Derives the set of sermon "series" from whatever distinct, non-empty values
// exist in the sermons collection. Series are not a separate CMS collection —
// they're an emergent property of the sermons themselves. A church that never
// fills in the Series field will have zero series here; the /watch flat
// archive still works fine.
//
// Grouping rule: sermons are grouped by a normalized key (trim + casefold)
// so editors entering "Easter 2026" and " easter 2026 " end up in the same
// group. The display name comes from the most-recent sermon's casing in the
// group, so cleaning up casing improves what visitors see.
//
// Slug collision rule: when two genuinely different normalized names slugify
// to the same string (e.g. "Hope!" and "Hope?" → both "hope"), the series
// with the most recent sermon keeps the bare slug; later ones get -2/-3
// suffixes. A console.warn is emitted at build/render time so a developer
// notices the content issue.

export type Series = {
  slug: string;
  name: string;
  sermons: Sermon[];
  latestDate: string;
};

function normalize(name: string): string {
  return name.trim().toLowerCase();
}

function buildSeries(sermons: Sermon[]): Series[] {
  // Group sermons by normalized name. Pre-sort sermons newest-first so the
  // first sermon we see in each group is the most recent → its casing wins
  // for the display name.
  const sorted = [...sermons].sort((a, b) => (a.date < b.date ? 1 : -1));

  const groups = new Map<string, { name: string; sermons: Sermon[] }>();
  for (const sermon of sorted) {
    const raw = sermon.series;
    if (!raw || !raw.trim()) continue;
    const key = normalize(raw);
    const existing = groups.get(key);
    if (existing) {
      existing.sermons.push(sermon);
    } else {
      groups.set(key, { name: raw.trim(), sermons: [sermon] });
    }
  }

  // Sort groups by most-recent-sermon date descending (newest series first).
  // Each group's sermons retain their newest-first order from the pre-sort
  // above; consumers re-sort as needed for display.
  const ordered = Array.from(groups.values()).sort((a, b) => {
    const aDate = a.sermons[0]?.date ?? "";
    const bDate = b.sermons[0]?.date ?? "";
    return aDate < bDate ? 1 : -1;
  });

  // Assign slugs with deterministic disambiguation: the series with the most
  // recent sermon keeps the bare slug; collisions append -2, -3, etc.
  const used = new Set<string>();
  const result: Series[] = [];
  for (const group of ordered) {
    const base = slugify(group.name);
    let slug = base;
    let n = 2;
    while (used.has(slug)) {
      slug = `${base}-${n}`;
      n++;
    }
    if (slug !== base) {
      console.warn(
        `[sermons-series] Slug collision: "${group.name}" → "${slug}" (base "${base}" already taken).`,
      );
    }
    used.add(slug);
    result.push({
      slug,
      name: group.name,
      sermons: group.sermons,
      latestDate: group.sermons[0]?.date ?? "",
    });
  }

  return result;
}

export function getAllSeries(): Series[] {
  return buildSeries(getAllSermons());
}

export function getSeries(slug: string): Series | undefined {
  return getAllSeries().find((s) => s.slug === slug);
}

// Resolve a sermon's series field to the canonical slug used by /watch/series.
// Returns "" when the sermon has no series, or when the series isn't found
// (defensive — shouldn't happen because the series list is derived from these
// same sermons).
export function seriesSlug(seriesName: string): string {
  if (!seriesName || !seriesName.trim()) return "";
  const key = normalize(seriesName);
  return getAllSeries().find((s) => normalize(s.name) === key)?.slug ?? "";
}
