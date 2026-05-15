import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Mail, HandCoins, Smartphone, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GiveButton } from "@/components/GiveButton";
import { SubsplashEmbed } from "@/components/giving/SubsplashEmbed";
import { churchInfo } from "@/lib/church-info";
import {
  givingConfig,
  getGivingHref,
  getProviderDisplayName,
} from "@/lib/giving";

export const metadata: Metadata = {
  title: "Give",
  description: `Support the work of ${churchInfo.name}. ${givingConfig.supportingMessage}`,
};

// ─── Shared sub-sections ────────────────────────────────────────────────────

function OfflineSection() {
  const og = givingConfig.offlineGiving;
  if (!og?.enabled) return null;

  const hasAddress = og.mailingAddress?.trim();
  const hasInPerson = og.inPersonInstructions?.trim();
  const hasTextToGive = og.textToGive?.enabled && og.textToGive?.number;

  if (!hasAddress && !hasInPerson && !hasTextToGive) return null;

  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {hasAddress && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </span>
          <h3 className="font-serif text-xl">Mail a check</h3>
          <p className="whitespace-pre-line text-sm text-muted-foreground">
            {og.mailingAddress}
          </p>
        </div>
      )}

      {hasInPerson && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
            <HandCoins className="h-5 w-5" />
          </span>
          <h3 className="font-serif text-xl">Give in person</h3>
          <p className="text-sm text-muted-foreground">{og.inPersonInstructions}</p>
          <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
            <Link href="/visit">Plan a visit</Link>
          </Button>
        </div>
      )}

      {hasTextToGive && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
            <Smartphone className="h-5 w-5" />
          </span>
          <h3 className="font-serif text-xl">Text to give</h3>
          <p className="text-sm text-muted-foreground">
            Text{" "}
            <strong>
              {og.textToGive.keyword || "GIVE"}
            </strong>{" "}
            to <strong>{og.textToGive.number}</strong>. First-timers will be
            prompted to set up their account once.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
            <a href={`sms:${og.textToGive.number}&body=${og.textToGive.keyword || "GIVE"}`}>
              Open messages
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

function FaqSection() {
  const faqs = givingConfig.faq;
  if (!faqs?.length) return null;

  return (
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
              <a href={churchInfo.emailHref} className="text-accent hover:underline">
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
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-foreground/70 transition group-open:rotate-45 group-open:bg-accent group-open:text-accent-foreground"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm text-foreground/85">{faq.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function AccountabilityBlock() {
  return (
    <section className="container py-16 md:py-20">
      <div className="rounded-xl border border-border bg-card p-7 text-center md:p-10">
        <span className="inline-grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <h2 className="mt-5 font-serif text-2xl">
          Budget &amp; financial accountability
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          [Replace with your accountability statement — for example: our books
          are reviewed annually by an outside CPA, our budget is voted on at the
          annual members&apos; meeting, and any member can request the full
          financials at any time.]
        </p>
      </div>
    </section>
  );
}

function PoweredBy() {
  const name = getProviderDisplayName(givingConfig);
  if (!name) return null;
  return (
    <p className="mt-6 text-center text-xs text-muted-foreground">
      Secure online giving powered by {name}.
    </p>
  );
}

// ─── Offline-only layout ─────────────────────────────────────────────────────
// Churches with no online giving get a warm informational page — no buttons,
// just clear instructions on how to give in person or by mail.

function OfflineOnlyPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Heart className="h-5 w-5" />
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            {givingConfig.callToAction || "Give"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            {givingConfig.supportingMessage}
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Ways to give
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            How to give
          </h2>
          <p className="mt-4 text-muted-foreground">
            We currently offer in-person and mail giving. Thank you for your
            generosity.
          </p>
        </div>
        <OfflineSection />
      </section>

      <FaqSection />
      <AccountabilityBlock />
    </>
  );
}

// ─── Subsplash layout ────────────────────────────────────────────────────────
// Subsplash embeds an iframed form directly on the page via their script.

function SubsplashPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Heart className="h-5 w-5" />
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            {givingConfig.callToAction || "Give"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            {givingConfig.supportingMessage}
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <SubsplashEmbed embedCode={givingConfig.subsplash.embedCode} />
        <PoweredBy />

        {givingConfig.offlineGiving?.enabled && (
          <div className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Other ways to give
            </p>
            <h2 className="mt-3 font-serif text-3xl">Prefer another method?</h2>
            <OfflineSection />
          </div>
        )}
      </section>

      <FaqSection />
      <AccountabilityBlock />
    </>
  );
}

// ─── Online provider layout ──────────────────────────────────────────────────
// All other providers: Planning Center, Tithe.ly, Pushpay, Stripe, Custom URL.
// The Give button sends the donor to the provider's hosted giving form.

function OnlinePage() {
  const href = getGivingHref(givingConfig);
  const isExternal = !href.startsWith("/");
  const providerName = getProviderDisplayName(givingConfig);

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Heart className="h-5 w-5" />
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            {givingConfig.callToAction || "Give"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            {givingConfig.supportingMessage}
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="flex flex-col items-start gap-4">
          <GiveButton variant="primary" />
          {isExternal && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ExternalLink className="h-3.5 w-3.5" />
              Opens on {providerName}&apos;s secure website
              {givingConfig.displayMode === "modal" ? " (in an overlay)" : givingConfig.displayMode === "newTab" ? " in a new tab" : ""}.
            </p>
          )}
        </div>
        <PoweredBy />

        {givingConfig.offlineGiving?.enabled && (
          <div className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Other ways to give
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Prefer another method?
            </h2>
            <OfflineSection />
          </div>
        )}
      </section>

      <FaqSection />
      <AccountabilityBlock />
    </>
  );
}

// ─── Page entry point ─────────────────────────────────────────────────────────

export default function GivePage() {
  if (givingConfig.provider === "offline_only") {
    return <OfflineOnlyPage />;
  }
  if (givingConfig.provider === "subsplash") {
    return <SubsplashPage />;
  }
  return <OnlinePage />;
}
