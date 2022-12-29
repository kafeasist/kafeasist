import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
	CORS_ORIGIN: z.string().url() || 'http://localhost:3000',
	VERSION: z.string() || '1',
	PORT: z.string() || '8000',
	NODE_ENV: z.string() || 'dev',
	JWT_SECRET: z.string().nullable(), // TODO: Parse as Secret
	COOKIE_NAME: z.string() || 'qid',
	SESSION_SECRET: z.string(),
	REDIS_HOST: z.string() || 'localhost',
	REDIS_PORT: z.string() || '6379',
	DB_HOST: z.string() || 'localhost',
	DB_PORT: z.string() || '5432',
	DB_NAME: z.string() || 'kafeasist',
	DB_USER: z.string() || 'postgres',
	DB_PASS: z.string(),
	ABSTRACT_API_KEY: z.string().nullable(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error(
		'Invalid environment variables:',
		JSON.stringify(parsed.error.format(), null, 4),
	);
	process.exit(1);
}

export const env = { ...parsed.data, PROD: parsed.data.NODE_ENV === 'prod' };
