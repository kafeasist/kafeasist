import { join } from 'path';
import { __db_user__, __db_pass__, __db_name__ } from '../config/constants';
import { DataSource } from 'typeorm';
import app from '../app';
import { Server } from 'http';
import { redis } from './connectRedis';

export const mockConnection = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: __db_user__,
	password: __db_pass__,
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
