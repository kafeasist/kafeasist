import cors from 'cors';
import express, { Request, Response } from 'express';
import session from 'express-session';
import { corsOptions } from './config/cors.config';
import { API_404, SLOW_DOWN } from './config/Responses';
import { sessionOptions } from './config/session.config';
import apiRoutes from './routes/api';
import { CreateResponse } from './utils/CreateResponse';
import rateLimit from 'express-rate-limit';
import { io } from 'socket.io-client';
import { __socket_server__ } from './config/constants';
import { logger } from './utils/logger';
import { isTesting } from './middlewares/isTesting';

export const socket = io(__socket_server__);

socket.on('connect_error', (err) => {
	if (!isTesting) logger(err.message);
});

const apiRateLimiter = rateLimit({
	windowMs: 15 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: CreateResponse(SLOW_DOWN),
	skip: isTesting,
});

const app = express()
	.use(cors(corsOptions))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(session(sessionOptions));

app.use('/api', apiRateLimiter, apiRoutes);

app.use((_: Request, res: Response) => {
	res.status(404);
	return res.json(CreateResponse(API_404));
});

export default app;
