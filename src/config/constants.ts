import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';
dotenv.config();

export const __port__ = process.env.PORT;
export const __prod__ = process.env.NODE_ENV === 'prod';
export const __cors_origin__ = 'http://localhost:3000';

export const __jwt_secret__ = process.env.JWT_SECRET as Secret;

export const __cookie_name__ = process.env.COOKIE_NAME;
export const __session_secret__: string = process.env.COOKIE_SECRET || '';

export const __redis_host__: string = process.env.REDIS_HOST || '';
export const __redis_port__ = 18817;
export const __redis_username__: string = process.env.REDIS_USERNAME || '';
export const __redis_password__: string = process.env.REDIS_PASSWORD || '';
