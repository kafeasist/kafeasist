import { NextFunction, Request, Response } from 'express';
import { NOT_AUTH_ERROR } from '../config/Responses';
import { CreateResponse } from '../utils/CreateResponse';

export const isNotAuth = (req: Request, res: Response, next: NextFunction) => {
	const userId = req.session.userId;
	if (userId) return res.json(CreateResponse(NOT_AUTH_ERROR));
	return next();
};
