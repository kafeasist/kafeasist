import { DataSource } from 'typeorm';
import { __db_user__, __db_pass__, __db_name__ } from './constants';
import { Category } from '../entities/Category';
import { Company } from '../entities/Company';
import { Food } from '../entities/Food';
import { Table } from '../entities/Table';
import { User } from '../entities/User';
import { OrderItem } from '../entities/OrderItem';

export const orm = new DataSource({
	type: 'mssql',
	host: 'localhost',
	port: 1433,
	username: __db_user__,
	password: __db_pass__,
	database: __db_name__,
	synchronize: true,
	logging: true,
	entities: [Category, Company, Food, OrderItem, Table, User],
	options: { encrypt: false },
});
