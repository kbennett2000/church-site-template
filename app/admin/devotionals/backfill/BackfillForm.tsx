"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle, Loader2, RefreshCw } from "lucide-react";

interface Plan {
  slug: string;
  title: string;
}

interface Summary {
  runDate: string;
  attempted: number;
  sent: number;
  skipped: number;
  failed: number;
  errors: Array<{ subscriberId: string; planSlug: string; message: string }>;
}

type State = "idle" | "loading" | "done" | "error";

export function BackfillForm({ plans }: { plans: Plan[] }) {
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(yesterday);
  const [state, setState] = useState<State>("idle");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm(`Send backfill for ${date} to all active subscribers? This will send real emails.`)) return;

    setState("loading");
    setErrorMsg("");
    setSummary(null);

    try {
      const res = await fetch("/api/admin/devotionals/backfill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const data = await res.json() as Summary & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setSummary(data);
      setState("done");
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
        <span className="text-sm font-medium">Backfill missed sends</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <RefreshCw className="h-6 w-6 text-muted-foreground" />
          Backfill missed sends
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Send a past day's entry to subscribers who never received it — for example
          if the cron job failed. Idempotent: subscribers who already got the email
          are skipped.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <p>This sends real emails to real subscribers. Use the test-send feature to preview first.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="backfill-date">Date to backfill</label>
          <input
            id="backfill-date"
            type="date"
            required
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            Only past dates. All active plans with an entry on this date will be sent.
          </p>
        </div>

        {state === "done" && summary && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-green-800 font-medium text-sm">
              <CheckCircle className="h-4 w-4" />
              Backfill complete for {summary.runDate}
            </div>
            <div className="grid grid-cols-4 gap-3 mt-2">
              {[
                { label: "Attempted", value: summary.attempted },
                { label: "Sent", value: summary.sent },
                { label: "Skipped", value: summary.skipped },
                { label: "Failed", value: summary.failed },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-xl font-bold text-green-900 tabular-nums">{value}</div>
                  <div className="text-xs text-green-700">{label}</div>
                </div>
              ))}
            </div>
            {summary.errors.length > 0 && (
              <details className="mt-2">
                <summary className="text-xs text-red-700 cursor-pointer">
                  {summary.errors.length} error{summary.errors.length !== 1 ? "s" : ""} — click to expand
                </summary>
                <ul className="mt-2 space-y-1">
                  {summary.errors.map((err, i) => (
                    <li key={i} className="text-xs text-red-800 font-mono bg-red-50 p-2 rounded">
                      {err.planSlug}: {err.message}
                    </li>
                  ))}
                </ul>
              </details>
            )}
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
          {state === "loading" ? "Sending…" : "Run backfill"}
        </button>
      </form>
    </main>
  );
}
