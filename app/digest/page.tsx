import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Calendar, BookOpen, MessageSquare } from "lucide-react";
import { features } from "@/content/site";
import { churchInfo } from "@/lib/church-info";
import { DigestSubscribeForm } from "@/components/digest/digest-subscribe-form";

export const metadata: Metadata = {
  title: "Weekly Digest",
  description: `Stay connected with ${churchInfo.name}. Subscribe to our weekly digest — announcements, upcoming events, recent sermons, and a note from the pastor.`,
};

export default function DigestPage() {
  if (!features?.digest) notFound();

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Weekly Digest
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Stay connected, once a week.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            One email, every week — what&apos;s happening at church, a look
            at recent sermons, and a note from the pastor. No spam, no noise.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl">What&apos;s in each digest</h2>
              <p className="mt-3 text-muted-foreground">
                Every digest is compiled automatically from your church&apos;s
                live content — so it&apos;s always current.
              </p>
            </div>

            <ul className="space-y-8">
              <li className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Announcements</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Current church news, pinned items first.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Upcoming events</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    What&apos;s on the calendar in the next week or two.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Recent sermon</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A link to the most recent message in case you missed it.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">A note from the pastor</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A short personal word — when the pastor has one to share.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <DigestSubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}
