import express, { Response } from 'express';
import cors from 'cors';
import { __port__, __prod__, __mongo_conn__ } from './config/constants';
import { corsOptions } from './config/cors.config';
import { sessionOptions } from './config/redis.config';
import apiRoutes from './routes/api';
import v1Routes from './routes/v1/v1';
import { isAuth } from './middlewares/isAuth';
import { connectMongo } from './utils/connectMongo';
import { isProtected } from './middlewares/isProtected';
import session from 'express-session';

connectMongo(__mongo_conn__);

const app = express()
	.use(cors(corsOptions))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(session(sessionOptions));

app.use(isAuth).use(isProtected);

// router
app.use('/api/v1', v1Routes);
app.use('/api', apiRoutes);

app.use((res: Response) => {
	res.status(404);
	return res.json({ error: 'Path not found' });
});

app.listen(__port__, () => console.log(`Listening on :${__port__}`));
