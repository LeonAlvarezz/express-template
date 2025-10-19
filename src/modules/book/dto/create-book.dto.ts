import z from "zod";

export const CreateBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().optional(),
  published_year: z.coerce.number().optional(),
});

export type CreateBookDto = z.infer<typeof CreateBookSchema>;
