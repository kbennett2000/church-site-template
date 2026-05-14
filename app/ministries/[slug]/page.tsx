import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  ArrowLeft,
  Sparkles,
  Users,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMinistries, getMinistry } from "@/content/ministries";
import { churchInfo } from "@/lib/church-info";

type Params = { slug: string };

export function generateStaticParams() {
  return getMinistries().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getMinistry(slug);
  if (!m) return { title: "Ministry not found" };
  return {
    title: m.title,
    description: m.description,
  };
}

function initials(name: string) {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default async function MinistryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const ministry = getMinistry(slug);
  if (!ministry) notFound();

  const hasLeader = ministry.leader.name.length > 0;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={ministry.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/65 via-foreground/55 to-foreground/80" />
        </div>

        <div className="container relative flex min-h-[55vh] flex-col justify-center py-20 text-background md:py-24">
          <Link
            href="/ministries"
            className="inline-flex items-center gap-1.5 text-sm text-background/75 transition hover:text-background"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All ministries
          </Link>
          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-background/75">
            {ministry.title}
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
            {ministry.tagline}
          </h1>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            {ministry.whoFor ? (
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  <Users className="h-3.5 w-3.5" />
                  Who it&apos;s for
                </p>
                <p className="mt-3 text-lg text-foreground/90">
                  {ministry.whoFor}
                </p>
              </div>
            ) : null}

            {ministry.whatToExpect.length > 0 ? (
              <div className={ministry.whoFor ? "mt-10" : ""}>
                <h2 className="font-serif text-2xl md:text-3xl">
                  What to expect
                </h2>
                <ul className="mt-6 space-y-4">
                  {ministry.whatToExpect.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-lg border border-border bg-card p-5"
                    >
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-foreground/85">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-2">
            {ministry.meetings.length > 0 ? (
              <div className="rounded-xl border border-border bg-card p-6 md:p-7">
                <h3 className="flex items-center gap-2 font-serif text-lg">
                  <Calendar className="h-4 w-4 text-accent" />
                  When &amp; where
                </h3>
                <ul className="mt-5 space-y-5">
                  {ministry.meetings.map((mt, i) => (
                    <li
                      key={i}
                      className="border-l-2 border-accent/30 pl-4 last:pb-0"
                    >
                      <p className="font-serif text-base text-foreground">
                        {mt.day}
                      </p>
                      <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {mt.time}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {mt.location}
                        </p>
                        {mt.note ? (
                          <p className="pt-1 text-xs italic">{mt.note}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground md:p-7">
                <h3 className="flex items-center gap-2 font-serif text-lg text-foreground">
                  <Calendar className="h-4 w-4 text-accent" />
                  When &amp; where
                </h3>
                <p className="mt-4">
                  This ministry doesn&apos;t have a recurring meeting. Reach
                  out to the church office to find out how to get involved.
                </p>
              </div>
            )}

            <div className="mt-6 rounded-xl border border-border bg-card p-6 md:p-7">
              <h3 className="font-serif text-lg">
                {hasLeader ? "Leader" : "Get in touch"}
              </h3>

              {hasLeader ? (
                <>
                  <div className="mt-5 flex items-center gap-4">
                    {ministry.leader.photo ? (
                      <Image
                        src={ministry.leader.photo}
                        alt={ministry.leader.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 font-serif text-base text-primary">
                        {initials(ministry.leader.name)}
                      </span>
                    )}
                    <div>
                      <p className="font-medium text-foreground">
                        {ministry.leader.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {ministry.leader.role}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="mt-5 w-full">
                    {ministry.leader.email ? (
                      <a href={`mailto:${ministry.leader.email}`}>
                        <Mail className="h-4 w-4" />
                        Email {ministry.leader.name.split(/[\s&]+/)[0]}
                      </a>
                    ) : (
                      <a href={churchInfo.emailHref}>
                        <Mail className="h-4 w-4" />
                        Contact via church office
                      </a>
                    )}
                  </Button>
                </>
              ) : (
                <div className="mt-4 space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Reach out to the church office and we&apos;ll connect you
                    with the right person.
                  </p>
                  <div className="space-y-2">
                    <a
                      href={churchInfo.emailHref}
                      className="flex items-center gap-2 text-foreground hover:text-accent"
                    >
                      <Mail className="h-4 w-4 text-accent" />
                      {churchInfo.email}
                    </a>
                    <a
                      href={churchInfo.phoneHref}
                      className="flex items-center gap-2 text-foreground hover:text-accent"
                    >
                      <Phone className="h-4 w-4 text-accent" />
                      {churchInfo.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {ministry.gallery.length > 0 ? (
        <section className="bg-muted/40 py-16 md:py-20">
          <div className="container">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Gallery
            </p>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl">
              A look at {ministry.title}.
            </h2>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ministry.gallery.map((src, i) => (
                <li
                  key={i}
                  className="relative aspect-[4/5] overflow-hidden rounded-lg"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
