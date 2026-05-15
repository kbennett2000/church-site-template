import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email",
};

// This page is the landing target after the GET /api/devotionals/verify redirect.
// The API route does the actual DB update and then redirects here with ?status=.
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; email?: string }>;
}) {
  const { status, email } = await searchParams;

  if (status === "success") {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="text-2xl font-bold">You&apos;re subscribed!</h1>
          <p className="text-muted-foreground">
            Your email has been confirmed and your subscription is active.
            Your first devotional will arrive tomorrow morning.
          </p>
          <Link
            href="/devotionals"
            className="inline-block mt-4 text-sm underline underline-offset-4 hover:text-primary"
          >
            Browse reading plans
          </Link>
        </div>
      </main>
    );
  }

  if (status === "expired") {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <Clock className="mx-auto h-12 w-12 text-amber-500" />
          <h1 className="text-2xl font-bold">Link expired</h1>
          <p className="text-muted-foreground">
            Verification links expire after 24 hours. Subscribe again to receive
            a fresh link{email ? ` for ${email}` : ""}.
          </p>
          <Link
            href="/devotionals"
            className="inline-block mt-4 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Subscribe again
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
        <h1 className="text-2xl font-bold">Invalid link</h1>
        <p className="text-muted-foreground">
          This verification link isn&apos;t valid. It may have already been
          used or the URL may be incomplete.
        </p>
        <Link
          href="/devotionals"
          className="inline-block mt-4 text-sm underline underline-offset-4 hover:text-primary"
        >
          Return to devotionals
        </Link>
      </div>
    </main>
  );
}
