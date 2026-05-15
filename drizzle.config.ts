import { defineConfig } from "drizzle-kit";

// DATABASE_URL for adopting churches (works with any Postgres provider).
// On Vercel, copy POSTGRES_URL from your database dashboard into this env var.
// For local dev, set DATABASE_URL in .env.local to your local Postgres connection string.
const url =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  "";

if (!url) {
  console.warn(
    "[drizzle] DATABASE_URL is not set. Run `npm run db:setup` to configure the database."
  );
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
});
