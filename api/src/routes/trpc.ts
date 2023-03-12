import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { getUserFromRequest } from '../utils/getUserFromRequest';

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
	const userId = getUserFromRequest(req);

	return { req, res, userId };
};

type Context = inferAsyncReturnType<typeof createContext>;

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
