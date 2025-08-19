import { AuthService } from "./auth.service";
import type { NextFunction, Response, Request } from "express";
import { RegisterDtoSchema } from "./dto/register.dto";

export class AuthController {
  private readonly authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }
  public findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.findAll();
      return res.json(data);
    } catch (error) {
      next(error);
    }
  };
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = RegisterDtoSchema.parse(req.body);
      const data = await this.authService.register(payload);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  };
}
