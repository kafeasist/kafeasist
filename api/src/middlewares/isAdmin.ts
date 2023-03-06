import { Request, Response, NextFunction } from 'express';
import { ADMIN_ERROR } from '@kafeasist/responses';
import { CreateResponse } from '@kafeasist/responses';
import { JwtDecode, JwtPayload, JwtVerify } from '@kafeasist/auth';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;

	if (!authorization) return res.json(CreateResponse(ADMIN_ERROR));
	const token = authorization.split(' ')[1];

	if (!token) return res.json(CreateResponse(ADMIN_ERROR));

	if (!JwtVerify(token)) return res.json(CreateResponse(ADMIN_ERROR));

	const decoded = JwtDecode(token);
	if (!decoded) return res.json(CreateResponse(ADMIN_ERROR));

	req.issuer = (decoded as JwtPayload).id;

	return next();
};
