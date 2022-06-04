import { SessionOptions } from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import session from 'express-session';
import {
	__cookie_name__,
	__prod__,
	__redis_host__,
	__redis_password__,
	__redis_port__,
	__redis_username__,
	__session_secret__,
} from './constants';

const RedisStore = connectRedis(session);
const redis = new Redis({
	host: __redis_host__,
	port: __redis_port__,
	username: __redis_username__,
	password: __redis_password__,
	enableReadyCheck: false,
});

export const sessionOptions: SessionOptions = {
	name: __cookie_name__,
	store: new RedisStore({
		client: redis,
		disableTouch: true,
	}),
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
