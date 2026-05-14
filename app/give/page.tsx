import type { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard,
  Smartphone,
  Mail,
  HandCoins,
  ArrowRight,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { churchInfo } from "@/lib/church-info";

export const metadata: Metadata = {
  title: "Give",
  description: `Support the work of ${churchInfo.name}. Online giving, text-to-give, by mail, or in person.`,
};

const givingMethods = [
  {
    icon: CreditCard,
    title: "Give online",
    description:
      "One-time or recurring, bank account or card. Most people start here.",
    primaryCta: "Give now",
    primaryHref: "#online-giving",
    secondary: "Powered by Pushpay (placeholder)",
  },
  {
    icon: Smartphone,
    title: "Text to give",
    description: "Text any dollar amount to the number below.",
    primaryCta: "Text GIVE to 84321",
    primaryHref: "sms:84321&body=GIVE",
    secondary: "First-timers will be prompted to set up their account once.",
  },
  {
    icon: Mail,
    title: "Mail a check",
    description: `Make checks payable to ${churchInfo.name}.`,
    primaryCta: "Copy mailing address",
    primaryHref: "#mailing-address",
    secondary: `${churchInfo.address.full}`,
  },
  {
    icon: HandCoins,
    title: "Give in person",
    description: "Drop a check or cash in the box at the back of the sanctuary.",
    primaryCta: "Plan a visit",
    primaryHref: "/visit",
    secondary: "No offering plate is passed.",
  },
];

const faqs = [
  {
    q: "Is my gift tax-deductible?",
    a: `Yes. ${churchInfo.name} is a 501(c)(3) nonprofit. We email annual giving statements every January.`,
  },
  {
    q: "Where does the money go?",
    a: "Roughly 65% to staff and ministry programming, 15% to building and operations, 12% to missions and benevolence, and 8% to a building reserve. We publish a full annual report and any member can request a budget walkthrough with our treasurer.",
  },
  {
    q: "Can I give to a specific ministry or missionary?",
    a: "Yes. When you give online, you can designate Missions, Benevolence (helping families in crisis), Building, or General Fund. Designated gifts always go where you direct.",
  },
  {
    q: "Do I have to be a member to give?",
    a: "Not at all. You don't have to give to be part of the church, and you don't have to be a member to give. Giving is a response to grace, not a requirement.",
  },
  {
    q: "What about Bitcoin, stocks, or estate gifts?",
    a: "We accept gifts of appreciated stock and have walked several families through estate giving. Email our administrator to start the conversation — we don't currently accept cryptocurrency.",
  },
  {
    q: "I'm in a hard season — can the church help me?",
    a: `Yes. Our benevolence fund exists for exactly this. Reach out privately to ${churchInfo.email} or any pastor. Everything is confidential.`,
  },
];

export default function GivePage() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Heart className="h-5 w-5" />
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Generosity is a response to grace, not a price of admission.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Every gift funds the day-to-day work of this church — staff,
            kids ministry, missions, and the family in crisis three blocks
            away. Thanks for being part of it.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Ways to give
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Whatever fits your wallet and your week.
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {givingMethods.map((m) => {
            const Icon = m.icon;
            return (
              <li
                key={m.title}
                className="flex flex-col rounded-xl border border-border bg-card p-7 transition hover:shadow-md"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-serif text-2xl">{m.title}</h3>
                <p className="mt-3 text-sm text-foreground/85">
                  {m.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {m.secondary}
                </p>
                <div className="mt-6">
                  <Button asChild variant="accent">
                    <Link href={m.primaryHref}>
                      {m.primaryCta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>

        <div
          id="online-giving"
          className="mt-12 rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Online giving placeholder
          </p>
          <h3 className="mt-3 font-serif text-2xl">
            Embedded Pushpay / Tithely widget goes here.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            In production this section will host the embedded giving form.
            For the prototype, the buttons above link out.
          </p>
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Common questions
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                The questions people actually ask.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Can&apos;t find what you&apos;re looking for? Email{" "}
                <a
                  href={churchInfo.emailHref}
                  className="text-accent hover:underline"
                >
                  {churchInfo.email}
                </a>{" "}
                and we&apos;ll answer it.
              </p>
            </div>

            <ul className="space-y-3 lg:col-span-3">
              {faqs.map((faq, i) => (
                <li key={i}>
                  <details className="group rounded-xl border border-border bg-card p-5 transition open:shadow-sm">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg leading-snug marker:hidden [&::-webkit-details-marker]:hidden">
                      {faq.q}
                      <span
                        aria-hidden="true"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-foreground/70 transition group-open:rotate-45 group-open:bg-accent group-open:text-accent-foreground"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-sm text-foreground/85">{faq.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="rounded-xl border border-border bg-card p-7 text-center md:p-10">
          <span className="inline-grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <h2 className="mt-5 font-serif text-2xl">
            Annual budget & financial accountability
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Our books are reviewed annually by an outside CPA, our budget is
            voted on by members at the annual meeting, and any member can
            request the full financials at any time. We take the trust
            you&apos;re placing in us seriously.
          </p>
        </div>
      </section>
    </>
  );
}
