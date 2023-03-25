import { CreateResponse, SLOW_DOWN } from '@kafeasist/responses';
import rateLimit from 'express-rate-limit';
import { isTesting } from '../middlewares/isTesting';

export const rateLimiter = rateLimit({
	windowMs: 15 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: CreateResponse(SLOW_DOWN),
	skip: isTesting,
});
