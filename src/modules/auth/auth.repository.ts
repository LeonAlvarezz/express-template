import { db } from "@/db";
import { auths } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { RegisterDto } from "./dto/register.dto";
export class AuthRepository {
  async findAll() {
    return db.query.auths.findMany();
  }

  async findByEmail(email: string) {
    return db.query.auths.findFirst({
      where: eq(auths.email, email),
    });
  }

  async register(payload: RegisterDto) {
    const [result] = await db.insert(auths).values(payload).returning();
    return result;
  }
}
