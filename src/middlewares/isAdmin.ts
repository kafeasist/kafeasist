import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { KafeasistJwt } from '../types/Authorization';
import { ADMIN_ERROR } from '../config/Responses';
import { CreateResponse } from '../utils/CreateResponse';
import { env } from '../config/constants';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;

	if (!authorization) return res.json(CreateResponse(ADMIN_ERROR));
	const bearer = authorization.split(' ')[0];
	const token = authorization.split(' ')[1];

	if (bearer !== 'Bearer') return res.json(CreateResponse(ADMIN_ERROR));

	if (!token) return res.json(CreateResponse(ADMIN_ERROR));

	if (!jwt.verify(token, env.JWT_SECRET as Secret))
		return res.json(CreateResponse(ADMIN_ERROR));

	const decoded = jwt.decode(token);
	if (!decoded) return res.json(CreateResponse(ADMIN_ERROR));

	req.issuer = (decoded as KafeasistJwt).user;

	return next();
};
