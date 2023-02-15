import { SessionOptions } from 'express-session';
import { __cookie_name__, __prod__, __session_secret__ } from './constants';
import { RedisStore, redis } from '../services/connectRedis';

export const sessionStore = new RedisStore({
	client: redis,
	disableTouch: true,
});

export const sessionOptions: SessionOptions = {
	name: __cookie_name__,
	store: sessionStore,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 365 * 2, // 2 years
		httpOnly: true,
		sameSite: 'lax',
		secure: __prod__,
	},
	saveUninitialized: false,
	secret: __session_secret__,
	resave: false,
};
