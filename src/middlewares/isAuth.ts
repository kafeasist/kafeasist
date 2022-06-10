import { NextFunction, Request, Response } from 'express';
import { createError } from '../utils/createError';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const userId = req.session.userId;

	if (!userId) {
		res.status(401);
		return res.json(
			createError('Bu işlemi yapmak için giriş yapmalısınız!'),
		);
	}

	return next();
};
