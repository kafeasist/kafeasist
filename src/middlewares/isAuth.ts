import { NextFunction, Request, Response } from 'express';
import { AUTH_ERROR } from '../config/Responses';
import { CreateResponse } from '../utils/CreateResponse';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const userId = req.session.userId;

	if (!userId) {
		res.status(401);
		return res.json(CreateResponse(AUTH_ERROR));
	}

	return next();
};
