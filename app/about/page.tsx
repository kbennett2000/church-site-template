import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, BookOpen, ArrowRight } from "lucide-react";
import { marked } from "marked";
import matter from "gray-matter";
import { Button } from "@/components/ui/button";
import { beliefs } from "@/content/beliefs";
import { getStaff } from "@/content/staff";
import { getElders } from "@/content/elders";
import { siteContent } from "@/content/site";
import { churchInfo } from "@/lib/church-info";

export const metadata: Metadata = {
  title: "About",
  description: `Our story, what we believe, and the people who lead ${churchInfo.name}.`,
};

export default async function AboutPage() {
  const staff = getStaff();
  const elders = getElders();
  const storyRaw = fs.readFileSync(
    path.join(process.cwd(), "content/story.md"),
    "utf-8"
  );
  const { content: storyBody } = matter(storyRaw);
  const storyHtml = await marked.parse(storyBody.trim());
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

        <div className="container relative flex min-h-[55vh] flex-col justify-center py-20 text-background md:py-24">
          <p className="text-sm uppercase tracking-[0.2em] text-background/75">
            About {churchInfo.shortName}
          </p>
          <h1 className="mt-5 max-w-3xl text-balance font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
            {siteContent.about.hero.headline}
          </h1>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Our story
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
              A church that wants to feel like home.
            </h2>
          </div>

          <div className="space-y-5 text-foreground/85 lg:col-span-8">
            <div
              className="prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ __html: storyHtml }}
            />
            <p>
              We meet at {churchInfo.address.full}
              {churchInfo.primaryService
                ? ` — ${churchInfo.primaryService.day}s at ${churchInfo.primaryService.time}`
                : ""}
              .{" "}
              {churchInfo.primaryService?.note
                ? `${churchInfo.primaryService.note}. `
                : ""}
              {churchInfo.services.length > 1
                ? `We also gather ${churchInfo.services
                    .filter((s) => s !== churchInfo.primaryService)
                    .map((s) => `${s.day}s at ${s.time}`)
                    .join(" and ")}. `
                : ""}
              We&apos;d love to see you.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <BookOpen className="h-3.5 w-3.5" />
              What we believe
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              The historic Christian faith, in plain language.
            </h2>
            <p className="mt-4 text-muted-foreground">
              These are the doctrinal statements as they appear on the church
              homepage, each rooted in Scripture. A longer Statement of Faith
              is available on request.
            </p>
          </div>

          <dl className="mt-12 grid gap-5 md:grid-cols-2">
            {beliefs.map((b) => (
              <div
                key={b.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <dt className="font-serif text-xl">{b.title}</dt>
                <dd className="mt-3 text-sm text-foreground/85">
                  {b.statement}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm text-foreground/85">
              Want the full doctrinal statement, the church covenant, or our
              bylaws? We&apos;ll send them over.
            </p>
            <Button asChild variant="outline">
              <a href={`${churchInfo.emailHref}?subject=Request%20for%20doctrinal%20statement`}>
                <Mail className="h-4 w-4" />
                Email us
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section id="staff" className="container py-16 md:py-24 scroll-mt-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Staff
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            The people you&apos;ll meet on a Sunday.
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((person) => (
            <li
              key={person.name}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <Image
                src={person.photo}
                alt={person.name}
                width={88}
                height={88}
                className="h-20 w-20 rounded-full object-cover"
              />
              <h3 className="mt-5 font-serif text-xl">{person.name}</h3>
              <p className="mt-0.5 text-sm font-medium text-accent">
                {person.role}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{person.bio}</p>
              <StaffContact email={person.email} />
            </li>
          ))}
        </ul>
      </section>

      <section id="elders" className="bg-muted/40 py-16 md:py-24 scroll-mt-24">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Elders
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Shepherding the church together.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every meaningful direction the church takes is decided by our
              elder team together — pastoral and lay leaders working alongside
              each other. These are the people who currently serve.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {elders.map((e) => (
              <li
                key={e.name}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <Image
                  src={e.photo}
                  alt={e.name}
                  width={88}
                  height={88}
                  className="mx-auto h-20 w-20 rounded-full object-cover"
                />
                <h3 className="mt-4 font-serif text-lg">{e.name}</h3>
                {e.occupation ? (
                  <p className="text-xs font-medium text-accent">
                    {e.occupation}
                  </p>
                ) : null}
                <p className="mt-3 text-xs text-muted-foreground">{e.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-10 text-primary-foreground md:p-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl">
                Coming on a Sunday?
              </h2>
              <p className="mt-4 max-w-md text-primary-foreground/85">
                We&apos;d love to meet you. The Plan a Visit page covers
                everything a first-timer wants to know.
              </p>
            </div>
            <div className="md:text-right">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/visit">
                  Plan your visit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StaffContact({ email }: { email: string }) {
  if (email) {
    return (
      <a
        href={`mailto:${email}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent"
      >
        <Mail className="h-4 w-4 text-accent" />
        {email}
      </a>
    );
  }
  return (
    <a
      href={churchInfo.emailHref}
      className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
    >
      <Mail className="h-4 w-4 text-accent" />
      Contact via church office
    </a>
  );
}
