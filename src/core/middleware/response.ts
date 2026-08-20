import type { NextFunction, Request, Response } from "express";

export const responseWrapper = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Override `res.json`
  res.success = function <T = any>(
    data: T | null = null,
    message: string = "OK",
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  };

  res.simpleSuccess = function (
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
    });
  };

  res.error = function (
    message: string = "Internal Server Error",
    statusCode: number | string = 500,
    data: any = null
  ): Response {
    const validStatusCode =
      typeof statusCode === "number" && !isNaN(statusCode)
        ? statusCode
        : typeof statusCode === "string" && !isNaN(Number(statusCode))
          ? Number(statusCode)
          : 500;

    return res.status(validStatusCode).json({
      success: false,
      data,
      message,
    });
  };

  next();
};
