import { Request, Response } from 'express';
import { __cookie_name__ } from '../config/constants';

export const logIn = (req: Request, userId: number) => {
	req.session.userId = userId;
};

export const logOut = (req: Request, res: Response) => {
	res.clearCookie(__cookie_name__);
	req.session.userId = undefined;
};
