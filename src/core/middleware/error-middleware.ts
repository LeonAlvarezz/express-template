import { CriticalError, ErrorCode, Logger } from "@/lib";
import { DrizzleError, DrizzleQueryError } from "drizzle-orm";
import type { ErrorRequestHandler, Response } from "express";
import { isHttpError } from "http-errors";
import { ZodError } from "zod";
// Do not try to remove unused params as it will result in the application return the error as HTML
const errorMiddleware: ErrorRequestHandler = (
  error,
  req,
  res: Response,
  next,
) => {
  console.log("YOU ARE HITTING THIS ENDPOINT 👉:", req.url);
  let statusCode =
    typeof error.statusCode === "number"
      ? error.statusCode
      : typeof error.status === "number"
        ? error.status
        : typeof error.status === "string" && !isNaN(Number(error.status))
          ? Number(error.status)
          : 500;

  let errorMessage =
    error.message ||
    error.errorMessage ||
    (typeof error.body?.message === "string"
      ? error.body.message
      : "An unknown error occurred");

  Logger.error("🔥 Error occurred: %o", error);

  if (error instanceof CriticalError) {
    return res.error(
      error.message,
      typeof error.status === "number" ? error.status : 500,
      error.metadata,
    );
  }

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  if (error instanceof ZodError) {
    const errorMessages = error.issues.map(
      (issue) => `${issue.path.join(".")} is ${issue.message}`,
    );
    return res.error(errorMessages.join("\n"), statusCode);
  }

  if (error instanceof DrizzleQueryError) {
    const detail = error.cause?.message || "";
    return res.error(detail, 409);
  }

  // Return a sanitized error res
  return res.error(errorMessage, statusCode);
};

export default errorMiddleware;
