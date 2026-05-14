import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    title: "Plan a Visit",
    description:
      "Here's what to expect Sunday morning — where to park, what to wear, where the kids go.",
    href: "/visit",
    image: "/images/placeholders/plan-a-visit.svg",
  },
  {
    title: "Watch Online",
    description:
      "Can't make it this Sunday? Catch the latest sermon and our weekly livestream.",
    href: "/watch",
    image: "/images/placeholders/watch.svg",
  },
  {
    title: "Find a Group",
    description:
      "Faith grows best in friendship. Find a small group of 6–12 people who meet through the week.",
    href: "/connect/groups",
    image: "/images/placeholders/small-groups.svg",
  },
];

export function NewHere() {
  return (
    <section className="container py-20 md:py-28">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            New here?
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl md:text-4xl">
            Three good places to start.
          </h2>
        </div>
        <p className="max-w-md text-muted-foreground">
          Whether it&apos;s your first Sunday or you&apos;ve been around a
          while, we&apos;d love to help you take the next step.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="flex items-center justify-between font-serif text-2xl">
                {card.title}
                <ArrowUpRight className="h-5 w-5 text-accent transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
