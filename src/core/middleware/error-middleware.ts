import { CriticalError, ErrorCode, Logger } from "@/lib";
import type { ErrorRequestHandler, Response } from "express";
import { isHttpError } from "http-errors";
import { ZodError } from "zod";
// Do not try to remove unused params as it will result in the application return the error as HTML
const errorMiddleware: ErrorRequestHandler = (
  error,
  req,
  res: Response,
  next
) => {
  console.log("YOU ARE HITTING THIS ENDPOINT 👉:", req.url);
  let statusCode = error.status || 500;
  let errorMessage = error.errorMessage || "An unknown error occurred";
  Logger.error("🔥 Error occurred: %o", error);

  if (error instanceof CriticalError) {
    return res.status(error.status).json({
      errors: {
        status: error.status,
        message: error.message,
        metadata: error.metadata,
      },
    });
  }

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  if (error instanceof ZodError) {
    const errorMessages = error.issues.map((issue) => ({
      message: `${issue.path.join(".")} is ${issue.message}`,
    }));
    res
      .status(statusCode)
      .json({ statusCode: statusCode, error: errorMessages });
  }

  // Return a sanitized error res
  return res
    .status(statusCode)
    .json({ statusCode: statusCode, error: errorMessage });
};

export default errorMiddleware;
