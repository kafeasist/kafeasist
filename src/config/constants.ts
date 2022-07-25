import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';
dotenv.config();

export const __version__ = 1;

export const __port__ = process.env.PORT;
export const __prod__ = process.env.NODE_ENV === 'prod';
export const __cors_origin__ = 'http://localhost:3000';

export const __jwt_secret__ = process.env.JWT_SECRET as Secret;

export const __cookie_name__: string = process.env.COOKIE_NAME || 'qid';
export const __session_secret__: string = process.env.COOKIE_SECRET || '';

export const __redis_host__: string = process.env.REDIS_HOST || '';
export const __redis_port__: number =
	parseInt(process.env.REDIS_PORT as string) || 6379;
export const __redis_password__: string = process.env.REDIS_PASSWORD || '';

export const __db_name__ = 'kafeasist';
export const __db_user__: string = process.env.DB_USER || '';
export const __db_pass__: string = process.env.DB_PASS || '';

export const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;
