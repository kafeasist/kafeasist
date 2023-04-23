import { appRouter, createTRPCContext } from "@kafeasist/api";
import { createNextApiHandler } from "@trpc/server/adapters/next";

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  // TODO: Error handling https://trpc.io/docs/server/error-handling#handling-errors
});
