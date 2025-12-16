import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./core/db/schemas.ts",
  out: "./core/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
});
