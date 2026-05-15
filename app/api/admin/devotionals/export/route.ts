import { NextResponse } from "next/server";
import { getActiveSubscribersForExport } from "@/lib/db/queries";

// GET /api/admin/devotionals/export
// Returns active subscribers as a CSV download. Protected by middleware Basic Auth.
export async function GET() {
  const rows = await getActiveSubscribersForExport();

  const header = "email,name,timezone,send_hour,subscribed_at,verified_at\n";
  const csvRows = rows.map((r) => {
    const cols = [
      r.email,
      r.name ?? "",
      r.timezone,
      String(r.sendHour),
      r.createdAt.toISOString(),
      r.verifiedAt?.toISOString() ?? "",
    ];
    return cols.map((c) => `"${c.replace(/"/g, '""')}"`).join(",");
  });

  const csv = header + csvRows.join("\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="devotional-subscribers-${date}.csv"`,
    },
  });
}
