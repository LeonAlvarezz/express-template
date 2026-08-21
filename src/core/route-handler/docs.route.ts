import { Router } from "express";
import { apiReference } from "@scalar/express-api-reference";
import { openApiSpec } from "@/config/openapi.config";

export const docsRoute = (app: Router) => {
  // Raw OpenAPI JSON spec endpoint
  app.get("/docs/json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(openApiSpec);
  });

  // Scalar API Reference route
  app.use(
    "/docs",
    apiReference({
      spec: {
        content: openApiSpec,
      },
      pageTitle: "Admin API Reference",
    }),
  );
};
