import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { churchInfo } from "@/lib/church-info";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Access Denied",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccessDeniedPage() {
  const session = await auth();
  const email = session?.user?.email ?? null;

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-lg flex-col justify-center px-4 py-12">
      <div className="space-y-6 rounded-2xl border bg-card p-8 shadow-sm">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {churchInfo.name}
          </p>
          <h1 className="font-serif text-3xl font-semibold">
            You don&apos;t have admin access
          </h1>
          {email ? (
            <p className="text-sm text-muted-foreground">
              You signed in as{" "}
              <span className="font-mono font-medium text-foreground">{email}</span>
              , but this email isn&apos;t on the admin list for this site.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your account isn&apos;t on the admin list for this site.
            </p>
          )}
        </header>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">What to try next</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              If you have a separate work or church Google account, sign out
              and try that one.
            </li>
            <li>
              If you should have access, ask whoever manages the site to add
              this email to the admin list.
            </li>
            <li>
              Reached here by mistake? Just head back to the home page — no
              harm done.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/sign-in" });
            }}
            className="flex-1"
          >
            <Button type="submit" variant="outline" className="w-full">
              Sign out &amp; try a different account
            </Button>
          </form>
          <Link href="/" className="flex-1">
            <Button variant="ghost" className="w-full">
              Back to home
            </Button>
          </Link>
        </div>

        <p className="border-t pt-4 text-xs text-muted-foreground">
          Need help? Contact{" "}
          {churchInfo.name} at{" "}
          <a
            href={churchInfo.emailHref}
            className="underline underline-offset-4 hover:text-foreground"
          >
            {churchInfo.email}
          </a>
          {churchInfo.phone ? (
            <>
              {" "}
              or{" "}
              <a
                href={churchInfo.phoneHref}
                className="underline underline-offset-4 hover:text-foreground"
              >
                {churchInfo.phone}
              </a>
            </>
          ) : null}
          .
        </p>
      </div>
    </main>
  );
}
