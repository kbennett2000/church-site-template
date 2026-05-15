"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

// Reads ?signedOut=1 from the URL on mount and shows a dismissible banner
// confirming the sign-out. Strips the param from the address bar after
// rendering so a refresh doesn't re-show it.
export function SignedOutBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("signedOut") === "1") {
      setVisible(true);
      params.delete("signedOut");
      const next = params.toString();
      const newUrl =
        window.location.pathname + (next ? `?${next}` : "") + window.location.hash;
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-4 z-50 mx-auto flex w-fit max-w-[92vw] items-center gap-3 rounded-full border bg-card px-4 py-2 text-sm shadow-md"
    >
      <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
      <span>Signed out of admin.</span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="ml-1 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
