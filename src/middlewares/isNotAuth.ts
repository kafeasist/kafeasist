import { NextFunction, Request, Response } from 'express';
import { createError } from '../utils/createError';

export const isNotAuth = (req: Request, res: Response, next: NextFunction) => {
	const userId = req.session.userId;
	if (userId)
		return res.json(
			createError('Giriş yapılıyken bu işlemi gerçekleştiremezsiniz!'),
		);
	return next();
};
