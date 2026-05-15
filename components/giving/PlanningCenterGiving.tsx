import { ArrowRight } from "lucide-react";

export function PlanningCenterGiving({
  url,
  mode,
}: {
  url: string;
  mode: "modal" | "page";
}) {
  const sharedClass =
    "inline-flex items-center gap-2 rounded-md bg-accent px-8 py-3 text-base font-medium text-accent-foreground shadow-sm transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {mode === "modal" ? (
        <a
          href={url}
          data-open-in-church-center-modal="true"
          className={sharedClass}
        >
          Give Online
          <ArrowRight className="h-4 w-4" />
        </a>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className={sharedClass}
        >
          Give Online
          <ArrowRight className="h-4 w-4" />
        </a>
      )}
      <p className="text-xs text-muted-foreground">
        Powered by Planning Center Giving.
      </p>
    </div>
  );
}
