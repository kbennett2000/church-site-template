import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Car,
  Shirt,
  Smile,
  Music,
  BookOpen,
  Coffee,
  ShieldCheck,
  Heart,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { churchInfo } from "@/lib/church-info";
import { VisitForm } from "@/components/sections/visit-form";
import type { Service } from "@/lib/church-info";

function formatServiceTimes(services: readonly Service[]): string {
  const map = new Map<string, string[]>();
  for (const s of services) {
    if (!s.day || !s.time) continue;
    const existing = map.get(s.day);
    if (existing) existing.push(s.time);
    else map.set(s.day, [s.time]);
  }
  if (map.size === 0) return "Sundays";
  return Array.from(map.entries())
    .map(([day, times]) => `${day}s at ${times.join(" & ")}`)
    .join(", ");
}

export const metadata: Metadata = {
  title: "Plan a Visit",
  description: `Here's what to expect on a Sunday at ${churchInfo.name} — where to park, what to wear, and where the kids go.`,
};

const timeline = [
  {
    time: "8:45 AM",
    title: "Doors open",
    body: "Pull into the lot, park anywhere, and head for the main entrance. Someone will be at the door to point you to coffee and the auditorium.",
    icon: Coffee,
  },
  {
    time: "9:00 AM",
    title: "Worship begins",
    body: "We sing four or five songs — a mix of hymns and modern worship. Stand, sit, sing, or just listen. There's no wrong way to be here.",
    icon: Music,
  },
  {
    time: "~9:20 AM",
    title: "Teaching from the Bible",
    body: "Our pastor walks through a passage of Scripture — usually 30 to 35 minutes. We work through books of the Bible a chapter at a time.",
    icon: BookOpen,
  },
  {
    time: "~10:00 AM",
    title: "Coffee & fellowship",
    body: "Stick around afterward. Grab a refill, meet a few people, and pick up the kids. We'd love to say hello.",
    icon: Smile,
  },
];

const basics = [
  {
    icon: Car,
    title: "Where to park",
    body: "Plenty of room in our parking lot. If it's your first time, pull into one of the marked Guest spots near the main entrance.",
  },
  {
    icon: Shirt,
    title: "What to wear",
    body: "Whatever you wore yesterday is fine. Some folks dress up, most don't. Jeans, shorts, boots, a hat — come as you are.",
  },
  {
    icon: Heart,
    title: "Will I stand out?",
    body: "No. Our welcome team will help you find a seat, but no one will ask you to stand or introduce yourself. Slip in and out as you please.",
  },
];

export default function VisitPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/placeholders/hero.svg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/65 via-foreground/55 to-foreground/80" />
        </div>

        <div className="container relative flex min-h-[58vh] flex-col justify-center py-20 text-background md:py-28">
          <p className="text-sm uppercase tracking-[0.2em] text-background/75 animate-fade-up">
            Plan a Visit
          </p>
          <h1 className="mt-5 max-w-3xl text-balance font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl animate-fade-up">
            Walking into a new church can feel like a lot. Here&apos;s everything you need to know.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-background/85 animate-fade-up">
            {formatServiceTimes(churchInfo.services)} · {churchInfo.address.full}. We&apos;ll save you a seat.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-up">
            <Button asChild size="lg" variant="accent">
              <Link href="#let-us-know">
                Let us know you&apos;re coming
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/40 bg-transparent text-background hover:bg-background/10 hover:text-background"
            >
              <a href={churchInfo.address.mapsUrl} target="_blank" rel="noreferrer">
                Get Directions
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            What Sunday looks like
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            About an hour and fifteen minutes, end to end.
          </h2>
          <p className="mt-4 text-muted-foreground">
            We keep things simple. Coffee, singing, the Bible, a few prayers,
            and people who are honestly glad you showed up.
          </p>
        </div>

        <ol className="mx-auto mt-14 max-w-2xl space-y-6">
          {timeline.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.time} className="relative flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  {i < timeline.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="mt-2 flex-1 w-px bg-border"
                    />
                  ) : null}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-mono text-xs uppercase tracking-wider text-accent">
                    {step.time}
                  </p>
                  <h3 className="mt-1 font-serif text-xl">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="bg-muted/40 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              The basics
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              The three things every first-timer wants to know.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {basics.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="rounded-lg border border-border bg-card p-7"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-xl">{b.title}</h3>
                  <p className="mt-2.5 text-sm text-muted-foreground">{b.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/images/placeholders/plan-a-visit.svg"
              alt="Kids enjoying activities"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Your kids
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              We treat them like the most important guests in the room.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Our Kids Ministry runs during the Sunday service for ages{" "}
              <span className="font-medium text-foreground">6 weeks through 5th grade</span>.
              Every child gets a Bible-rooted lesson at their level, plus games, songs, and a snack.
            </p>

            <ul className="mt-8 space-y-4">
              <KidsBullet
                icon={ShieldCheck}
                title="Safe, every time"
                body="Every volunteer is background-checked and trained. You'll get a matching tag with a unique pickup code — no one else can pick up your child."
              />
              <KidsBullet
                icon={Smile}
                title="Easy check-in"
                body="Stop by the Kids Check-In table by the main entrance when you arrive. First-time visit takes about 3 minutes."
              />
              <KidsBullet
                icon={Heart}
                title="Nervous kid? We've got you."
                body="You're welcome to stay in class with your child for as long as you'd like. There's no rush."
              />
            </ul>

            <Button asChild variant="outline" className="mt-8">
              <Link href="/ministries/kids">
                More about Kids Ministry
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 md:py-28">
        <div className="container grid gap-10 lg:grid-cols-5 lg:items-stretch">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Finding us
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Come visit us.
            </h2>

            <dl className="mt-7 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <dt className="font-medium text-foreground">Address</dt>
                  <dd>
                    <a
                      href={churchInfo.address.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-accent"
                    >
                      {churchInfo.address.street}
                      <br />
                      {churchInfo.address.city}, {churchInfo.address.state}{" "}
                      {churchInfo.address.zip}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <dt className="font-medium text-foreground">Service times</dt>
                  <dd className="text-muted-foreground">
                    {formatServiceTimes(churchInfo.services)}.
                    {churchInfo.primaryService?.note
                      ? ` ${churchInfo.primaryService.note}.`
                      : ""}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <dt className="font-medium text-foreground">Call ahead</dt>
                  <dd>
                    <a
                      href={churchInfo.phoneHref}
                      className="text-muted-foreground hover:text-accent"
                    >
                      {churchInfo.phone}
                    </a>{" "}
                    · Office hours {churchInfo.officeHours}
                  </dd>
                </div>
              </div>
            </dl>

            <Button asChild className="mt-8">
              <a href={churchInfo.address.mapsUrl} target="_blank" rel="noreferrer">
                Open in Google Maps
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-3">
            <iframe
              title={`Map to ${churchInfo.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(churchInfo.address.full)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              className="block h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section id="let-us-know" className="container py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Let us know you&apos;re coming
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              We&apos;ll watch for you on Sunday.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Filling this out isn&apos;t required — but it lets us greet you by name and have a little gift waiting at the welcome table.
            </p>
          </div>

          <div className="mt-10">
            <VisitForm />
          </div>
        </div>
      </section>
    </>
  );
}

function KidsBullet({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}
