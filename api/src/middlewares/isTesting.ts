import { ValueDeterminingMiddleware } from 'express-rate-limit';
import('express-rate-limit');
import { __testing__ } from '../config/constants';

export const isTesting: ValueDeterminingMiddleware<boolean> = async () => {
	return __testing__;
};
