import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { __port__, __prod__ } from './config/constants';
import { corsOptions } from './config/cors.config';
import apiRoutes from './routes/api';
import session from 'express-session';
import { sessionOptions } from './config/session.config';
import { createError } from './utils/createError';
import { io } from 'socket.io-client';
import { orm } from './config/typeorm.config';

export const socket = io('http://localhost:4000');

(async () => {
	await orm
		.initialize()
		.then(() => console.log('Database connected'))
		.catch((err) => console.log(err.message));

	const app = express()
		.use(cors(corsOptions))
		.use(express.json())
		.use(express.urlencoded({ extended: true }))
		.use(session(sessionOptions));

	app.use('/api', apiRoutes);

	app.use((_: Request, res: Response) => {
		res.status(404);
		return res.json(createError('Specified path not found on the server'));
	});

	app.listen(__port__, () => console.log(`Listening on :${__port__}`));
})();
