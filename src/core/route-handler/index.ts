import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { authRoute } from "@/modules/auth/auth.route";
import { productRoute } from "@/modules/product/product.route";

// guaranteed to get dependencies

export default () => {
  const app = Router();

  // Health Check
  app.get(
    "/health-check",
    (_req: Request, res: Response, _next: NextFunction) => {
      const data = {
        uptime: process.uptime(),
        message: "OK",
        date: new Date(),
      };
      res.status(200).send(data);
    },
  );

  // Auth Routes
  authRoute(app);

  // Product Routes
  productRoute(app);

  return app;
};
