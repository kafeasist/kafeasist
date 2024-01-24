import { getSessionFromCookie, Session } from "@kafeasist/auth";
import { prisma, PrismaClient } from "@kafeasist/db";

/**
 * The type of the context object. This is the type of the `ctx` argument in
 * tRPC handlers. It is also the type of the `ctx` property in the `TRPCClient`
 *
 * @see https://trpc.io/docs/server/context#creating-the-context
 */
export type Context = {
  session: Session | null;
  prisma: PrismaClient;
} & CreateContextProps;

interface CreateContextProps {
  headers: Headers;
}

/**
 * Create an outer context object for tRPC.
 *
 * @argument opts - The options passed to the Next.js API route.
 * @returns The context object.
 * @see https://trpc.io/docs/server/context#creating-the-context
 */
export async function createContext(
  opts: CreateContextProps,
): Promise<Context> {
  const session = await getSessionFromCookie(opts.headers);

  return {
    session,
    prisma,
    headers: opts.headers,
  };
}
