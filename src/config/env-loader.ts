import { default as path } from "path";
import { config } from "dotenv";
import "dotenv/config";

/**
 * Load environment variables based on the current environment.
 * @param {string} env - The current environment (e.g., 'test', 'production').
 */
export const loadEnv = (env = process.env.NODE_ENV || "development") => {
  const basePath = process.cwd();
  config({
    path: path.resolve(basePath, env === "test" ? ".env.local" : ".env"),
  });
};
