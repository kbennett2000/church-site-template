"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("[Newsletter signup]", { email });
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="container pb-20 md:pb-28">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 md:p-14">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--accent)/0.08),transparent_60%)]"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-accent">
            <Mail className="h-5 w-5" />
          </span>
          <h2 className="mt-5 font-serif text-3xl md:text-4xl">
            Stay in the loop.
          </h2>
          <p className="mt-3 text-muted-foreground">
            A short weekly email — what&apos;s happening at church, prayer
            requests, and the sermon recap. No spam, unsubscribe anytime.
          </p>

          {submitted ? (
            <div className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
              <Check className="h-4 w-4" />
              Thanks — we&apos;ll be in touch.
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <Button type="submit" variant="accent">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
