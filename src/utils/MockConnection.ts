import { join } from 'path';
import { env } from '../config/constants';
import { DataSource } from 'typeorm';
import app from '../app';
import { Server } from 'http';
import { redis } from './connectRedis';

export const mockConnection = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: env.DB_USER,
	password: env.DB_PASS,
	database: 'kafeasist_test',
	synchronize: true,
	logging: false,
	dropSchema: true,
	entities: [join(__dirname, '/../entities/**/*{.ts,.js}')],
});

let conn: Server | null = null;

beforeEach(async () => {
	conn = app.listen(4444);
});

afterEach(async () => {
	if (conn) conn.close();
	redis.disconnect();
});
