import type { Metadata } from "next";
import Link from "next/link";
import { render } from "@react-email/render";
import { composeDigest, describePayload } from "@/lib/digest/compose";
import { fixturePayload } from "@/lib/digest/fixture";
import { getDigestSettings } from "@/lib/digest/settings";
import { resolveEmailImageUrl } from "@/lib/email/logo-url";
import { DigestEmail } from "@/emails/digest/DigestEmail";
import { findActiveSubscribersForDigest, getDigestSendLog } from "@/lib/db/queries";
import { isEmptyPayload } from "@/lib/digest/types";
import { features } from "@/content/site";
import { forceLightModePreview } from "@/lib/admin/email-preview";
import { SendTestForm } from "./SendTestForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Weekly Digest Preview — Admin",
};

interface PreviewSearchParams {
  fixture?: string;
}

export default async function DigestPreviewPage({
  searchParams,
}: {
  searchParams: Promise<PreviewSearchParams>;
}) {
  const { fixture } = await searchParams;
  const useFixture = fixture === "1";

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${process.env.VERCEL_URL ?? "localhost:3000"}`;
  // Mirror composeDigest()'s normalization so the fixture path renders logos
  // the same way the live path does. (composeDigest already normalizes for
  // livePayload; we just need to match for fixturePayload.)
  const rawSettings = getDigestSettings();
  const settings = {
    ...rawSettings,
    logoUrl: resolveEmailImageUrl(rawSettings.logoUrl, baseUrl),
  };

  const livePayload = composeDigest({ siteUrl: baseUrl });
  const payload = useFixture ? fixturePayload(settings, baseUrl) : livePayload;

  const [subscribers, prior] = await Promise.all([
    findActiveSubscribersForDigest().catch(() => []),
    getDigestSendLog(payload.weekStart).catch(() => null),
  ]);

  const previewProps = {
    payload,
    subscriber: {
      name: "Preview Recipient",
      email: "preview@example.com",
      unsubscribeToken: "preview-token",
    },
  };

  const html = forceLightModePreview(await render(DigestEmail(previewProps)));
  const description = describePayload(payload);
  const empty = isEmptyPayload(payload);

  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/digest"
            className="text-sm text-muted-foreground hover:text-foreground shrink-0"
          >
            ← Admin
          </Link>
          <span className="text-muted-foreground shrink-0">/</span>
          <span className="text-sm font-medium truncate">
            Digest preview · Week of {payload.weekStart} – {payload.weekEnd}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={useFixture ? "/admin/digest/preview" : "/admin/digest/preview?fixture=1"}
            className="text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground"
          >
            {useFixture ? "Show live content" : "Show fixture content"}
          </Link>
        </div>
      </div>

      {/* PREVIEW marker */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-semibold text-amber-900">
        PREVIEW — Not yet sent
        {prior && (
          <span className="ml-2 font-normal text-amber-800">
            · This week was already sent at {prior.sentAt.toISOString().slice(0, 16).replace("T", " ")} UTC
          </span>
        )}
        {useFixture && (
          <span className="ml-2 font-normal text-amber-800">
            · Using fixture data (not live CMS content)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] lg:h-[calc(100vh-100px)]">
        {/* Email render — isolated in an iframe so the email's CSS can't
            collide with the admin shell's Tailwind reset. */}
        <div className="bg-zinc-100 p-4 sm:p-6 lg:overflow-hidden">
          <iframe
            srcDoc={html}
            title="Digest email preview"
            className="block w-full max-w-[700px] mx-auto bg-white border border-zinc-200 rounded-md shadow-sm h-[1200px] lg:h-full"
          />
        </div>

        {/* Sidebar */}
        <aside className="border-t lg:border-t-0 lg:border-l border-border bg-card lg:overflow-y-auto p-5 space-y-6 text-sm">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Send window
            </h2>
            <p>
              <strong>{settings.sendDay}</strong> at <strong>{settings.sendHour}:00</strong>
              <span className="text-muted-foreground"> ({settings.sendTimezone})</span>
            </p>
            <p className="text-muted-foreground mt-1">
              Covers <span className="font-mono">{payload.weekStart}</span> →{" "}
              <span className="font-mono">{payload.weekEnd}</span>
            </p>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Audience
            </h2>
            <p>
              <strong>{subscribers.length.toLocaleString()}</strong> subscriber{subscribers.length === 1 ? "" : "s"} will receive this
            </p>
            {!features?.digest && (
              <p className="mt-1 text-xs text-amber-700">
                ⚠ <code>features.digest</code> is off — the public /digest page will 404.
              </p>
            )}
            {!settings.isEnabled && (
              <p className="mt-1 text-xs text-amber-700">
                ⚠ Digest is currently <strong>disabled</strong> in digest-settings.json — cron will skip.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Sections
            </h2>
            <ul className="space-y-1.5">
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">Pastor&apos;s note</span>
                <span>{description.note}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">Announcements</span>
                <span>{description.announcements}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">Events</span>
                <span>{description.events}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">Sermons</span>
                <span>{description.sermons}</span>
              </li>
            </ul>
            {empty && (
              <p className="mt-3 text-xs text-amber-700">
                No content in any section — the cron will skip sending and log{" "}
                <code>no_content</code> rather than mail an empty digest.
              </p>
            )}
          </section>

          <section className="border-t border-border pt-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Send a test to yourself
            </h2>
            <SendTestForm />
            <p className="mt-3 text-xs text-muted-foreground">
              Renders this digest and emails it to one address. Does not mark
              the week as sent.
            </p>
          </section>

          <section className="border-t border-border pt-5 text-xs text-muted-foreground">
            <p>
              When you&apos;re ready,{" "}
              <Link href="/admin/digest" className="underline">
                go back
              </Link>{" "}
              to see send history.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
