import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Mail, Smartphone, HandCoins, ShieldCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { churchInfo } from "@/lib/church-info";
import { giving, isGivingConfigured } from "@/content/giving";
import { ExternalLinkGiving } from "@/components/giving/ExternalLinkGiving";
import { PlanningCenterGiving } from "@/components/giving/PlanningCenterGiving";
import { TithelyGiving } from "@/components/giving/TithelyGiving";
import { SubsplashGiving } from "@/components/giving/SubsplashGiving";
import { GivelifyGiving } from "@/components/giving/GivelifyGiving";
import { PayPalGiving } from "@/components/giving/PayPalGiving";
import { GenericIframeGiving } from "@/components/giving/GenericIframeGiving";

export const metadata: Metadata = {
  title: "Give",
  description: `Support the work of ${churchInfo.name}. Give online, by mail, or in person.`,
};

function ProviderEmbed() {
  if (!isGivingConfigured(giving)) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-12 text-center">
        <span className="inline-grid h-14 w-14 place-items-center rounded-full bg-accent/10 text-accent mx-auto">
          <Settings className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-serif text-2xl">Online giving isn&apos;t set up yet.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          A tech volunteer needs to connect a giving platform — Planning Center,
          Tithe.ly, Givelify, PayPal, or another service. See{" "}
          <a
            href="https://github.com/kbennett2000/church-site-template/tree/main/docs/for-tech-volunteers/giving-setup"
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            the giving setup guide
          </a>{" "}
          for step-by-step instructions.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          In the meantime, you can give by mail or in person below.
        </p>
      </div>
    );
  }

  switch (giving.provider) {
    case "planning_center":
      return (
        <PlanningCenterGiving
          url={giving.planning_center_url}
          mode={giving.planning_center_mode}
        />
      );
    case "tithely":
      return <TithelyGiving churchId={giving.tithely_church_id} />;
    case "subsplash":
      return <SubsplashGiving url={giving.subsplash_url} />;
    case "givelify":
      return <GivelifyGiving orgId={giving.givelify_org_id} />;
    case "paypal":
      return <PayPalGiving url={giving.paypal_url} />;
    case "generic_iframe":
      return (
        <GenericIframeGiving url={giving.iframe_url} height={giving.iframe_height} />
      );
    case "external_link":
    default:
      return <ExternalLinkGiving url={giving.external_url} />;
  }
}

export default function GivePage() {
  const contactEmail = giving.contact_email || churchInfo.email;
  const contactHref = giving.contact_email
    ? `mailto:${giving.contact_email}`
    : churchInfo.emailHref;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Heart className="h-5 w-5" />
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            {giving.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            {giving.subheadline}
          </p>
        </div>
      </section>

      {/* Primary giving embed */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Give online
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Safe, simple, and takes under two minutes.
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <ProviderEmbed />
        </div>
      </section>

      {/* Giving alternatives */}
      {giving.show_alternatives && (
        <section className="border-t border-border bg-muted/30 py-16 md:py-20">
          <div className="container">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Other ways to give
              </p>
              <h2 className="mt-3 font-serif text-3xl">
                Whatever fits your wallet and your week.
              </h2>
            </div>

            <ul className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {giving.alt_mail_check && (
                <li className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl">Mail a check</h3>
                    <p className="mt-2 text-sm text-foreground/80">
                      Make checks payable to {churchInfo.name} and mail to:
                    </p>
                    <address className="mt-2 text-sm not-italic text-muted-foreground">
                      {churchInfo.address.full}
                    </address>
                  </div>
                </li>
              )}

              {giving.alt_text_to_give && giving.alt_text_number && (
                <li className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                    <Smartphone className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl">Text to give</h3>
                    <p className="mt-2 text-sm text-foreground/80">
                      Text any dollar amount to:
                    </p>
                    <a
                      href={`sms:${giving.alt_text_number}`}
                      className="mt-1 block font-serif text-2xl text-accent"
                    >
                      {giving.alt_text_number}
                    </a>
                    <p className="mt-2 text-xs text-muted-foreground">
                      First-time givers will be prompted to set up their account.
                    </p>
                  </div>
                </li>
              )}

              <li className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <HandCoins className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-xl">Give in person</h3>
                  <p className="mt-2 text-sm text-foreground/80">
                    {giving.alt_in_person_note}
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href="/visit">Plan a visit</Link>
                  </Button>
                </div>
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      {giving.faq.length > 0 && (
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
                  Can&apos;t find what you&apos;re looking for?{" "}
                  <a href={contactHref} className="text-accent hover:underline">
                    Email us
                  </a>{" "}
                  and we&apos;ll answer it.
                </p>
              </div>

              <ul className="space-y-3 lg:col-span-3">
                {giving.faq.map((item, i) => (
                  <li key={i}>
                    <details className="group rounded-xl border border-border bg-card p-5 transition open:shadow-sm">
                      <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg leading-snug marker:hidden [&::-webkit-details-marker]:hidden">
                        {item.question}
                        <span
                          aria-hidden="true"
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-foreground/70 transition group-open:rotate-45 group-open:bg-accent group-open:text-accent-foreground"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-4 text-sm text-foreground/85">{item.answer}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Reassurance footer */}
      <section className="container py-16 md:py-20">
        <div className="rounded-xl border border-border bg-card p-7 text-center md:p-10">
          <span className="inline-grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <h2 className="mt-5 font-serif text-2xl">
            Annual budget &amp; financial accountability
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            {giving.reassurance_note}
          </p>
          {contactEmail && (
            <p className="mt-4 text-sm text-muted-foreground">
              Questions?{" "}
              <a href={contactHref} className="text-accent hover:underline">
                {contactEmail}
              </a>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
