import { z } from "zod";

export const RegisterDtoSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(20),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
