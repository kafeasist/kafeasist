import { NOT_AUTH_ERROR } from '@kafeasist/responses';
import { middleware } from '../routes/trpc';
import { TRPCError } from '@trpc/server';

export const isNotAuth = middleware(async ({ next, ctx }) => {
	const token = ctx.req.headers['authorization'];
	if (token)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: NOT_AUTH_ERROR.message,
		});

	return next({ ctx });
});
