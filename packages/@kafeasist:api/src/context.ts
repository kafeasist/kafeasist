import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { getSessionFromCookie } from "@kafeasist/auth";
import { prisma } from "@kafeasist/db";

/**
 * Create an outer context object for tRPC.
 *
 * @argument opts - The options passed to the Next.js API route.
 * @returns The context object.
 * @see https://trpc.io/docs/server/context#creating-the-context
 */
export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await getSessionFromCookie(opts.req.headers);

  return {
    session,
    prisma,
    headers: opts.resHeaders,
  };
}

/**
 * The type of the context object. This is the type of the `ctx` argument in
 * tRPC handlers. It is also the type of the `ctx` property in the `TRPCClient`
 *
 * @see https://trpc.io/docs/server/context#creating-the-context
 */
export type Context = Awaited<ReturnType<typeof createContext>>;
