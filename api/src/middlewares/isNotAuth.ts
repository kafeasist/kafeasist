import { NextFunction, Request, Response } from 'express';
import { NOT_AUTH_ERROR } from '@kafeasist/responses';
import { CreateResponse } from '@kafeasist/responses';

export const isNotAuth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers['authorization'];
	if (token) return res.json(CreateResponse(NOT_AUTH_ERROR));
	return next();
};
