"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServeInterestButton({ roleId, roleTitle }: { roleId: string; roleTitle: string }) {
  const [done, setDone] = useState(false);

  function onClick() {
    console.log("[Serve interest]", { roleId, roleTitle });
    setDone(true);
  }

  if (done) {
    return (
      <div className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary">
        <Check className="h-4 w-4" />
        We&apos;ll be in touch
      </div>
    );
  }

  return (
    <Button onClick={onClick} variant="accent" className="w-full">
      I&apos;m interested
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
