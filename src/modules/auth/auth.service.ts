import { AuthRepository } from "./auth.repository";
import type { RegisterDto } from "./dto/register.dto";

export class AuthService {
  private readonly authRepository: AuthRepository;
  constructor() {
    this.authRepository = new AuthRepository();
  }
  public findAll() {
    return this.authRepository.findAll();
  }
  public register(payload: RegisterDto) {
    return this.authRepository.register(payload);
  }
}
