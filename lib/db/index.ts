import { drizzle } from "drizzle-orm/vercel-postgres";
import { createPool } from "@vercel/postgres";
import * as schema from "./schema";

// Lazy factory — defers pool creation until first use so that
// `npx next build` succeeds even when DATABASE_URL is not set locally.
// Same pattern as lib/resend.ts's getResend().
//
// Supports DATABASE_URL (our canonical env var, provider-agnostic) with a
// fallback to POSTGRES_URL (the name Vercel auto-sets when you add a database
// to your project).

type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

let _instance: DbInstance | null = null;

export function getDb(): DbInstance {
  if (!_instance) {
    const connectionString =
      process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
    if (!connectionString) {
      throw new Error(
        "[db] DATABASE_URL is not set. Run `npm run db:setup` to configure the database."
      );
    }
    const pool = createPool({ connectionString });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _instance = drizzle(pool as any, { schema });
  }
  return _instance;
}

// Re-export `db` as a lazy proxy so existing callers (`import { db } from "@/lib/db"`)
// continue to work — the connection is established on first property access.
export const db: DbInstance = new Proxy({} as DbInstance, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getDb() as any)[prop];
  },
});
