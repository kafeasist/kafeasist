import { NextFunction, Request, Response } from 'express';
import { __jwt_secret__, __jwt_options__ } from '../config/constants';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/createError';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const bearerHeader = req.headers['authorization'];

	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		const token = bearer[1];

		if (bearer[0] === 'Bearer')
			jwt.verify(token, __jwt_secret__, __jwt_options__, (err) => {
				if (!err) {
					req.token = token;
					next();
				} else
					res.json(
						createError(
							new Error('Token you provided is not valid'),
						),
					);
			});
	} else
		res.json(
			createError(
				new Error(
					'Please provide a valid token while accesing the API',
				),
			),
		);
};
