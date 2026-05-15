"use client";

import { useEffect, useRef } from "react";

// Subsplash provides an embed code snippet (typically a <script> tag) that
// renders an iframed giving form. This client component injects that snippet
// into the DOM at runtime — it cannot be rendered server-side because the
// script tag must execute in the browser context.
export function SubsplashEmbed({ embedCode }: { embedCode: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !embedCode.trim()) return;

    // Parse the raw embed HTML and re-create script nodes so the browser
    // actually executes them (innerHTML assignment won't run scripts).
    const temp = document.createElement("div");
    temp.innerHTML = embedCode;
    el.innerHTML = "";

    Array.from(temp.childNodes).forEach((node) => {
      if (node.nodeName === "SCRIPT") {
        const original = node as HTMLScriptElement;
        const script = document.createElement("script");
        if (original.src) script.src = original.src;
        if (original.textContent) script.textContent = original.textContent;
        script.async = true;
        el.appendChild(script);
      } else {
        el.appendChild(node.cloneNode(true));
      }
    });
  }, [embedCode]);

  if (!embedCode.trim()) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Subsplash embed code not configured.{" "}
          <a href="/admin" className="text-accent hover:underline">
            Add it in the CMS
          </a>{" "}
          under Giving → Subsplash Settings.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="min-h-[400px]" />;
}
