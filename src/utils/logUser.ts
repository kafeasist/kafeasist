import { Request, Response } from 'express';
import { env } from '../config/constants';

export const logIn = (req: Request, userId: number) => {
	req.session.userId = userId;
};

export const logOut = (req: Request, res: Response) => {
	res.clearCookie(env.COOKIE_NAME);
	req.session.userId = undefined;
};
