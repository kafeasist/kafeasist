import { Request, Response } from 'express';
import { ValueDeterminingMiddleware } from 'express-rate-limit';
import { __testing__ } from '../config/constants';

export const isTesting: ValueDeterminingMiddleware<boolean> = async (
	_: Request,
	__: Response,
) => {
	return __testing__;
};
