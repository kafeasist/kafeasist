import express, { Request, Response } from 'express';
import cors from 'cors';
import { __port__, __prod__ } from './config/constants';
import { corsOptions } from './config/cors.config';
import apiRoutes from './routes/api';
import v1Routes from './routes/v1/v1';
import session from 'express-session';
import { sessionOptions } from './config/session.config';
import { createError } from './utils/createError';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const app = express()
	.use(cors(corsOptions))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(session(sessionOptions));

// router
app.use('/api/v1', v1Routes);
app.use('/api', apiRoutes);

app.use((_: Request, res: Response) => {
	res.status(404);
	return res.json(createError('Specified path not found on the server'));
});

app.listen(__port__, () => console.log(`Listening on :${__port__}`));
