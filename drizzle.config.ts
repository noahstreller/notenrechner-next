import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

process.env.NODE_ENV === "development" &&
  dotenv.config({ path: ".env.development.local" });

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    connectionString:
      process.env.POSTGRES_URL ?? "postgres://admin:admin@localhost/verceldb",
  },
} satisfies Config;
