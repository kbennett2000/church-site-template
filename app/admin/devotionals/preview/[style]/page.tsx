import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { render } from "@react-email/render";
import { SoapEmail } from "@/emails/devotional/SoapEmail";
import { SimpleEmail } from "@/emails/devotional/SimpleEmail";
import { LectioEmail } from "@/emails/devotional/LectioEmail";
import { getDevotionalEmailSettings } from "@/lib/devotionals/email-settings";
import { churchData } from "@/content/site";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Email Preview — Admin",
};

const STYLES = ["soap", "simple", "lectio_divina"] as const;
type Style = (typeof STYLES)[number];

const SAMPLE = {
  subscriber: {
    name: "Alex Morgan",
    email: "alex@example.com",
    unsubscribeToken: "preview-token-00000000000000000000000000000000",
  },
  plan: {
    slug: "sample-plan",
    title: "Sample Reading Plan",
    defaultTranslation: "WEB" as const,
  },
  entry: {
    date: new Date().toISOString().slice(0, 10),
    scriptureReference: "Psalm 23",
    title: "The Lord Is My Shepherd",
    leaderNotes:
      "This psalm has comforted believers for thousands of years. Notice how the imagery shifts from a shepherd in the fields (vv. 1–4) to a host at a table (vv. 5–6). Both images speak of God's abundant care.",
  },
  scriptureHtml: `<p><sup style="font-size:0.65em;color:#9ca3af;">1</sup>The Lord is my shepherd; I shall not want. <sup style="font-size:0.65em;color:#9ca3af;">2</sup>He makes me lie down in green pastures. He leads me beside still waters. <sup style="font-size:0.65em;color:#9ca3af;">3</sup>He restores my soul. He leads me in paths of righteousness for his name's sake. <sup style="font-size:0.65em;color:#9ca3af;">4</sup>Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me. <sup style="font-size:0.65em;color:#9ca3af;">5</sup>You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows. <sup style="font-size:0.65em;color:#9ca3af;">6</sup>Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the Lord forever.</p>`,
  scriptureText:
    "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures...",
  scriptureAttribution: "",
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ style: string }>;
}) {
  const { style } = await params;
  if (!STYLES.includes(style as Style)) notFound();

  const settings = getDevotionalEmailSettings();
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${process.env.VERCEL_URL ?? "localhost:3000"}`;
  const churchName = churchData?.name ?? settings.senderName;

  const settingsWithUrl = {
    ...settings,
    senderName: churchName,
    siteUrl: baseUrl,
  };

  const props = {
    ...SAMPLE,
    plan: { ...SAMPLE.plan, style: style as Style },
    settings: settingsWithUrl,
  };

  const Component =
    style === "soap" ? SoapEmail : style === "lectio_divina" ? LectioEmail : SimpleEmail;

  const html = await render(Component(props));

  const styleLabels: Record<string, string> = {
    soap: "SOAP",
    simple: "Simple",
    lectio_divina: "Lectio Divina",
  };

  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/devotionals"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Admin
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">
            {styleLabels[style]} email preview
          </span>
        </div>
        <div className="flex items-center gap-2">
          {STYLES.map((s) => (
            <Link
              key={s}
              href={`/admin/devotionals/preview/${s}`}
              className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                s === style
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {styleLabels[s]}
            </Link>
          ))}
        </div>
      </div>

      {/* Preview notice */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800">
        Preview with sample data — subscriber, date, and scripture are all placeholders
      </div>

      {/* Email rendered in an iframe for accurate email-client isolation */}
      <iframe
        srcDoc={html}
        title={`${styleLabels[style]} email preview`}
        className="w-full border-0"
        style={{ height: "calc(100vh - 100px)" }}
      />
    </main>
  );
}
