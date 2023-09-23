import { z } from "zod";

export const analizSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  type: z.string(),
});

export type Analiz = z.infer<typeof analizSchema>;
