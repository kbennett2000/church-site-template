import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/sections/contact-form";
import { getStaff } from "@/content/staff";
import { churchInfo } from "@/lib/church-info";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${churchInfo.name}. Staff directory, office hours, and a contact form.`,
};

export default function ContactPage() {
  const staff = getStaff();
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Contact
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            How to reach us.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Phone calls go to a real person during office hours. Emails go to
            the staff member who&apos;s best able to answer.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <h2 className="font-serif text-3xl">Send a message</h2>
            <p className="mt-3 text-muted-foreground">
              We answer most emails within a day or two during the work week.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-7">
              <h3 className="font-serif text-xl">The basics</h3>
              <ul className="mt-5 space-y-5 text-sm">
                <InfoRow icon={MapPin} label="Address">
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
                </InfoRow>
                <InfoRow icon={Phone} label="Phone">
                  <a href={churchInfo.phoneHref} className="hover:text-accent">
                    {churchInfo.phone}
                  </a>
                </InfoRow>
                <InfoRow icon={Mail} label="Email">
                  <a href={churchInfo.emailHref} className="hover:text-accent">
                    {churchInfo.email}
                  </a>
                </InfoRow>
                <InfoRow icon={Clock} label="Office hours">
                  {churchInfo.officeHours} · 9 AM to 4 PM
                  <br />
                  <span className="text-muted-foreground">
                    Closed Fri–Sun outside of services
                  </span>
                </InfoRow>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-muted/40 py-20 md:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Staff directory
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Who you&apos;re writing to.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Email directly if you know who you need — otherwise the contact
              form above gets routed to the right person.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((person) => (
              <li
                key={person.name}
                className="flex flex-col rounded-xl border border-border bg-card p-6"
              >
                <Image
                  src={person.photo}
                  alt={person.name}
                  width={88}
                  height={88}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <h3 className="mt-5 font-serif text-xl">{person.name}</h3>
                <p className="mt-0.5 text-sm font-medium text-accent">
                  {person.role}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {person.bio}
                </p>
                {person.email ? (
                  <a
                    href={`mailto:${person.email}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent"
                  >
                    <Mail className="h-4 w-4 text-accent" />
                    {person.email}
                  </a>
                ) : (
                  <a
                    href={churchInfo.emailHref}
                    className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
                  >
                    <Mail className="h-4 w-4 text-accent" />
                    Contact via church office
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 text-foreground/85">{children}</div>
      </div>
    </li>
  );
}
