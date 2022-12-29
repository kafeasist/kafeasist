import { SessionOptions } from 'express-session';
import { env } from './constants';
import { RedisStore, redis } from '../utils/connectRedis';

export const sessionStore = new RedisStore({
	client: redis,
	disableTouch: true,
});

export const sessionOptions: SessionOptions = {
	name: env.COOKIE_NAME,
	store: sessionStore,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 365 * 2, // 2 years
		httpOnly: true,
		sameSite: 'lax',
		secure: env.PROD,
	},
	saveUninitialized: false,
	secret: env.SESSION_SECRET,
	resave: false,
};
