import type { Metadata } from "next";
import Link from "next/link";
import {
  getSubscriberStats,
  getPlanSubscriberCounts,
  getRecentActivity,
  getRecentSendLogs,
} from "@/lib/db/queries";
import { getAllReadingPlans } from "@/content/devotionals";

export const metadata: Metadata = {
  title: "Devotional Subscribers — Admin",
};

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-5 space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
}

export default async function AdminDevotionalsPage() {
  const [stats, planCounts, recent, allPlans, sendLogs] = await Promise.all([
    getSubscriberStats(),
    getPlanSubscriberCounts(),
    getRecentActivity(20),
    Promise.resolve(getAllReadingPlans()),
    getRecentSendLogs(10),
  ]);

  const planTitleMap = Object.fromEntries(allPlans.map((p) => [p.slug, p.title]));

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Devotional subscribers</h1>
        <a
          href="/api/admin/devotionals/export"
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          Export CSV
        </a>
      </div>

      {/* Subscriber stats */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Unsubscribed" value={stats.unsubscribed} />
          <StatCard label="Bounced" value={stats.bounced} />
        </div>
      </section>

      {/* Per-plan counts */}
      {planCounts.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Active subscribers by plan
          </h2>
          <div className="rounded-lg border divide-y overflow-hidden">
            {planCounts.map((row) => (
              <div key={row.planSlug} className="flex items-center justify-between px-4 py-3 bg-card">
                <span className="text-sm font-medium">
                  {planTitleMap[row.planSlug] ?? row.planSlug}
                </span>
                <span className="text-sm font-semibold tabular-nums">{row.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent sign-ups */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Recent sign-ups (last 20)
        </h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-card">
              {recent.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-4 py-2 font-mono text-xs">{sub.email}</td>
                  <td className="px-4 py-2 text-muted-foreground">{sub.name ?? "—"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        sub.status === "active"
                          ? "bg-green-100 text-green-800"
                          : sub.status === "pending_verification"
                          ? "bg-amber-100 text-amber-800"
                          : sub.status === "bounced"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {sub.status === "pending_verification" ? "pending" : sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground tabular-nums text-xs">
                    {sub.createdAt.toISOString().slice(0, 10)}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    No subscribers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Send log */}
      {sendLogs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Recent send runs (last 10)
          </h2>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Run at (UTC)</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">Sent</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">Skipped</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">Failed</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-card">
                {sendLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-2 tabular-nums font-mono text-xs">{log.date}</td>
                    <td className="px-4 py-2 tabular-nums text-xs text-muted-foreground">
                      {log.runAt.toISOString().replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums text-green-700 font-medium">{log.sent}</td>
                    <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">{log.skipped}</td>
                    <td className="px-4 py-2 text-right tabular-nums text-red-600 font-medium">{log.failed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Quick links */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Tools
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/devotionals/test"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Send test email
          </Link>
          <Link
            href="/admin/devotionals/backfill"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Backfill missed sends
          </Link>
          <Link
            href="/admin/devotionals/preview/simple"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Preview email templates
          </Link>
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
