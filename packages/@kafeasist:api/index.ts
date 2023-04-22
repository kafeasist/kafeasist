import type { AppRouter } from "./src/router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export * from "./src/router";
export * from "./src/trpc";

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
