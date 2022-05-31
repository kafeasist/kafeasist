import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';
dotenv.config();

export const __port__ = process.env.PORT;
export const __prod__ = process.env.NODE_ENV === 'prod';
export const __cors_origin__ = 'http://localhost:3000';

export const __jwt_secret__ = process.env.JWT_SECRET as Secret;
export const __jwt_options__ = {
	algorithms: ['HS256'],
} as any;
export const __auth_user__ = process.env.AUTHORIZED_USER;

export const __mongo_conn__: string = process.env.MONGO_CONNECTION_STRING || '';
