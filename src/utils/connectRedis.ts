import connectRedis from 'connect-redis';
import session from 'express-session';
import Redis from 'ioredis';
import {
	__cookie_name__,
	__prod__,
	__redis_host__,
	__redis_password__,
	__redis_port__,
	__session_secret__,
} from '../config/constants';

export const RedisStore = connectRedis(session);
export const redis = new Redis({
	host: __redis_host__,
	port: __redis_port__,
	// password: __redis_password__,
	enableReadyCheck: false,
});

export const getKey = async (key: string): Promise<string | null> => {
	return await redis.get(key);
};

export const setKey = async (key: string, value: string): Promise<void> => {
	await redis.set(key, value);
};

export const removeKey = async (key: string): Promise<void> => {
	await redis.del(key);
};
