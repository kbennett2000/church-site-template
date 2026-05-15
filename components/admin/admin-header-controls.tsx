import { auth, signOut } from "@/auth";
import { adminAuth } from "@/content/site";

// Sign-out + signed-in-as display, intended to live in the header of any
// page protected by middleware (e.g. /admin/devotionals, /admin/digest).
//
// Renders nothing when Basic Auth is in use — Basic Auth has no
// programmatic "sign out" because the browser caches the credentials
// until restart, so a button would be misleading.
export async function AdminHeaderControls() {
  if (adminAuth.provider !== "google") return null;

  const session = await auth();
  const email = session?.user?.email;

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      {email ? (
        <span className="hidden sm:inline">
          Signed in as <span className="font-mono text-foreground">{email}</span>
        </span>
      ) : null}
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/?signedOut=1" });
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
