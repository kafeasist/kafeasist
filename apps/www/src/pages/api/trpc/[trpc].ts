import { appRouter, createTRPCContext } from "@kafeasist/api";
import { createNextApiHandler } from "@trpc/server/adapters/next";

export default createNextApiHandler({
  // TODO: Error handling https://trpc.io/docs/server/error-handling#handling-errors
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      // TODO: send to bug reporting
    }
  },
  router: appRouter,
  createContext: createTRPCContext,
});
