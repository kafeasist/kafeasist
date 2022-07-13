import cors from 'cors';
import express, { Request, Response } from 'express';
import session from 'express-session';
import { corsOptions } from './config/cors.config';
import { API_404 } from './config/Responses';
import { sessionOptions } from './config/session.config';
import apiRoutes from './routes/api';
import { CreateResponse } from './utils/CreateResponse';

const app = express()
	.use(cors(corsOptions))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(session(sessionOptions));

app.use('/api', apiRoutes);

app.use((_: Request, res: Response) => {
	res.status(404);
	return res.json(CreateResponse(API_404));
});

export default app;
module.exports = app;
