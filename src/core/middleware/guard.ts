import { auth } from "@/lib/auth";
import { UnauthorizedException } from "@/lib";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import type { User } from "@admin/types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: typeof auth.$Infer.Session.session;
    }
  }
}

type ProtectedRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;

function protectedRoute(
  handler: ProtectedRouteHandler,
  options?: {
    resource?: string;
    action?: "read" | "write" | "delete";
  },
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        throw new UnauthorizedException();
      }

      req.user = session.user;
      req.session = session.session;

      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default protectedRoute;
