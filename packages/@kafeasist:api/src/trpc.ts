import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { Context } from "./context";

/**
 * Initializing the TRPC.
 * @see https://trpc.io/docs/server/routers#initialize-trpc
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zod: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Routers and procedures.
 * @see https://trpc.io/docs/server/routers
 * @see https://trpc.io/docs/server/procedures
 */

export const createTRPCRouter = t.router;

/**
 * Public procedure (no authentication required).
 * Anyone can call this procedure.
 *
 * @see https://trpc.io/docs/server/middlewares#logging
 */
export const publicProcedure = t.procedure.use(async (opts) => {
  const { path, type, next } = opts;

  const start = Date.now();

  const result = await next();

  const durationMs = Date.now() - start;
  const meta = { path, type, durationMs };

  result.ok
    ? console.log("OK request timing:", meta)
    : console.error("Non-OK request timing:", meta);

  return result;
});

/**
 * Create a server-side caller for tRPC procedures.
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Private procedure (authentication required).
 * Only authenticated users can call this procedure.
 *
 * @see https://trpc.io/docs/server/middleware
 */
export const protectedProcedure = publicProcedure.use(async (opts) => {
  const { ctx, next } = opts;

  if (ctx.session == null || !ctx.session)
    throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

// TODO: Add a procedure that requires admin privileges.
// export const adminProcedure = protectedProcedure.use(async (opts) => {
//   const { ctx, next } = opts;
//
//   if (!ctx.session?.isAdmin) throw new TRPCError({ code: "FORBIDDEN" });
//
//   return next({
//     ctx,
//   });
// });
