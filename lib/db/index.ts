import { drizzle } from "drizzle-orm/vercel-postgres";
import { createPool } from "@vercel/postgres";
import * as schema from "./schema";

// Supports DATABASE_URL (our canonical env var, provider-agnostic) with a
// fallback to POSTGRES_URL (the name Vercel auto-sets when you add a database
// to your project). Either works; document DATABASE_URL everywhere so the
// code is portable to non-Vercel hosts.
const connectionString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";

const pool = createPool({ connectionString });

export const db = drizzle(pool, { schema });
