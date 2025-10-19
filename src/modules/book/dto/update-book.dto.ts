import z from "zod";

export const UpdateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  description: z.string().optional(),
  published_year: z.coerce.number().optional(),
});

export type UpdateBookDto = z.infer<typeof UpdateBookSchema>;
