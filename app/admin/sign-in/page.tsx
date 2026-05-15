import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/auth";
import { adminAuth } from "@/content/site";
import { churchInfo } from "@/lib/church-info";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function AdminSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  if (adminAuth.provider !== "google") {
    return <BasicAuthNotice />;
  }
  return <GoogleSignIn searchParamsPromise={searchParams} />;
}

function BasicAuthNotice() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-12">
      <div className="space-y-4 rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold">Sign-in not used</h1>
        <p className="text-muted-foreground">
          This site uses a shared password for admin access, not per-person
          sign-in. You should have been prompted by your browser for a
          username and password when visiting the admin pages.
        </p>
        <p className="text-sm text-muted-foreground">
          If you reached this page by mistake, head back to the{" "}
          <Link href="/" className="underline underline-offset-4 hover:text-foreground">
            home page
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

async function GoogleSignIn({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParamsPromise;
  const callbackUrl = params.callbackUrl ?? "/admin/devotionals";
  const error = params.error;

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-lg flex-col justify-center px-4 py-12">
      <div className="space-y-6 rounded-2xl border bg-card p-8 shadow-sm">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {churchInfo.name}
          </p>
          <h1 className="font-serif text-3xl font-semibold">Admin sign-in</h1>
          <p className="text-sm text-muted-foreground">
            This area is for people who manage the website — sending the
            weekly digest, reviewing devotional subscribers, and similar
            behind-the-scenes tasks.
          </p>
        </header>

        {error ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            We couldn&apos;t sign you in. Please try again, or contact the
            church if the problem keeps happening.
          </div>
        ) : null}

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl });
          }}
        >
          <Button type="submit" size="lg" className="w-full">
            Sign in with Google
          </Button>
        </form>

        <div className="space-y-3 border-t pt-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Landed here by mistake?</p>
          <p>
            Most visitors don&apos;t need this page. If you were looking for
            something else, you probably want one of these:
          </p>
          <ul className="space-y-1.5">
            <li>
              <Link href="/" className="underline underline-offset-4 hover:text-foreground">
                Home page
              </Link>
            </li>
            <li>
              <Link href="/connect/contact" className="underline underline-offset-4 hover:text-foreground">
                Contact the church
              </Link>
            </li>
            {churchInfo.phone ? (
              <li>
                Call us:{" "}
                <a
                  href={churchInfo.phoneHref}
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  {churchInfo.phone}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </main>
  );
}
