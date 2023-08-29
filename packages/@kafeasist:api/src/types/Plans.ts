export const plans = ["FREE", "PRO", "ENTERPRISE"] as const;
export type Plan = (typeof plans)[number];
