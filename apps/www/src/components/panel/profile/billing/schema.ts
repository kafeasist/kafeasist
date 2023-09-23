import { z } from "zod";

const billingType = ["paid", "ongoing", "unpaid"] as const;
export type BillingStatus = (typeof billingType)[number];

export const billingSchema = z.object({
  id: z.string(),
  price: z.number(),
  status: z.enum(billingType),
  date: z.date(),
});

export const statuses: {
  label: string;
  value: BillingStatus;
  color: string;
}[] = [
  { label: "Ödendi", value: "paid", color: "bg-lime-200 dark:bg-lime-800" },
  {
    label: "Ödeniyor",
    value: "ongoing",
    color: "bg-yellow-100 dark:bg-yellow-700",
  },
  { label: "Ödenmedi", value: "unpaid", color: "bg-rose-200 dark:bg-rose-800" },
];

export type Billing = z.infer<typeof billingSchema>;
