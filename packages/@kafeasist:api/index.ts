import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { appRouter, type AppRouter } from "./src/router";
import { createCallerFactory } from "./src/trpc";

export * from "./src/router";
export * from "./src/trpc";
export * from "./src/types/Plans";
export * from "./src/context";

export const createCaller = createCallerFactory(appRouter);

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
