import type { Metadata } from "next";
import Link from "next/link";
import {
  getRecentDigestSendLogs,
  findActiveSubscribersForDigest,
} from "@/lib/db/queries";
import { getDigestSettings } from "@/lib/digest/settings";
import { AdminHeaderControls } from "@/components/admin/admin-header-controls";

export const metadata: Metadata = { title: "Weekly Digest — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDigestPage() {
  const [settings, logs, subscribers] = await Promise.all([
    Promise.resolve(getDigestSettings()),
    getRecentDigestSendLogs(20),
    findActiveSubscribersForDigest(),
  ]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Weekly digest</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/digest/preview"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Preview this week →
          </Link>
          <AdminHeaderControls />
        </div>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="text-lg font-semibold">{settings.isEnabled ? "Enabled" : "Disabled"}</p>
        </div>
        <div className="rounded-lg border bg-card p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Subscribers</p>
          <p className="text-3xl font-bold tabular-nums">{subscribers.length.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-card p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Send day</p>
          <p className="text-lg font-semibold">{settings.sendDay}</p>
        </div>
        <div className="rounded-lg border bg-card p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Send time</p>
          <p className="text-lg font-semibold">{settings.sendHour}:00</p>
          <p className="text-xs text-muted-foreground">{settings.sendTimezone}</p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Recent sends
        </h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">Week of</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">Sent at (UTC)</th>
                <th className="text-right px-4 py-2 font-medium text-muted-foreground">Sent</th>
                <th className="text-right px-4 py-2 font-medium text-muted-foreground">Failed</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-card">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-2 tabular-nums font-mono text-xs">{log.weekStart}</td>
                  <td className="px-4 py-2 tabular-nums text-xs text-muted-foreground">
                    {log.sentAt.toISOString().replace("T", " ").slice(0, 16)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-green-700 font-medium">{log.sent}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-red-600 font-medium">{log.failed}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    No digests have been sent yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="text-xs text-muted-foreground pt-4 border-t">
        <Link href="/" className="underline underline-offset-4 hover:text-foreground">
          ← Back to site
        </Link>
      </div>
    </main>
  );
}
