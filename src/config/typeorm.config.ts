import { DataSource } from 'typeorm';
import { env } from './constants';
import { join } from 'path';

export const orm = new DataSource({
	type: 'postgres',
	host: env.DB_HOST,
	port: parseInt(env.DB_PORT),
	username: env.DB_USER,
	password: env.DB_PASS,
	database: env.DB_NAME,
	synchronize: true,
	logging: false,
	entities: [join(__dirname, '/../entities/**/*{.ts,.js}')],
});
