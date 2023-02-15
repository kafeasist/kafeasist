import dotenv from 'dotenv';
import { IyzipayConfig } from 'iyzipay';
import { Secret } from 'jsonwebtoken';
dotenv.config();

export const __version__ = 1;
export const __port__ = process.env.PORT;

export const __testing__ = process.env.NODE_ENV === 'test';
export const __prod__ = process.env.NODE_ENV === 'prod';

export const __cors_origin__ = 'http://localhost:5173';

export const __socket_server__ = 'http://localhost:4000';

export const __jwt_secret__ = process.env.JWT_SECRET as Secret;

export const __cookie_name__ = process.env.COOKIE_NAME;
export const __session_secret__ = process.env.COOKIE_SECRET;

export const __redis_user__ = process.env.REDIS_USER;
export const __redis_host__ = process.env.REDIS_HOST;
export const __redis_port__ = process.env.REDIS_PORT;
export const __redis_password__ = process.env.REDIS_PASSWORD;

export const __db_name__ = process.env.DB_NAME;
export const __db_user__ = process.env.DB_USER;
export const __db_host__ = process.env.DB_HOST;
export const __db_pass__ = process.env.DB_PASS;
export const __db_port__ = process.env.DB_PORT;

export const __test_db_name__ = process.env.TEST_DB_NAME;
export const __test_db_user__ = process.env.TEST_DB_USER;
export const __test_db_host__ = process.env.TEST_DB_HOST;
export const __test_db_pass__ = process.env.TEST_DB_PASS;
export const __test_db_port__ = process.env.TEST_DB_PORT;

// export const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;

export const __iyzipay_config__: IyzipayConfig = {
	apiKey: process.env.IYZIPAY_API_KEY,
	secretKey: process.env.IYZIPAY_SECRET_KEY,
	uri: process.env.IYZIPAY_URI,
};

export const __iyzipay_number__ = process.env.IYZIPAY_NUMBER;
