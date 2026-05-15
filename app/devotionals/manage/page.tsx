"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface Plan {
  slug: string;
  title: string;
}

interface Prefs {
  name: string | null;
  email: string;
  timezone: string;
  sendHour: number;
  subscribedPlanSlugs: string[];
  availablePlans: Plan[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function hourLabel(h: number) {
  if (h === 0) return "12:00 AM (midnight)";
  if (h < 12) return `${h}:00 AM`;
  if (h === 12) return "12:00 PM (noon)";
  return `${h - 12}:00 PM`;
}

export default function ManagePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable fields
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [sendHour, setSendHour] = useState(6);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token) {
      setError("No token provided. Use the link from your devotional email.");
      setLoading(false);
      return;
    }

    fetch(`/api/devotionals/manage?token=${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("Link not found or already unsubscribed.");
        return r.json() as Promise<Prefs>;
      })
      .then((data) => {
        setPrefs(data);
        setName(data.name ?? "");
        setTimezone(data.timezone);
        setSendHour(data.sendHour);
        setSelectedSlugs(new Set(data.subscribedPlanSlugs));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  function togglePlan(slug: string) {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/devotionals/manage?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || null,
          timezone,
          sendHour,
          planSlugs: Array.from(selectedSlugs),
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
    } catch {
      setError("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (error || !prefs) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <p className="text-destructive font-medium">{error ?? "Something went wrong."}</p>
          <Link href="/devotionals" className="text-sm underline underline-offset-4 hover:text-primary">
            Return to devotionals
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Manage your preferences</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Subscribed as <span className="font-medium text-foreground">{prefs.email}</span>
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="sendHour">
            Delivery time
          </label>
          <select
            id="sendHour"
            value={sendHour}
            onChange={(e) => setSendHour(Number(e.target.value))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {hourLabel(h)}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Timezone: {timezone}. Detected automatically at sign-up.
          </p>
        </div>

        {prefs.availablePlans.length > 0 && (
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Reading plans</legend>
            <div className="space-y-2 mt-1">
              {prefs.availablePlans.map((plan) => (
                <label key={plan.slug} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedSlugs.has(plan.slug)}
                    onChange={() => togglePlan(plan.slug)}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">
                    {plan.title}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {saved && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Preferences saved.
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save preferences
          </button>
          <Link
            href={`/api/devotionals/unsubscribe?token=${token}`}
            className="text-sm text-muted-foreground hover:text-destructive underline underline-offset-4"
          >
            Unsubscribe
          </Link>
        </div>
      </form>
    </main>
  );
}
