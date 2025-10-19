import type { NextFunction, Request, Response } from "express";
import { BookService } from "./book.service";
import { CreateBookSchema } from "./dto/create-book.dto";
import { UpdateBookSchema } from "./dto/update-book.dto";
import { isString } from "@/utils";
import { ForbiddenException } from "@/lib";
import { IdStringSchema } from "@/core/dto/id-string.schema";

export class BookController {
  private readonly bookService: BookService;
  constructor() {
    this.bookService = new BookService();
  }
  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bookService.findAll();
      res.success(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = CreateBookSchema.parse(req.body);
      const result = await this.bookService.create(payload);
      res.success(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = IdStringSchema.parse(req.params);
      const payload = UpdateBookSchema.parse(req.body);
      await this.bookService.update(id, payload);
      res.simpleSuccess();
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = IdStringSchema.parse(req.params);
      await this.bookService.delete(id);
      res.simpleSuccess();
    } catch (error) {
      next(error);
    }
  };
}
