import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getMinistries } from "@/content/ministries";

export function MinistriesGrid() {
  const ministries = getMinistries();
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Ministries
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl md:text-4xl">
              There&apos;s a place for everyone in your family.
            </h2>
          </div>
          <Link
            href="/ministries"
            className="text-sm font-medium text-foreground/80 hover:text-accent"
          >
            See all ministries →
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ministries.map((m, i) => (
            <Link
              key={m.slug}
              href={`/ministries/${m.slug}`}
              className={
                "group relative flex aspect-[4/5] flex-col overflow-hidden rounded-lg " +
                (i === 0 ? "lg:col-span-2 lg:aspect-[2/1.25]" : "")
              }
            >
              <Image
                src={m.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              <div className="relative mt-auto p-5 text-background">
                <h3 className="flex items-center justify-between font-serif text-2xl">
                  {m.title}
                  <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </h3>
                <p className="mt-2 text-sm text-background/85">
                  {m.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
