// Redirect to the unified preferences page.
// The old URL (/devotionals/manage?token=...) is preserved in already-sent
// emails — this server redirect means subscribers with old links still land
// on the right page without a 404.
import { redirect } from "next/navigation";

export default async function ManageRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const dest = token ? `/preferences?token=${token}` : "/preferences";
  redirect(dest);
}
