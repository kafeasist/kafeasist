import { Session, getSessionFromCookie } from "@kafeasist/auth";
import { prisma } from "@kafeasist/db";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

/**
 * Defines the inner context shape.
 * @see https://trpc.io/docs/server/context#inner-and-outer-context
 */
interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: Session | null;
}

/**
 * Create an inner context object for TRPC.
 * @returns The context object.
 * @see https://trpc.io/docs/server/context#inner-and-outer-context
 */
export const createContextInner = async (opts: CreateInnerContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * Create a context object for TRPC.
 * @argument opts - The options passed to the Next.js API route.
 * @returns The context object.
 * @see https://trpc.io/docs/context
 * @see https://trpc.io/docs/nextjs
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getSessionFromCookie(req);

  const innerContext = await createContextInner({ session });

  return { ...innerContext, req, res };
};

/**
 * The context type.
 * @see https://trpc.io/docs/context
 */
export type Context = inferAsyncReturnType<typeof createTRPCContext>;

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
 */
export const publicProcedure = t.procedure;

/**
 * Middleware to check if the user is authenticated.
 * @see https://trpc.io/docs/server/middleware
 */
const isUserAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({ ctx });
});

/**
 * Private procedure (authentication required).
 * Only authenticated users can call this procedure.
 */
export const protectedProcedure = t.procedure.use(isUserAuthed);
