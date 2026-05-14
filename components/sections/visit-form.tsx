"use client";

import { useMemo, useState } from "react";
import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpIcon } from "@/components/ui/help-icon";
import { churchInfo, type Service } from "@/lib/church-info";

const DAY_NAME_TO_DOW: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

function nextServiceOptions(
  services: readonly Service[],
  count: number,
  from: Date = new Date()
): { value: string; label: string }[] {
  const active = services.filter(
    (s) => s.day && s.time && DAY_NAME_TO_DOW[s.day.toLowerCase()] !== undefined
  );
  // Fall back to next Sundays if no services are configured.
  if (active.length === 0) {
    const out: { value: string; label: string }[] = [];
    const d = new Date(from);
    while (out.length < count) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0)
        out.push({
          value: d.toISOString().slice(0, 10),
          label: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
        });
    }
    return out;
  }

  const multipleServices = active.length > 1;
  const instances: { date: Date; service: Service }[] = [];
  const d = new Date(from);
  // Scan 10 weeks ahead — enough to collect `count` instances for any schedule.
  for (let i = 0; i < 70 && instances.length < count * active.length; i++) {
    d.setDate(d.getDate() + 1);
    for (const s of active) {
      if (d.getDay() === DAY_NAME_TO_DOW[s.day.toLowerCase()])
        instances.push({ date: new Date(d), service: s });
    }
  }
  // Sort chronologically, then by service time within the same day.
  instances.sort((a, b) =>
    a.date.getTime() !== b.date.getTime()
      ? a.date.getTime() - b.date.getTime()
      : a.service.time.localeCompare(b.service.time)
  );

  return instances.slice(0, count).map(({ date, service }) => {
    const dateLabel = date.toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric",
    });
    const label = multipleServices
      ? `${dateLabel} · ${service.name || service.time}`
      : dateLabel;
    return {
      value: `${date.toISOString().slice(0, 10)}|${service.time}`,
      label,
    };
  });
}

export function VisitForm() {
  const serviceOptions = useMemo(() => nextServiceOptions(churchInfo.services, 8), []);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    adults: "1",
    kids: "0",
    kidsAges: "",
    visit: serviceOptions[0]?.value ?? "",
    notes: "",
  });

  const hasKids = Number(form.kids) > 0;

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/submit/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unknown error");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-serif text-2xl">
          We can&apos;t wait to meet you.
        </h3>
        <p className="mt-3 text-muted-foreground">
          Someone from our welcome team will reach out before Sunday. If
          anything comes up,{" "}
          <a className="text-accent hover:underline" href={churchInfo.emailHref}>
            email us
          </a>{" "}
          or call{" "}
          <a className="text-accent hover:underline" href={churchInfo.phoneHref}>
            {churchInfo.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-card p-6 md:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          required
          help="Just so we know who to look for on Sunday. First and last names work best."
        >
          <Input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="First and last"
            autoComplete="name"
          />
        </Field>

        <Field
          label="Email"
          required
          help="We'll use this to greet you before Sunday — never to add you to a mailing list."
        >
          <Input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>

        <Field
          label="How many adults?"
          help="How many grown-ups are coming with you, including yourself."
        >
          <Select
            value={form.adults}
            onChange={(v) => update("adults", v)}
            options={["1", "2", "3", "4", "5", "6+"]}
          />
        </Field>

        <Field
          label="How many kids?"
          help="Helps our kids team get a name tag and a Sunday class ready for each one."
        >
          <Select
            value={form.kids}
            onChange={(v) => update("kids", v)}
            options={["0", "1", "2", "3", "4", "5+"]}
          />
        </Field>

        {hasKids ? (
          <Field
            label="Kids' ages"
            className="sm:col-span-2"
            help="We use ages to route kids to the right Sunday class (nursery, preschool, elementary)."
          >
            <Input
              value={form.kidsAges}
              onChange={(e) => update("kidsAges", e.target.value)}
              placeholder="e.g. 3, 6, and 9"
            />
          </Field>
        ) : null}

        <Field
          label="Which service?"
          className="sm:col-span-2"
          help="Pick the service you're planning to attend. Not sure yet? No problem — just pick one and we'll follow up."
        >
          <Select
            value={form.visit}
            onChange={(v) => update("visit", v)}
            options={serviceOptions}
            extraOption={{ value: "unsure", label: "Not sure yet" }}
          />
        </Field>

        <Field
          label="Anything we should know?"
          hint="Allergies, accessibility needs, questions — totally optional."
          className="sm:col-span-2"
        >
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            className="flex w-full rounded-md border border-input bg-card px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Anything at all — we love questions."
          />
        </Field>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      ) : null}
      <Button type="submit" variant="accent" size="lg" className="mt-7 w-full sm:w-auto" disabled={loading}>
        <Send className="h-4 w-4" />
        {loading ? "Sending…" : "Let us know you're coming"}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        We&apos;ll only use this to say hi before Sunday — never to add you to a list.
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  help,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  help?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-accent">*</span> : null}
        {help ? <HelpIcon text={help} /> : null}
      </span>
      {children}
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

type SelectOption = string | { value: string; label: string };

function Select({
  value,
  onChange,
  options,
  extraOption,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  extraOption?: { value: string; label: string };
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-11 w-full appearance-none rounded-md border border-input bg-card px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b635a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.75rem center",
        backgroundSize: "1.25rem",
        paddingRight: "2.5rem",
      }}
    >
      {options.map((opt) => {
        const v = typeof opt === "string" ? opt : opt.value;
        const l = typeof opt === "string" ? opt : opt.label;
        return (
          <option key={v} value={v}>
            {l}
          </option>
        );
      })}
      {extraOption ? (
        <option value={extraOption.value}>{extraOption.label}</option>
      ) : null}
    </select>
  );
}
