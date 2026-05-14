"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Group } from "@/content/groups";
import { churchInfo } from "@/lib/church-info";

function initials(name: string): string {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function GroupsFinder({ groups }: { groups: Group[] }) {
  const lifeStages = useMemo(
    () => Array.from(new Set(groups.map((g) => g.lifeStage))).sort(),
    [groups]
  );

  const [day, setDay] = useState<string>("all");
  const [lifeStage, setLifeStage] = useState<string>("all");

  const filtered = useMemo(
    () =>
      groups.filter(
        (g) =>
          (day === "all" || g.day === day) &&
          (lifeStage === "all" || g.lifeStage === lifeStage)
      ),
    [groups, day, lifeStage]
  );

  const anyActive = day !== "all" || lifeStage !== "all";

  function clear() {
    setDay("all");
    setLifeStage("all");
  }

  return (
    <div>
      <div className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Filter
            label="Day of the week"
            value={day}
            onChange={setDay}
            options={DAYS as readonly string[]}
            allLabel="Any day"
          />
          <Filter
            label="Life stage"
            value={lifeStage}
            onChange={setLifeStage}
            options={lifeStages}
            allLabel="Any life stage"
          />
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "group" : "groups"}
            {anyActive ? " matching" : " open"}
          </p>
          {anyActive ? (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <Search className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-4 font-serif text-xl">No groups match those filters.</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;re always starting new groups —{" "}
            <a
              href={`${churchInfo.emailHref}?subject=Starting a new small group`}
              className="text-accent hover:underline"
            >
              email us
            </a>{" "}
            and we&apos;ll help you find or start one that fits.
          </p>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {filtered.map((g) => (
            <li
              key={g.id}
              className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6 transition hover:shadow-md sm:flex-row sm:gap-6"
            >
              {g.leaderPhoto ? (
                <Image
                  src={g.leaderPhoto}
                  alt={`${g.leader}, group leader`}
                  width={120}
                  height={120}
                  className="h-24 w-24 shrink-0 rounded-full object-cover sm:h-28 sm:w-28"
                />
              ) : (
                <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-primary/10 font-serif text-2xl text-primary sm:h-28 sm:w-28">
                  {initials(g.leader)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-accent">
                  <Users className="h-3 w-3" />
                  {g.lifeStage}
                </span>
                <h3 className="mt-3 font-serif text-xl leading-snug">
                  {g.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Led by {g.leader}
                </p>
                <p className="mt-3 text-sm text-foreground/80">
                  {g.description}
                </p>

                <dl className="mt-4 grid gap-1.5 text-sm">
                  <Row icon={Calendar}>{g.day}s</Row>
                  <Row icon={Clock}>{g.time}</Row>
                  <Row icon={MapPin}>{g.neighborhood}</Row>
                </dl>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-5"
                >
                  <a
                    href={`${churchInfo.emailHref}?subject=Interested in ${encodeURIComponent(
                      g.name
                    )}`}
                  >
                    I&apos;m interested
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  allLabel: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-11 w-full appearance-none rounded-md border border-input bg-background px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b635a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1.25rem",
          paddingRight: "2.5rem",
        }}
      >
        <option value="all">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function Row({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
      <span>{children}</span>
    </div>
  );
}
