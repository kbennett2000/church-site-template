import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { churchInfo } from "@/lib/church-info";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"],
});

const siteDescription = `${churchInfo.tagline} ${
  churchInfo.primaryService
    ? `${churchInfo.primaryService.day}s at ${churchInfo.primaryService.time}.`
    : ""
}`.trim();

export const metadata: Metadata = {
  title: {
    default: `${churchInfo.name} — ${churchInfo.address.city}, ${churchInfo.address.state}`,
    template: `%s · ${churchInfo.name}`,
  },
  description: siteDescription,
  openGraph: {
    title: `${churchInfo.name} — ${churchInfo.address.city}, ${churchInfo.address.state}`,
    description: siteDescription,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
