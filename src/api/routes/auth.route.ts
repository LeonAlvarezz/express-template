import { Router } from "express";
import protectedRoute from "../middleware/guard";
import { AuthController } from "@/modules/auth/auth.controller";
import { validateData } from "@/utils/validator";
import { RegisterDtoSchema } from "@/modules/auth/dto/register.dto";

const router = Router();
const authController = new AuthController();
export default (app: Router) => {
  app.use("/auths", router);
  //   router.get("/login", authController.login);
  router.get("/", authController.findAll);
  router.post(
    "/register",
    validateData(RegisterDtoSchema),
    authController.register
  );
};
