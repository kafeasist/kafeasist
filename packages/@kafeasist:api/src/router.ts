import { authRouter } from "./routers/auth";
import { companyRouter } from "./routers/company";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  company: companyRouter,
});

export type AppRouter = typeof appRouter;
