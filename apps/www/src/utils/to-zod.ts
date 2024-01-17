import { z } from "zod";

export type ToZod<T> = Required<{
  [K in keyof T]: T[K] extends string | number | boolean | null | undefined
    ? undefined extends T[K]
      ? z.ZodDefault<z.ZodType<Exclude<T[K], undefined>>>
      : z.ZodType<T[K]>
    : z.ZodObject<ToZod<T[K]>>;
}>;
