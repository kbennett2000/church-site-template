"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, Mail } from "lucide-react";

interface Plan {
  slug: string;
  title: string;
  entries: string[]; // YYYY-MM-DD dates
}

type State = "idle" | "loading" | "success" | "error";

export function TestSendForm({ plans }: { plans: Plan[] }) {
  const [toEmail, setToEmail] = useState("");
  const [planSlug, setPlanSlug] = useState(plans[0]?.slug ?? "");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<{ subject?: string; plan?: string; date?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const selectedPlan = plans.find((p) => p.slug === planSlug);
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/admin/devotionals/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toEmail, planSlug, date }),
      });
      const data = await res.json() as Record<string, string>;
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setResult({ subject: data.subject, plan: data.plan, date: data.date });
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/admin/devotionals" className="text-sm text-muted-foreground hover:text-foreground">
          ← Admin
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">Send test email</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6 text-muted-foreground" />
          Send test email
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Preview a real rendered email by sending it to any address. Uses live scripture fetch and your current email settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="to-email">Send to</label>
          <input
            id="to-email"
            type="email"
            required
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="plan-slug">Reading plan</label>
          {plans.length === 0 ? (
            <p className="text-sm text-muted-foreground">No plans found in content/reading-plans/.</p>
          ) : (
            <select
              id="plan-slug"
              value={planSlug}
              onChange={(e) => setPlanSlug(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {plans.map((p) => (
                <option key={p.slug} value={p.slug}>{p.title}</option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="entry-date">Entry date</label>
          <input
            id="entry-date"
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {selectedPlan && !selectedPlan.entries.includes(date) && (
            <p className="text-xs text-amber-600">No entry for this date in the selected plan.</p>
          )}
        </div>

        {state === "success" && result && (
          <div className="flex items-start gap-2 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
            <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Email sent!</p>
              <p className="text-xs mt-0.5 text-green-700">
                {result.plan} · {result.date}
              </p>
            </div>
          </div>
        )}

        {state === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={state === "loading" || plans.length === 0}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          Send test email
        </button>
      </form>

      <div className="text-xs text-muted-foreground border-t pt-4">
        Also preview the email layout without sending:{" "}
        {["soap", "simple", "lectio_divina"].map((s) => (
          <Link
            key={s}
            href={`/admin/devotionals/preview/${s}`}
            className="underline underline-offset-2 mr-2 hover:text-foreground"
          >
            {s === "lectio_divina" ? "Lectio Divina" : s.charAt(0).toUpperCase() + s.slice(1)}
          </Link>
        ))}
      </div>
    </main>
  );
}
