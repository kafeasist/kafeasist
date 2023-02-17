import { NextFunction, Request, Response } from 'express';
import { AUTH_ERROR } from '@kafeasist/responses';
import { CreateResponse } from '@kafeasist/responses';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const userId = req.session.userId;

	if (!userId) {
		res.status(401);
		return res.json(CreateResponse(AUTH_ERROR));
	}

	return next();
};
