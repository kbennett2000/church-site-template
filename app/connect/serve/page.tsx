import type { Metadata } from "next";
import { Sparkles, GraduationCap, Clock, Users } from "lucide-react";
import { getServeRoles } from "@/content/serve-roles";
import { ServeInterestButton } from "@/components/sections/serve-interest-button";
import { churchInfo } from "@/lib/church-info";

export const metadata: Metadata = {
  title: "Serve",
  description: `Sunday mornings happen because of dozens of volunteers. Find a place to serve at ${churchInfo.name}.`,
};

export default function ServePage() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Sparkles className="h-5 w-5" />
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Sunday morning isn&apos;t a show. It&apos;s a team.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            From the coffee pot to the kids check-in tablet to the slide
            deck, almost everything you experience on Sunday is run by
            volunteers. There&apos;s room for you.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="grid gap-3 sm:grid-cols-3">
          <Reassurance icon={Clock} title="Low commitment">
            Most teams serve 1–2 Sundays a month. Sustainable, not exhausting.
          </Reassurance>
          <Reassurance icon={GraduationCap} title="Training provided">
            Every team has onboarding. You won&apos;t be tossed in the deep end.
          </Reassurance>
          <Reassurance icon={Users} title="You&apos;re not alone">
            Every role is on a team with people who&apos;ve been doing it a while.
          </Reassurance>
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Open roles
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Pick something that sounds like you.
            </h2>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getServeRoles().map((role) => {
              const Icon = role.icon;
              return (
                <li
                  key={role.id}
                  className="flex flex-col rounded-xl border border-border bg-card p-6 transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {role.team}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-xl">{role.title}</h3>
                  <p className="mt-2 text-sm text-foreground/80">
                    {role.description}
                  </p>

                  <dl className="mt-5 space-y-3 border-y border-border py-4 text-sm">
                    <DefRow icon={Clock} label="Time">
                      {role.commitment}
                    </DefRow>
                    <DefRow icon={GraduationCap} label="Training">
                      {role.training}
                    </DefRow>
                  </dl>

                  <div className="mt-5">
                    <ServeInterestButton roleId={role.id} roleTitle={role.title} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}

function Reassurance({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/10 text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-4 font-serif text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

function DefRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      <div className="flex-1 text-xs">
        <dt className="font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm text-foreground/85">{children}</dd>
      </div>
    </div>
  );
}
