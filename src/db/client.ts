import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const globalForDb = globalThis as typeof globalThis & {
  dbPool?: Pool;
};

const pool =
  globalForDb.dbPool ??
  new Pool({
    connectionString: databaseUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.dbPool = pool;
}

export const db = drizzle({
  client: pool,
  schema,
  casing: "snake_case",
});

export { pool };
