import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Unsubscribed",
};

// Landing target after GET /api/devotionals/unsubscribe redirect.
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  if (status === "success" || status === "already") {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="text-2xl font-bold">You&apos;ve been unsubscribed</h1>
          <p className="text-muted-foreground">
            {status === "already"
              ? "You were already unsubscribed. No further emails will be sent."
              : "You've been removed from our devotional email list. You won't receive any more emails from us."}
          </p>
          <p className="text-muted-foreground text-sm">
            Changed your mind? You can re-subscribe any time.
          </p>
          <Link
            href="/devotionals"
            className="inline-block mt-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Browse reading plans
          </Link>
        </div>
      </main>
    );
  }

  // "invalid" or no status
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <XCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-bold">Invalid unsubscribe link</h1>
        <p className="text-muted-foreground">
          This unsubscribe link isn&apos;t valid. If you&apos;d like to
          unsubscribe, use the link in one of your devotional emails.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-sm underline underline-offset-4 hover:text-primary"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
