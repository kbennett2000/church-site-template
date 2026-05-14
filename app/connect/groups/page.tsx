import type { Metadata } from "next";
import { Users, Coffee, BookOpen, Heart } from "lucide-react";
import { getGroups } from "@/content/groups";
import { GroupsFinder } from "@/components/sections/groups-finder";
import { churchInfo } from "@/lib/church-info";

export const metadata: Metadata = {
  title: "Small Groups",
  description: `Find a small group at ${churchInfo.name} — 6–12 people who meet weekly for the Bible, prayer, and friendship.`,
};

const valueProps = [
  {
    icon: Coffee,
    title: "Small enough to be known",
    body: "6–12 people. Around a living room, with snacks. Real conversation, not theater.",
  },
  {
    icon: BookOpen,
    title: "Centered on Scripture",
    body: "Most groups work through a book of the Bible together, at the group's own pace.",
  },
  {
    icon: Heart,
    title: "A place to be prayed for",
    body: "Every group prays for one another every week. Stuff happens. We don't do life alone.",
  },
];

export default function GroupsPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Users className="h-5 w-5" />
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            The room is small. The friendships go deep.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Sunday is the front door. Small groups are the living room — where
            we actually know each other.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {valueProps.map((vp) => {
            const Icon = vp.icon;
            return (
              <div
                key={vp.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/10 text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-4 font-serif text-lg">{vp.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{vp.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Find a group
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                Browse what&apos;s open right now.
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Filter by day or life stage. Most groups happily welcome newcomers
              mid-semester.
            </p>
          </div>

          <div className="mt-10">
            <GroupsFinder groups={getGroups()} />
          </div>
        </div>
      </section>
    </>
  );
}
