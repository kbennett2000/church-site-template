import Link from "next/link";
import { Button } from "@/components/ui/button";
import { givingConfig, getGivingHref } from "@/lib/giving";
import { cn } from "@/lib/utils";

// Variants map to contexts:
//   "primary"   — standalone CTA (e.g. /give hero, homepage section). Large, accent-filled.
//   "secondary" — lower-emphasis placement (e.g. footer). Default size, outline.
//   "nav"       — header bar, alongside other nav actions. Small, outline.
type GiveButtonVariant = "primary" | "secondary" | "nav";

const sizeMap: Record<GiveButtonVariant, "lg" | "default" | "sm"> = {
  primary: "lg",
  secondary: "default",
  nav: "sm",
};

export function GiveButton({
  variant = "primary",
  className,
}: {
  variant?: GiveButtonVariant;
  className?: string;
}) {
  const href = getGivingHref(givingConfig);
  const label = givingConfig.callToAction || "Give";
  const buttonVariant = variant === "primary" ? "accent" : "outline";
  const isInternal = href.startsWith("/");

  // Planning Center modal: script intercepts clicks on hrefs containing
  // ?open-in-church-center-modal=true — no special data attribute needed,
  // just the URL. We still open in the same tab so the modal overlay works.
  const opensNewTab =
    !isInternal && givingConfig.displayMode === "newTab";

  if (isInternal) {
    return (
      <Button
        asChild
        variant={buttonVariant}
        size={sizeMap[variant]}
        className={cn(className)}
      >
        <Link href={href}>{label}</Link>
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant={buttonVariant}
      size={sizeMap[variant]}
      className={cn(className)}
    >
      <a
        href={href}
        {...(opensNewTab ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {label}
      </a>
    </Button>
  );
}
