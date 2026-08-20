import { Router } from "express";
import { AuthController } from "./auth.controller";
export const authRoute = (app: Router) => {
  const router = Router();
  const controller = new AuthController();

  app.use("/auth", router);
  router.post("/sign-in/email", controller.signInEmail);
  router.post("/sign-out", controller.logOut);
  router.get("/get-session", controller.getSession);
};
