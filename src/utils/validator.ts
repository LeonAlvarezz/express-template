import { BadRequestException, InternalServerException } from "@/libs";
import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(
          (issue) => `${issue.path.join(".")} is ${issue.message}`
        );

        console.log("errorMessages:", errorMessages);
        throw new BadRequestException({
          message: errorMessages.join("\n"),
        });
      } else {
        throw new InternalServerException();
      }
    }
  };
}
