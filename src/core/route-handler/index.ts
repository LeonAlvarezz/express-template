import { bookRoute } from "@/modules/book/book.route";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";

// guaranteed to get dependencies

export default () => {
  const app = Router();

  //Health Check
  app.get(
    "/health-check",
    (_req: Request, res: Response, _next: NextFunction) => {
      const data = {
        uptime: process.uptime(),
        message: "OK",
        date: new Date(),
      };
      res.status(200).send(data);
    }
  );
  bookRoute(app);
  return app;
};
