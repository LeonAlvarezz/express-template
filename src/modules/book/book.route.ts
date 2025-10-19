import { BookController } from "./book.controller";
import { Router } from "express";

export const bookRoute = (app: Router) => {
  const router = Router();
  const controller = new BookController();
  app.use("/books", router);
  router.get("/", controller.findAll);
  router.post("/", controller.create);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);
};
