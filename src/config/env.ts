// env.ts
import { z } from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
  NODE_ENV: z
    .union([
      z.literal("development"),
      z.literal("testing"),
      z.literal("production"),
    ])
    .default("development"),
  API_PREFIX: z.string(),
  API_BASE_URL: z.string(),
  API_KEY: z.string(),
  PASSWORD_SALT: z.coerce.number(),
  DATABASE_URL: z.string(),
  // ...
});

// Validate `process.env` against our schema
// and return the result
export const env = envSchema.parse(process.env);
export default env;
