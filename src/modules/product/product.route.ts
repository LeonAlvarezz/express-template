import { Router } from "express";
import { ProductController } from "./product.controller";
import protectedRoute from "@/core/middleware/guard";

export const productRoute = (app: Router) => {
  const router = Router();
  const controller = new ProductController();

  app.use("/products", router);

  router.get("/", controller.findAll);
  router.get("/slug/:slug", controller.findBySlug);
  router.get("/:id", controller.findById);

  // Protected write routes
  router.post("/", protectedRoute(controller.create));
  router.put("/:id", protectedRoute(controller.update));
  router.delete("/:id", protectedRoute(controller.delete));
};
