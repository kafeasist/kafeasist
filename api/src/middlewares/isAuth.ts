import { NextFunction, Request, Response } from 'express';
import { AUTH_ERROR } from '@kafeasist/responses';
import { CreateResponse } from '@kafeasist/responses';
import { JwtVerify } from '@kafeasist/auth';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers['authorization'];

	if (!token || !JwtVerify(token)) {
		res.status(401);
		return res.json(CreateResponse(AUTH_ERROR));
	}

	return next();
};
