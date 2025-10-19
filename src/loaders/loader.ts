import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import methodOverride from "method-override";
import errorMiddleware from "@/core/middleware/error-middleware";
import cookieParser from "cookie-parser";
import createHttpError from "http-errors";
import { env } from "@/config";
import { default as routeHandler } from "@/core/route-handler";
import { ignoreFavicon } from "@/utils";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";
import { responseWrapper } from "@/core/middleware/response";

export default function expressLoader({ app }: { app: express.Application }) {
  // Security and parsing middleware
  app.enable("trust proxy");

  app.use(cors());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(express.json());

  app.use(ignoreFavicon);

  app.use(responseWrapper);

  app.all("/api/auth/*splat", toNodeHandler(auth));
  app.use(env.API_PREFIX, routeHandler());

  // API routes
  app.use("/{*any}", (_req, res, next) => {
    next(createHttpError(404, "Endpoint Not Found"));
  });

  app.use(errorMiddleware);
}
