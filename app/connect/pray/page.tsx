import type { Metadata } from "next";
import { Phone, Mail, HandHeart, Lock, Users } from "lucide-react";
import { PrayerForm } from "@/components/sections/prayer-form";
import { getPrayerRequests } from "@/content/prayer-requests";
import { churchInfo } from "@/lib/church-info";

export const metadata: Metadata = {
  title: "Prayer Requests",
  description: `Share a prayer request with the pastoral team at ${churchInfo.name}. Private by default — never shared publicly without permission.`,
};

function daysAgoLabel(n: number) {
  if (n === 0) return "today";
  if (n === 1) return "yesterday";
  return `${n} days ago`;
}

export default function PrayerPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <HandHeart className="h-5 w-5" />
          </span>
          <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.05] md:text-5xl">
            What can we be praying for?
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Every Wednesday, our pastors and elders pray through the requests
            they&apos;ve received that week. There&apos;s nothing too small,
            too messy, or too embarrassing to send.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <h2 className="font-serif text-3xl">Send a request</h2>
            <p className="mt-3 text-muted-foreground">
              Name and email are optional. Use what you&apos;re comfortable with.
            </p>
            <div className="mt-8">
              <PrayerForm />
            </div>
          </div>

          <aside className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-serif text-xl">How requests are handled</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <SidebarItem icon={Lock} title="Confidential by default">
                  Only our pastoral team sees the original. We never share names
                  publicly without permission.
                </SidebarItem>
                <SidebarItem icon={Users} title="Optional prayer chain">
                  If you&apos;d like the broader prayer team praying too, we&apos;ll
                  share an anonymized version.
                </SidebarItem>
                <SidebarItem icon={Phone} title="Need someone now?">
                  Call{" "}
                  <a className="text-accent hover:underline" href={churchInfo.phoneHref}>
                    {churchInfo.phone}
                  </a>{" "}
                  or email{" "}
                  <a className="text-accent hover:underline" href={churchInfo.emailHref}>
                    {churchInfo.email}
                  </a>
                  .
                </SidebarItem>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-muted/40 py-20 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Prayer wall
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              What we&apos;re praying for this week.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Requests shared with permission, anonymized to protect privacy.
              Praying along is the only thing we ask.
            </p>
          </div>

          <ul className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
            {getPrayerRequests().map((req) => (
              <li
                key={req.id}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      {req.initials.replace(/[^A-Z]/gi, "").slice(0, 2) || "•"}
                    </span>
                    <span className="font-medium text-foreground">
                      {req.initials}
                    </span>
                  </span>
                  <span>{daysAgoLabel(req.daysAgo)}</span>
                </div>
                <p className="mt-4 text-foreground/90">&ldquo;{req.request}&rdquo;</p>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
            <Mail className="mr-1.5 inline-block h-3.5 w-3.5 -translate-y-0.5 text-accent" />
            Want updates on these? Email us — we share resolution notes
            (the answered-prayer kind) on Friday afternoons.
          </p>
        </div>
      </section>
    </>
  );
}

function SidebarItem({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}
