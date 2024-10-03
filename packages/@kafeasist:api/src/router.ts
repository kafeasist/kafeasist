import { authRouter } from "./routers/auth";
import { categoryRouter } from "./routers/category";
import { companyRouter } from "./routers/company";
import { creditCardRouter } from "./routers/credit-card";
import { notificationRouter } from "./routers/notification";
import { placeRouter } from "./routers/place";
import { productRouter } from "./routers/product";
import { tableRouter } from "./routers/table";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  category: categoryRouter,
  company: companyRouter,
  creditCard: creditCardRouter,
  notification: notificationRouter,
  place: placeRouter,
  product: productRouter,
  table: tableRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
