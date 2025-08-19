import express from "express";
import { env, loadEnv } from "@/config";

// Export the app and startServer function
export const app = express();
let server: ReturnType<typeof app.listen>;

export async function startServer() {
  loadEnv();
  console.log("Starting server initialization...");

  try {
    console.log("Applying loaders...");
    const loaders = await import("./src/loaders");
    await loaders.default({ expressApp: app });

    const port = env.NODE_ENV === "testing" ? 0 : env.PORT;
    server = app.listen(port, () => {
      console.log(`
#######################################
⛔️  Server listening on port: ${port}  ⛔️
#######################################
      `);
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log("\nReceived shutdown signal, shutting down gracefully...");
      if (server) {
        server.close();
        process.exit(1);
      }
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
    return server;
  } catch (error) {
    console.error("Catastrophic server initialization error:", error);
    process.exit(1);
  }
}

export function closeServer() {
  if (server) {
    server.close();
  }
}

// Start the server only if this file is run directly
if (require.main === module) {
  startServer();
}
