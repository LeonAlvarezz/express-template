import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { auths } from "./routes";

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
  auths(app);
  return app;
};
