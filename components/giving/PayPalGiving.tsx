import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PayPalGiving({ url }: { url: string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Button asChild variant="accent" size="lg" className="px-10 text-base">
        <a href={url} target="_blank" rel="noreferrer">
          Donate via PayPal
          <ArrowRight className="h-4 w-4" />
        </a>
      </Button>
      <p className="text-xs text-muted-foreground">
        Powered by PayPal.
      </p>
    </div>
  );
}
