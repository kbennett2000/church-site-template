import type { Metadata } from "next";
import Link from "next/link";
import { HandHeart, Users, Sparkles, MessageSquare, ArrowUpRight } from "lucide-react";
import { churchInfo } from "@/lib/church-info";

export const metadata: Metadata = {
  title: "Connect",
  description: `Take a next step at ${churchInfo.name} — request prayer, find a small group, volunteer, or get in touch.`,
};

const cards = [
  {
    href: "/connect/pray",
    icon: HandHeart,
    title: "Prayer Requests",
    description:
      "Send a request to our pastoral team — privately, or to share on the prayer wall.",
  },
  {
    href: "/connect/groups",
    icon: Users,
    title: "Small Groups",
    description:
      "Faith grows best in friendship. Find a group of 6–12 people who meet through the week.",
  },
  {
    href: "/connect/serve",
    icon: Sparkles,
    title: "Serve",
    description:
      "Sunday mornings only happen because dozens of people show up to make them happen.",
  },
  {
    href: "/connect/contact",
    icon: MessageSquare,
    title: "Contact",
    description: "Questions, comments, or just want to say hi? We answer every email.",
  },
];

export default function ConnectPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Connect
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            A church is people. Here&apos;s how to take a next step.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Whether you&apos;ve been here a week or a decade, there&apos;s
            always another step into community. Pick whichever fits where
            you&apos;re at.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid gap-5 sm:grid-cols-2">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.href}
                href={c.href}
                className="group flex items-start gap-5 rounded-xl border border-border bg-card p-7 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <h2 className="flex items-start justify-between gap-3 font-serif text-2xl">
                    {c.title}
                    <ArrowUpRight className="h-5 w-5 text-accent transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {c.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
