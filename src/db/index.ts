import { env } from "@/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export type DrizzleTransaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

const url = env.DATABASE_URL;
export const db = drizzle(url, {
  schema,
});
