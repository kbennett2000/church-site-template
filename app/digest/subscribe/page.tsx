import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, BookOpen, MessageSquare, Megaphone, Mail } from "lucide-react";
import { features } from "@/content/site";
import { churchInfo } from "@/lib/church-info";
import { DigestSubscribeForm } from "@/components/digest/digest-subscribe-form";
import { getDigestSettings } from "@/lib/digest/settings";

export const metadata: Metadata = {
  title: `Subscribe to the weekly digest — ${churchInfo.name}`,
  description: `One email a week from ${churchInfo.name} — announcements, upcoming events, recent sermons, and a note from the pastor.`,
};

export default function DigestSubscribePage() {
  if (!features?.digest) notFound();

  const settings = getDigestSettings();

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Subscribe
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            The weekly digest from {churchInfo.name}.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            One email each {settings.sendDay}. Announcements, upcoming events,
            the most recent sermon, and a short note from the pastor — when there
            is one. No spam, easy to unsubscribe.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl">What you&apos;ll get</h2>
              <p className="mt-3 text-muted-foreground">
                Each digest is compiled from current content — so it&apos;s
                always up to date.
              </p>
            </div>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Megaphone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Announcements</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Current news, pinned items first. Anything posted in the last week.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Upcoming events</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The next {settings.eventsLookaheadDays} days of services, studies, and gatherings.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Recent sermon</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A link to the most recent message — watch, listen, or read the notes.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">A note from the pastor</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A short personal word — when the pastor has one to share. The section is
                    quietly omitted when there isn&apos;t one.
                  </p>
                </div>
              </li>
            </ul>

            <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 font-medium text-foreground">
                <Mail className="h-4 w-4" /> Just want the digest?
              </p>
              <p className="mt-2">
                Subscribing here adds the <code className="rounded bg-muted px-1.5 py-0.5 text-xs">digest</code> tag
                only. You won&apos;t receive daily devotionals unless you also subscribe
                from <a href="/devotionals" className="underline">/devotionals</a>.
              </p>
            </div>
          </div>

          <div>
            <DigestSubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}
