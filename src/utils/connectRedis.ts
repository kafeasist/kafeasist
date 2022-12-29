import connectRedis from 'connect-redis';
import session from 'express-session';
import Redis from 'ioredis';
import { env } from '../config/constants';

export const RedisStore = connectRedis(session);
// TODO why export?
export const redis = new Redis({
	port: parseInt(env.REDIS_PORT),
	host: env.REDIS_HOST,
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
