import { HelpCircle } from "lucide-react";

// Small hoverable / focusable help indicator. Sits next to a form label and
// shows a styled tooltip on hover (desktop), keyboard focus, or tap (mobile).
// Uses CSS-only transitions — no JS, no popover library.
//
// Position: tooltip appears above the icon, centered. If the icon is very
// close to the right viewport edge the tooltip may clip; for the prototype
// that trade-off is acceptable. A production version would use floating-ui
// or @radix-ui/react-tooltip for proper collision detection.

export function HelpIcon({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label={text}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition hover:text-accent focus:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      <span
        role="tooltip"
        className="invisible pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-60 -translate-x-1/2 rounded-md border border-border bg-popover px-3 py-2 text-xs font-normal leading-snug text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
