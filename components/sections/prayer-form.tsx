"use client";

import { useState } from "react";
import { Check, Send, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpIcon } from "@/components/ui/help-icon";

export function PrayerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    request: "",
    privateToTeam: true,
    wantsCall: false,
  });

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("[Prayer request]", form);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-serif text-2xl">We&apos;re praying.</h3>
        <p className="mt-3 text-muted-foreground">
          Your request reached our pastoral team. If you asked for a call,
          someone will be in touch within a day or two.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-card p-6 md:p-10"
    >
      <div className="grid gap-5">
        <Field
          label="Your name"
          hint="Optional — anonymous is fine."
          help="Your name stays private to the pastoral team. Leave blank to submit anonymously."
        >
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="First and last (or just first)"
            autoComplete="name"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Email"
            hint="Only if you'd like a follow-up."
            help="A pastor can email you to follow up. Leave blank if you'd rather not be contacted."
          >
            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>
          <Field
            label="Phone"
            hint="Required if you'd like a call."
            help="Used only if you check the 'I'd like someone to call me' box below."
          >
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="(303) 555-0100"
              autoComplete="tel"
              required={form.wantsCall}
            />
          </Field>
        </div>

        <Field
          label="What can we pray for?"
          required
          help="Share as much or as little as you'd like. Our pastoral team reviews every request weekly."
        >
          <textarea
            required
            value={form.request}
            onChange={(e) => update("request", e.target.value)}
            rows={6}
            placeholder="Share as much or as little as you'd like."
            className="flex w-full rounded-md border border-input bg-card px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </Field>

        <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-5">
          <Checkbox
            checked={form.privateToTeam}
            onChange={(v) => update("privateToTeam", v)}
            label="Keep this private to the pastoral team"
            description="By default, requests stay private. Uncheck if you'd like us to share (anonymized) with our prayer chain."
          />
          <Checkbox
            checked={form.wantsCall}
            onChange={(v) => update("wantsCall", v)}
            label="I'd like someone to call me"
            description="A pastor will reach out within 1–2 days."
          />
        </div>
      </div>

      <Button type="submit" variant="accent" size="lg" className="mt-7 w-full sm:w-auto">
        <Send className="h-4 w-4" />
        Send to the pastoral team
      </Button>
      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        Requests are confidential by default and never posted publicly without permission.
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  help,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-accent">*</span> : null}
        {help ? <HelpIcon text={help} /> : null}
      </span>
      {children}
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 cursor-pointer accent-primary"
      />
      <span>
        <span className="font-medium text-foreground">{label}</span>
        {description ? (
          <span className="block text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
