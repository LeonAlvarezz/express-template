import z from "zod";

export const IdStringSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type IdStringDto = z.infer<typeof IdStringSchema>;
