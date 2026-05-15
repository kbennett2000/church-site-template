"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

export function DigestSubscribeForm() {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/devotionals/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || null,
          tags: ["digest"],
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

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 space-y-4"
    >
      <h3 className="font-serif text-xl">Subscribe to the weekly digest</h3>
      <p className="text-sm text-muted-foreground">
        Delivered once a week — announcements, upcoming events, recent sermons,
        and a note from the pastor.
      </p>

      <div className="space-y-3">
        <div>
          <label htmlFor="digest-email" className="sr-only">Email address</label>
          <input
            id="digest-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="digest-name" className="sr-only">Name (optional)</label>
          <input
            id="digest-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
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
