import { authRouter } from "./routers/auth";
import { companyRouter } from "./routers/company";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  company: companyRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
