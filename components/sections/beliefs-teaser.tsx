import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { churchInfo } from "@/lib/church-info";

export function BeliefsTeaser() {
  return (
    <section className="container py-20 md:py-28">
      <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.5),transparent_50%)]"
            aria-hidden="true"
          />
        </div>

        <div className="relative grid gap-8 p-10 md:grid-cols-5 md:gap-12 md:p-16">
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
              What we believe
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
              The historic Christian faith — lived out in our community.
            </h2>
          </div>
          <div className="md:col-span-3">
            <p className="text-lg leading-relaxed text-primary-foreground/90">
              We believe the Bible is God&apos;s word, that Jesus is who he
              said he was, and that the gospel is good news for everyone — not
              just the people who already have it together. We love Jesus,
              the Scriptures, and our neighbors here in {churchInfo.address.city}.
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-7 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/beliefs">
                Read our full statement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
