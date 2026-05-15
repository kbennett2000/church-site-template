"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

interface Plan {
  slug: string;
  title: string;
  isActive: boolean;
}

interface SubscribeFormProps {
  /** All available plans to show as options. */
  plans: Plan[];
  /** If provided, this plan is pre-selected and the plan list is hidden (plan detail page). */
  preselectedSlug?: string;
}

type State = "idle" | "loading" | "success" | "error";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function hourLabel(h: number) {
  if (h === 0) return "12:00 AM (midnight)";
  if (h < 12) return `${h}:00 AM`;
  if (h === 12) return "12:00 PM (noon)";
  return `${h - 12}:00 PM`;
}

export function SubscribeForm({ plans, preselectedSlug }: SubscribeFormProps) {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sendHour, setSendHour] = useState(6);
  const [timezone, setTimezone] = useState("America/New_York");
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(
    preselectedSlug ? new Set([preselectedSlug]) : new Set()
  );
  const [errorMsg, setErrorMsg] = useState("");

  // Detect the user's local timezone on mount
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setTimezone(tz);
    } catch {
      // Keep default
    }
  }, []);

  function togglePlan(slug: string) {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    if (selectedSlugs.size === 0) {
      setErrorMsg("Please select at least one reading plan.");
      return;
    }

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/devotionals/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || null,
          planSlugs: Array.from(selectedSlugs),
          timezone,
          sendHour,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Subscription failed");
      }

      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
        <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
        <p className="font-semibold">Check your inbox!</p>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to <strong>{email}</strong>. Click it to
          confirm your subscription. (Check spam if you don&apos;t see it.)
        </p>
      </div>
    );
  }

  const showPlanList = !preselectedSlug && plans.length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 space-y-4"
    >
      <h3 className="font-serif text-xl">Subscribe by email</h3>
      <p className="text-sm text-muted-foreground">
        Get today&apos;s passage delivered to your inbox each morning.
      </p>

      <div className="space-y-3">
        <div>
          <label htmlFor="sub-email" className="sr-only">Email address</label>
          <input
            id="sub-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="sub-name" className="sr-only">Name (optional)</label>
          <input
            id="sub-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="sub-hour" className="text-xs text-muted-foreground">
            Delivery time
          </label>
          <select
            id="sub-hour"
            value={sendHour}
            onChange={(e) => setSendHour(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {hourLabel(h)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Sent in your local timezone ({timezone}).
          </p>
        </div>

        {showPlanList && (
          <fieldset className="space-y-1.5">
            <legend className="text-xs text-muted-foreground">Reading plans</legend>
            {plans.map((plan) => (
              <label
                key={plan.slug}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedSlugs.has(plan.slug)}
                  onChange={() => togglePlan(plan.slug)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <span className="text-sm group-hover:text-primary transition-colors">
                  {plan.title}
                  {!plan.isActive && (
                    <span className="ml-1.5 text-xs text-muted-foreground">(upcoming)</span>
                  )}
                </span>
              </label>
            ))}
          </fieldset>
        )}
      </div>

      {(state === "error" || errorMsg) && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Subscribe — it&apos;s free
      </button>

      <p className="text-xs text-muted-foreground text-center">
        We&apos;ll send a confirmation link. Unsubscribe any time.
      </p>
    </form>
  );
}
