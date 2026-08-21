import type { NextFunction, Request, Response } from "express";
import { ProductService } from "./product.service";
import { CreateProductSchema, UpdateProductSchema } from "@admin/types";
import * as v from "valibot";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@/lib";

export class ProductController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page, limit, sortBy, sortOrder } = req.query;

      const result = await this.productService.findAll({
        search: search ? String(search) : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy: sortBy as "name" | "price" | "createdAt" | "stock",
        sortOrder: sortOrder as "asc" | "desc",
      });

      res.success(result);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        throw new BadRequestException({ message: "Invalid product ID" });
      }

      const item = await this.productService.findById(id);
      if (!item) {
        throw new NotFoundException({ message: "Product not found" });
      }

      res.success(item);
    } catch (error) {
      next(error);
    }
  };

  findBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params.slug as string;
      const item = await this.productService.findBySlug(slug);
      if (!item) {
        throw new NotFoundException({ message: "Product not found" });
      }

      res.success(item);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedException();
      }

      const payload = v.parse(CreateProductSchema, req.body);
      const item = await this.productService.create(payload, req.user as any);

      res.success(item, "Product created successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new BadRequestException({ message: "Invalid product ID" });
      }

      const payload = v.parse(UpdateProductSchema, req.body);
      const updatedItem = await this.productService.update(id, payload);

      if (!updatedItem) {
        throw new NotFoundException({ message: "Product not found" });
      }

      res.success(updatedItem, "Product updated successfully");
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new BadRequestException({ message: "Invalid product ID" });
      }

      const deletedItem = await this.productService.delete(id);
      if (!deletedItem) {
        throw new NotFoundException({ message: "Product not found" });
      }

      res.success(deletedItem, "Product deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
