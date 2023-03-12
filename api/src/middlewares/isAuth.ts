import { TRPCError } from '@trpc/server';
import { AUTH_ERROR } from '@kafeasist/responses';
import { JwtVerify } from '@kafeasist/auth';
import { middleware } from '../routes/trpc';

export const isAuth = middleware(async ({ next, ctx }) => {
	const token = ctx.req.headers['authorization'];

	if (!token || !JwtVerify(token))
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: AUTH_ERROR.message,
		});

	return next({ ctx });
});
