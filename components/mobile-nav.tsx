"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav, churchInfo } from "@/lib/church-info";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-10 w-10 place-items-center rounded-md text-foreground hover:bg-muted lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div
          className="fixed inset-0 top-16 z-40 overflow-y-auto bg-background lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="container py-6">
            <nav aria-label="Mobile" className="flex flex-col">
              {nav.map((item) => {
                const hasChildren = "children" in item && item.children;
                return (
                  <div
                    key={item.label}
                    className="border-b border-border py-3 last:border-0"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block font-serif text-xl text-foreground"
                    >
                      {item.label}
                    </Link>
                    {hasChildren ? (
                      <div className="mt-2 flex flex-col gap-1 pl-1">
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="py-1.5 text-sm text-muted-foreground"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href="/visit" onClick={() => setOpen(false)}>
                  Plan a Visit
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={churchInfo.address.mapsUrl} target="_blank" rel="noreferrer">
                  Get Directions
                </a>
              </Button>
            </div>

            <div className="mt-8 space-y-1 text-sm text-muted-foreground">
              <p>{churchInfo.address.full}</p>
              <p>
                <a href={churchInfo.phoneHref}>{churchInfo.phone}</a>
              </p>
              <p>
                <a href={churchInfo.emailHref}>{churchInfo.email}</a>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
