import { ADMIN_ERROR } from '@kafeasist/responses';
import { JwtDecode, JwtPayload, JwtVerify } from '@kafeasist/auth';
import { middleware } from '../routes/trpc';
import { TRPCError } from '@trpc/server';

export const isAdmin = middleware(async ({ next, ctx }) => {
	const { authorization } = ctx.req.headers;

	if (!authorization)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: ADMIN_ERROR.message,
		});
	const token = authorization.split(' ')[1];

	if (!token)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: ADMIN_ERROR.message,
		});

	if (!JwtVerify(token))
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: ADMIN_ERROR.message,
		});

	const decoded = JwtDecode(token);
	if (!decoded)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: ADMIN_ERROR.message,
		});

	ctx.req.issuer = (decoded as JwtPayload).id;

	return next({ ctx });
});
