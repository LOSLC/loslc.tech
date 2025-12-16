import { getEnv } from "@/lib/server/env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas";

export const db = drizzle(getEnv("DATABASE_URL"), { schema: { ...schema } });
