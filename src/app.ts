import cors from 'cors';
import express, { Request, Response } from 'express';
import session from 'express-session';
import { corsOptions } from './config/cors.config';
import { sessionOptions } from './config/session.config';
import apiRoutes from './routes/api';
import { createError } from './utils/createError';

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

export default app;
module.exports = app;
