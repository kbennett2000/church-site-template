import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { churchInfo, type Service } from "@/lib/church-info";
import { siteContent } from "@/content/site";

type ServiceGroup = { day: string; times: string[] };

function serviceGroups(services: readonly Service[]): ServiceGroup[] {
  const map = new Map<string, string[]>();
  for (const s of services) {
    if (!s.day || !s.time) continue;
    const existing = map.get(s.day);
    if (existing) existing.push(s.time);
    else map.set(s.day, [s.time]);
  }
  return Array.from(map.entries()).map(([day, times]) => ({ day, times }));
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/placeholders/hero.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/55 to-foreground/80" />
      </div>

      <div className="container relative flex min-h-[78vh] flex-col justify-center py-20 text-background md:min-h-[82vh] md:py-28">
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-background/75 animate-fade-up">
          {churchInfo.name} · {churchInfo.address.city}, {churchInfo.address.state}
        </p>
        <h1 className="mt-5 max-w-3xl text-balance font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up">
          {siteContent.home.hero.headline}
        </h1>

        <div className="mt-8 flex flex-col gap-4 text-background/90 sm:flex-row sm:items-center sm:gap-8 animate-fade-up">
          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <span className="text-lg">
              {serviceGroups(churchInfo.services).map((group, i) => (
                <span key={group.day} className="block">
                  <span className="font-medium">
                    {group.day}s · {group.times.join(" & ")}
                  </span>
                  {i === 0 && churchInfo.primaryService?.note ? (
                    <span className="hidden text-background/70 sm:inline">
                      {" "}· {churchInfo.primaryService.note}
                    </span>
                  ) : null}
                </span>
              ))}
              {churchInfo.services.length === 0 && (
                <span className="font-medium">Sundays</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="h-5 w-5 text-accent" />
            <span className="text-lg">{churchInfo.address.full}</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row animate-fade-up">
          <Button asChild size="lg" variant="accent">
            <Link href="/visit">
              Plan Your Visit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-background/40 bg-transparent text-background hover:bg-background/10 hover:text-background"
          >
            <a
              href={churchInfo.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
