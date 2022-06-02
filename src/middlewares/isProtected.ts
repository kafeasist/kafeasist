import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createError } from '../utils/createError';
import { __auth_user__ } from '../config/constants';
import { JwtExtendedPayload } from '../types/jwt';
import { logger } from '../utils/logger';

export const isProtected = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const payload = jwt.decode(req.token) as JwtPayload;
	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

	if (payload.id === __auth_user__) {
		req.issuer = payload as JwtExtendedPayload;
		logger(`Connection established with ${req.issuer.name}`);
		return next();
	}

	logger(
		`Remote computer from IP '${ip}' tried to access the kafeasist Node API`,
	);

	res.status(401);
	return res.json(
		createError(new Error('You are not authorized to view this page')),
	);
};
