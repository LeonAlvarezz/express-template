import { env } from "@/config";
import { UnauthorizedException } from "@/lib";
import type { NextFunction, Request, Response } from "express";

type ProtectedRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

function protectedRoute(
  handler: ProtectedRouteHandler,
  options?: {
    resource: string;
    action: "read" | "write" | "delete";
  }
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const key = req.get("x-api-key");
      if (!key || key !== env.API_KEY) throw new UnauthorizedException();
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
export default protectedRoute;
