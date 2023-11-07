import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  categoryId: z.number(),
  categoryName: z.string(),
  price: z.number(),
});

export type Product = z.infer<typeof productSchema>;
