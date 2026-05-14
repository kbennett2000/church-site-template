import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getMinistries } from "@/content/ministries";
import { churchInfo } from "@/lib/church-info";

export const metadata: Metadata = {
  title: "Ministries",
  description: `Find your people at ${churchInfo.name} — Kids, Youth, Young Adults, Women, Men, Recovery, and Missions.`,
};

export default function MinistriesIndex() {
  const ministries = getMinistries();
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Ministries
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            There&apos;s a place for everyone in your family.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Seven ways we gather, grow, and serve through the week. Each one
            is led by people who&apos;d love to meet you.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/ministries/${m.slug}`}
                className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-lg"
              >
                <Image
                  src={m.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
                <div className="relative mt-auto p-6 text-background">
                  <h3 className="flex items-center justify-between font-serif text-2xl">
                    {m.title}
                    <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="mt-2 text-sm text-background/85">{m.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
