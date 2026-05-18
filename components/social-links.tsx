import {
  getSocialIcon,
  getSocialPlatformLabel,
  type SocialLink,
} from "@/lib/social";
import { cn } from "@/lib/utils";

type Props = {
  links: SocialLink[];
  className?: string;
};

function labelFor(link: SocialLink): string {
  if (link.platform === "other") {
    if (link.label) return link.label;
    try {
      return new URL(link.url).hostname.replace(/^www\./, "");
    } catch {
      return "Website";
    }
  }
  return link.label ?? getSocialPlatformLabel(link.platform);
}

export function SocialLinks({ links, className }: Props) {
  if (!links || links.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {links.map((link, i) => {
        const Icon = getSocialIcon(link.platform);
        const label = labelFor(link);
        return (
          <a
            key={`${link.platform}-${i}`}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/70 transition hover:bg-card hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
