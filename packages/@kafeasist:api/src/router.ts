import { authRouter } from "./routers/auth";
import { categoryRouter } from "./routers/category";
import { companyRouter } from "./routers/company";
import { notificationRouter } from "./routers/notification";
import { placeRouter } from "./routers/place";
import { productRouter } from "./routers/product";
import { tableRouter } from "./routers/table";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  company: companyRouter,
  user: userRouter,
  category: categoryRouter,
  product: productRouter,
  table: tableRouter,
  place: placeRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
