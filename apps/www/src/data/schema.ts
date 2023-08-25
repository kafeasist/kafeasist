import { z } from "zod";

export const analizSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  type: z.string(),
});

export type Analiz = z.infer<typeof analizSchema>;

const billingType = ["paid", "ongoing", "unpaid"] as const;
export type BillingStatus = (typeof billingType)[number];

export const billingSchema = z.object({
  id: z.string(),
  price: z.number(),
  status: z.enum(billingType),
  date: z.date(),
});

export type Billing = z.infer<typeof billingSchema>;
