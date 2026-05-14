"use client";

import { useState } from "react";
import { Check, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Stage = "idle" | "form" | "loading" | "done" | "error";

export function ServeInterestButton({ roleId, roleTitle }: { roleId: string; roleTitle: string }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStage("loading");
    try {
      const res = await fetch("/api/submit/serve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, roleId, roleTitle }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unknown error");
      setStage("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStage("error");
    }
  }

  if (stage === "done") {
    return (
      <div className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary">
        <Check className="h-4 w-4" />
        We&apos;ll be in touch
      </div>
    );
  }

  if (stage === "form" || stage === "loading" || stage === "error") {
    return (
      <form onSubmit={onSubmit} className="space-y-2.5">
        <Input
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={stage === "loading"}
          autoComplete="name"
        />
        <Input
          required
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={stage === "loading"}
          autoComplete="email"
        />
        {stage === "error" ? (
          <p className="text-xs text-destructive">{errorMsg}</p>
        ) : null}
        <Button type="submit" variant="accent" className="w-full" disabled={stage === "loading"}>
          <Send className="h-4 w-4" />
          {stage === "loading" ? "Sending…" : "Submit interest"}
        </Button>
      </form>
    );
  }

  return (
    <Button onClick={() => setStage("form")} variant="accent" className="w-full">
      I&apos;m interested
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
