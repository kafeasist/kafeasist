import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ADMIN_ERROR } from '@kafeasist/responses';
import { CreateResponse } from '@kafeasist/responses';
import { __jwt_secret__ } from '../config/constants';

export type KafeasistJwt = { user: string };

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;

	if (!authorization) return res.json(CreateResponse(ADMIN_ERROR));
	const bearer = authorization.split(' ')[0];
	const token = authorization.split(' ')[1];

	if (bearer !== 'Bearer') return res.json(CreateResponse(ADMIN_ERROR));

	if (!token) return res.json(CreateResponse(ADMIN_ERROR));

	if (!jwt.verify(token, __jwt_secret__))
		return res.json(CreateResponse(ADMIN_ERROR));

	const decoded = jwt.decode(token);
	if (!decoded) return res.json(CreateResponse(ADMIN_ERROR));

	req.issuer = (decoded as KafeasistJwt).user;

	return next();
};
