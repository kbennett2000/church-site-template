import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { churchInfo } from "@/lib/church-info";
import { GiveButton } from "@/components/GiveButton";
import { SocialLinks } from "@/components/social-links";

const secondaryLinks = [
  { label: "About Us", href: "/about" },
  { label: "What We Believe", href: "/beliefs" },
  { label: "Staff & Elders", href: "/about#staff" },
  { label: "Give", href: "/give" },
  { label: "Contact", href: "/connect/contact" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="container grid gap-10 py-14 md:grid-cols-3">
        <div>
          {/*
            Template constraint — KEEP THIS WORKING ACROSS NAME LENGTHS:
            see the matching comment in /components/site-header.tsx. The
            grid column at md is ~190px wide, narrower than many church
            names render as a single line. The name span gets min-w-0 +
            leading-tight so it wraps cleanly to a second line instead
            of overflowing the column. The avatar is shrink-0 so it
            stays square.
          */}
          <div className="flex items-center gap-2.5">
            {churchInfo.logo ? (
              <Image
                src={churchInfo.logo}
                alt={churchInfo.name}
                width={240}
                height={48}
                className="h-10 w-auto"
              />
            ) : (
              <>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-serif text-base">
                  {(churchInfo.shortName || churchInfo.name).charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 font-serif text-lg leading-tight">
                  {churchInfo.name}
                </span>
              </>
            )}
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {churchInfo.tagline}
            {churchInfo.primaryService
              ? ` ${churchInfo.primaryService.day}s at ${churchInfo.primaryService.time}`
              : ""}{" "}
            — we&apos;d love to meet you.
          </p>
          <div className="mt-5">
            <GiveButton variant="secondary" />
          </div>
          <SocialLinks links={churchInfo.social} className="mt-4" />
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Visit
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-accent" />
              <a
                href={churchInfo.address.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent"
              >
                {churchInfo.address.street}
                <br />
                {churchInfo.address.city}, {churchInfo.address.state}{" "}
                {churchInfo.address.zip}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-accent" />
              <a href={churchInfo.phoneHref} className="hover:text-accent">
                {churchInfo.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-accent" />
              <a href={churchInfo.emailHref} className="hover:text-accent">
                {churchInfo.email}
              </a>
            </li>
            <li className="pt-1 text-muted-foreground">
              Office hours: {churchInfo.officeHours}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            More
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {secondaryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-start justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {churchInfo.name}. All rights reserved.
          </p>
          <p>
            Made with care in {churchInfo.address.city},{" "}
            {churchInfo.address.state}.
          </p>
        </div>
      </div>
    </footer>
  );
}
