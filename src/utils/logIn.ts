import { Request } from 'express';

export const logIn = (req: Request, userId: number) => {
	req.session.userId = userId;
};
