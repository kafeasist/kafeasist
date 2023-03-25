import {
	COMPANY_CANNOT_BE_FOUND,
	CreateResponse,
	EMPTY_ID,
	FOOD_ADDED_ON_TABLE,
	FOOD_CANNOT_BE_FOUND,
	FOOD_FAILED_ON_TABLE,
	FOOD_NOT_OWNED,
	LIMIT_REACHED,
	SUBSCRIPTION_NOT_FOUND,
	TABLE_CANNOT_BE_FOUND,
	TABLE_CREATED,
	TABLE_EDIT_FAILED,
	TABLE_EDIT_SUCCEEDED,
	TABLE_REMOVE_FAILED,
	USER_CANNOT_BE_FOUND,
} from '@kafeasist/responses';
import { z } from 'zod';
import { orm } from '../config/typeorm.config';
import { Company } from '../entities/Company';
import { Food } from '../entities/Food';
import { OrderItem } from '../entities/OrderItem';
import { Table } from '../entities/Table';
import { User } from '../entities/User';
import { isEmployee } from '../middlewares/isEmployee';
import { isOwner } from '../middlewares/isOwner';
import { publicProcedure, router } from '../routes/trpc';
import { getSubscriptionType } from '../utils/getSubscriptionType';
import { logger } from '../utils/logger';
import { SubscriptionLimits } from '../utils/SubscriptionInfo';

const tableRepository = orm.getRepository(Table);
const foodRepository = orm.getRepository(Food);
const userRepository = orm.getRepository(User);
const companyRepository = orm.getRepository(Company);

export const tableRouter = router({
	get: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ input }) => {
			const { id } = input;

			const table = await tableRepository.findOne({
				where: { id },
			});

			if (!table) return CreateResponse(TABLE_CANNOT_BE_FOUND);

			return table;
		}),
	addFood: publicProcedure
		.input(
			z.object({
				foodId: z.number(),
				tableId: z.number(),
				amount: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { foodId, tableId, amount } = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const food = await foodRepository.findOne({
				where: { id: foodId },
				relations: ['company'],
			});

			if (!food) return CreateResponse(FOOD_CANNOT_BE_FOUND);

			const table = await tableRepository.findOne({
				where: { id: tableId },
				relations: ['company', 'items'],
			});

			if (!table) return CreateResponse(TABLE_CANNOT_BE_FOUND);

			if (food.company.id !== table.company.id)
				return CreateResponse(FOOD_NOT_OWNED);

			const employee = await isEmployee(userId, table.company.id);
			if (!employee) return employee;

			const ownership = await isOwner(userId, table.company.id);
			if (ownership) return ownership;

			const orderItem = new OrderItem();
			orderItem.amount = amount;
			orderItem.food = food;
			orderItem.table = table;

			table.total = table.total + food.price * amount;
			table.items?.push(orderItem);

			return await tableRepository
				.save(table)
				.then(() => CreateResponse(FOOD_ADDED_ON_TABLE))
				.catch(() => CreateResponse(FOOD_FAILED_ON_TABLE));
		}),
	foods: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ input }) => {
			const { id } = input;

			const table = await tableRepository.findOne({
				relations: ['items'],
				where: { id },
			});

			if (!table) return CreateResponse(TABLE_CANNOT_BE_FOUND);

			return table.items;
		}),
	create: publicProcedure
		.input(
			z.object({
				companyId: z.number(),
				name: z.string(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { companyId, name, description } = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			if (!companyId) return CreateResponse(EMPTY_ID);

			const ownership = await isOwner(userId, companyId);
			if (ownership) return ownership;

			const user = await userRepository.findOne({
				where: { id: userId },
			});
			if (!user) return CreateResponse(USER_CANNOT_BE_FOUND);
			const subscription = getSubscriptionType(user.subs_type);
			if (subscription === null)
				return CreateResponse(SUBSCRIPTION_NOT_FOUND);
			const limit = new SubscriptionLimits().getTable(subscription);
			const company = await companyRepository.findOne({
				where: { id: companyId },
			});
			if (!company) return CreateResponse(COMPANY_CANNOT_BE_FOUND);
			const tables = company.tables;
			if (tables && tables.length >= limit)
				return CreateResponse(LIMIT_REACHED);

			const newTable = new Table();
			newTable.name = name;
			newTable.description = description;
			newTable.company = company;

			return await tableRepository
				.save(newTable)
				.then(() => CreateResponse(TABLE_CREATED))
				.catch((e) => console.log(e));
		}),
	edit: publicProcedure
		.input(
			z.object({
				tableId: z.number(),
				name: z.string().optional(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { tableId, name, description } = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const table = await tableRepository.findOne({
				where: { id: tableId },
				relations: ['company'],
			});
			if (!table) return CreateResponse(TABLE_CANNOT_BE_FOUND);

			const ownership = await isOwner(userId, table.company.id);
			if (ownership) return ownership;

			table.name = name ? name : table.name;
			table.description = description ? description : table.description;
			await tableRepository.save(table).catch((error) => {
				logger(error);
				return CreateResponse(TABLE_EDIT_FAILED);
			});

			return CreateResponse(TABLE_EDIT_SUCCEEDED);
		}),
	remove: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id } = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const table = await tableRepository.findOne({
				where: { id },
				relations: ['company'],
			});

			if (!table) return CreateResponse(TABLE_CANNOT_BE_FOUND);

			const ownership = await isOwner(userId, table.company.id);
			if (ownership) return ownership;

			return await tableRepository
				.remove(table)
				.then(() => TABLE_CREATED)
				.catch(() => {
					return CreateResponse(TABLE_REMOVE_FAILED);
				});
		}),
});

export default router;
