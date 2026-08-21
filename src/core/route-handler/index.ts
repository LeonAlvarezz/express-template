import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { authRoute } from "@/modules/auth/auth.route";
import { productRoute } from "@/modules/product/product.route";
import { docsRoute } from "./docs.route";

// guaranteed to get dependencies

export default () => {
  const app = Router();

  // API Documentation Routes (/docs, /docs/swagger, /docs/json)
  docsRoute(app);

  /**
   * @openapi
   * /health-check:
   *   get:
   *     summary: System Health Check
   *     description: Returns current server uptime, status message, and server timestamp.
   *     tags:
   *       - System
   *     responses:
   *       200:
   *         description: Server is healthy and operating normally.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 uptime:
   *                   type: number
   *                   example: 142.5
   *                 message:
   *                   type: string
   *                   example: "OK"
   *                 date:
   *                   type: string
   *                   format: date-time
   */
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

