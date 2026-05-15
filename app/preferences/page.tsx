"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Plan {
  slug: string;
  title: string;
}

interface Prefs {
  name: string | null;
  email: string;
  tags: string[];
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

const SUBSCRIPTION_TYPES = [
  {
    tag: "devotionals",
    label: "Daily Devotionals",
    description: "A scripture reading delivered to your inbox each morning.",
  },
  {
    tag: "digest",
    label: "Weekly Digest",
    description: "Announcements, upcoming events, recent sermons, and a note from the pastor — once a week.",
  },
];

function PreferencesInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [confirmUnsubAll, setConfirmUnsubAll] = useState(false);

  // Editable fields
  const [name, setName] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [timezone, setTimezone] = useState("America/New_York");
  const [sendHour, setSendHour] = useState(6);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token) {
      setError("No token provided. Use the link from one of your subscription emails.");
      setLoading(false);
      return;
    }

    fetch(`/api/preferences?token=${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("Link not found or already unsubscribed.");
        return r.json() as Promise<Prefs>;
      })
      .then((data) => {
        setPrefs(data);
        setName(data.name ?? "");
        setSelectedTags(new Set(data.tags));
        setTimezone(data.timezone);
        setSendHour(data.sendHour);
        setSelectedSlugs(new Set(data.subscribedPlanSlugs));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

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
      const res = await fetch(`/api/preferences?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || null,
          tags: Array.from(selectedTags),
          timezone,
          sendHour,
          planSlugs: selectedTags.has("devotionals") ? Array.from(selectedSlugs) : [],
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

  async function handleUnsubscribeAll() {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/preferences?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unsubscribeAll: true }),
      });
      if (!res.ok) throw new Error("Failed to unsubscribe");
      setUnsubscribed(true);
    } catch {
      setError("Failed to unsubscribe. Please try again.");
    } finally {
      setSaving(false);
      setConfirmUnsubAll(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (unsubscribed) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="text-2xl font-bold">You&apos;ve been unsubscribed</h1>
          <p className="text-muted-foreground">
            You&apos;ve been removed from all email lists. You won&apos;t receive any more emails from us.
          </p>
          <p className="text-muted-foreground text-sm">Changed your mind? You can re-subscribe any time.</p>
          <Link href="/" className="inline-block mt-2 text-sm underline underline-offset-4 hover:text-primary">
            Return home
          </Link>
        </div>
      </main>
    );
  }

  if (error || !prefs) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <p className="text-destructive font-medium">{error ?? "Something went wrong."}</p>
          <Link href="/" className="text-sm underline underline-offset-4 hover:text-primary">
            Return home
          </Link>
        </div>
      </main>
    );
  }

  const wantsDevotionals = selectedTags.has("devotionals");

  return (
    <main className="max-w-xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Email preferences</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Subscribed as <span className="font-medium text-foreground">{prefs.email}</span>
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="pref-name">
            Name (optional)
          </label>
          <input
            id="pref-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Subscriptions */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Subscriptions</legend>
          <p className="text-xs text-muted-foreground">
            Choose which emails you&apos;d like to receive.
          </p>
          <div className="space-y-3 mt-2">
            {SUBSCRIPTION_TYPES.map((type) => (
              <label key={type.tag} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedTags.has(type.tag)}
                  onChange={() => toggleTag(type.tag)}
                  className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                />
                <div>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {type.label}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Devotional-specific settings — only visible when devotionals is checked */}
        {wantsDevotionals && (
          <div className="space-y-6 rounded-xl border border-border p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Daily devotional settings
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="pref-sendHour">
                Delivery time
              </label>
              <select
                id="pref-sendHour"
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
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Preferences saved.
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save preferences
        </button>
      </form>

      {/* Unsubscribe from everything */}
      <div className="border-t border-border pt-8 space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Unsubscribe from everything</h2>
        {!confirmUnsubAll ? (
          <button
            type="button"
            onClick={() => setConfirmUnsubAll(true)}
            className="text-sm text-muted-foreground hover:text-destructive underline underline-offset-4"
          >
            Remove me from all email lists
          </button>
        ) : (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
            <div className="flex gap-2 items-start">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
              <p className="text-sm text-foreground">
                This will unsubscribe you from all church emails. You can re-subscribe any time.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleUnsubscribeAll}
                disabled={saving}
                className="rounded-md bg-destructive px-4 py-1.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
              >
                Yes, unsubscribe me
              </button>
              <button
                type="button"
                onClick={() => setConfirmUnsubAll(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
          </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PreferencesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      }
    >
      <PreferencesInner />
    </Suspense>
  );
}
