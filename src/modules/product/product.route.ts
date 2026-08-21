import { Router } from "express";
import { ProductController } from "./product.controller";
import protectedRoute from "@/core/middleware/guard";

export const productRoute = (app: Router) => {
  const router = Router();
  const controller = new ProductController();

  app.use("/products", router);

  /**
   * @openapi
   * /products:
   *   get:
   *     summary: List products
   *     description: Retrieve all products stored in the database.
   *     tags:
   *       - Products
   *     responses:
   *       200:
   *         description: Array of product items.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  router.get("/", controller.findAll);

  /**
   * @openapi
   * /products/slug/{slug}:
   *   get:
   *     summary: Get product by slug
   *     description: Retrieve a single product by its URL-friendly slug.
   *     tags:
   *       - Products
   *     parameters:
   *       - in: path
   *         name: slug
   *         required: true
   *         schema:
   *           type: string
   *         description: The product slug (e.g., wireless-noise-canceling-headphones)
   *     responses:
   *       200:
   *         description: Product item details.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Product not found.
   */
  router.get("/slug/:slug", controller.findBySlug);

  /**
   * @openapi
   * /products/{id}:
   *   get:
   *     summary: Get product by ID
   *     description: Retrieve a single product by its unique integer ID.
   *     tags:
   *       - Products
   *     security:
   *       - cookieAuth: []
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Unique product ID
   *     responses:
   *       200:
   *         description: Product item details.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Product not found.
   */
  router.get("/:id", protectedRoute(controller.findById));

  /**
   * @openapi
   * /products:
   *   post:
   *     summary: Create new product
   *     description: Create a new product. Requires authentication.
   *     tags:
   *       - Products
   *     security:
   *       - cookieAuth: []
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateProductPayload'
   *     responses:
   *       201:
   *         description: Product successfully created.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       401:
   *         description: Unauthorized. Active session required.
   */
  router.post("/", protectedRoute(controller.create));

  /**
   * @openapi
   * /products/{id}:
   *   put:
   *     summary: Update existing product
   *     description: Update product properties by ID. Requires authentication.
   *     tags:
   *       - Products
   *     security:
   *       - cookieAuth: []
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Unique product ID to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateProductPayload'
   *     responses:
   *       200:
   *         description: Product successfully updated.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       401:
   *         description: Unauthorized. Active session required.
   *       404:
   *         description: Product not found.
   */
  router.put("/:id", protectedRoute(controller.update));

  /**
   * @openapi
   * /products/{id}:
   *   delete:
   *     summary: Delete product
   *     description: Delete a product by ID. Requires authentication.
   *     tags:
   *       - Products
   *     security:
   *       - cookieAuth: []
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Unique product ID to delete
   *     responses:
   *       200:
   *         description: Product successfully deleted.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       401:
   *         description: Unauthorized. Active session required.
   *       404:
   *         description: Product not found.
   */
  router.delete("/:id", protectedRoute(controller.delete));
};
