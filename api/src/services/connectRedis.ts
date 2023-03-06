import Redis from 'ioredis';
import {
	__redis_host__,
	__redis_password__,
	__redis_port__,
	__redis_user__,
} from '../config/constants';

export const redis = new Redis({
	username: __redis_user__,
	password: __redis_password__,
	host: __redis_host__,
	port: __redis_port__,
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
