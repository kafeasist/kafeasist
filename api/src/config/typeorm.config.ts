import { DataSource, DataSourceOptions } from 'typeorm';
import {
	__db_user__,
	__db_pass__,
	__db_name__,
	__db_host__,
	__db_port__,
	__test_db_host__,
	__test_db_port__,
	__test_db_user__,
	__test_db_pass__,
	__test_db_name__,
	__testing__,
} from './constants';
import { join } from 'path';

export const createOptions = () => {
	return {
		type: 'postgres',
		host: __testing__ ? __test_db_host__ : __db_host__,
		port: __testing__ ? __test_db_port__ : __db_port__,
		username: __testing__ ? __test_db_user__ : __db_user__,
		password: __testing__ ? __test_db_pass__ : __db_pass__,
		database: __testing__ ? __test_db_name__ : __db_name__,
		synchronize: true,
		logging: false,
		dropSchema: __testing__,
		entities: [join(__dirname, '/../entities/**/*{.ts,.js}')],
	} as DataSourceOptions;
};

export const orm = new DataSource(createOptions());
