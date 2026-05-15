import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail } from "lucide-react";
import { features } from "@/content/site";
import { churchInfo } from "@/lib/church-info";
import { getRecentDigestSendLogs } from "@/lib/db/queries";
import { formatShortDate } from "@/lib/digest/week-helpers";

export const metadata: Metadata = {
  title: `Past digests — ${churchInfo.name}`,
  description: `Browse past weekly digests from ${churchInfo.name}.`,
};

export const dynamic = "force-dynamic";

export default async function DigestArchivePage() {
  if (!features?.digest) notFound();

  // Tolerate a missing/unconfigured DB locally — the archive simply shows empty.
  const logs = await getRecentDigestSendLogs(52).catch(() => []);

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Weekly Digest Archive
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl">
            Past digests from {churchInfo.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Every Sunday-ish, we send one email summarizing the week ahead. Here&apos;s
            what subscribers have received.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/digest/subscribe"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" /> Subscribe — it&apos;s free
            </Link>
            <Link
              href="/digest"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              What&apos;s in a digest?
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        {logs.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No digests have been sent yet. Once we send the first one,
              it&apos;ll appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    Week of {formatShortDate(log.weekStart)} – {formatShortDate(log.weekEnd)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sent {log.sentAt.toISOString().slice(0, 10)} · {log.sent.toLocaleString()} delivered
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
