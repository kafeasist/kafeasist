import { Request, Response, Router } from 'express';
import { CreateResponse } from '../utils/CreateResponse';
import { isOwner } from '../middlewares/isOwner';
import { getSubscriptionType } from '../utils/getSubscriptionType';
import { SubscriptionLimits } from '../types/SubscriptionInfo';
import { isInt } from '../middlewares/isInt';
import { orm } from '../config/typeorm.config';
import { Table } from '../entities/Table';
import { Food } from '../entities/Food';
import { User } from '../entities/User';
import { Company } from '../entities/Company';
import { OrderItem } from '../entities/OrderItem';
import {
	COMPANY_CANNOT_BE_FOUND,
	EMPTY_ID,
	FOOD_ADDED_ON_TABLE,
	FOOD_CANNOT_BE_FOUND,
	FOOD_FAILED_ON_TABLE,
	FOOD_NOT_OWNED,
	LIMIT_REACHED,
	OWNER_ERROR,
	TABLE_CANNOT_BE_FOUND,
	TABLE_CREATED,
	TABLE_REMOVE_FAILED,
	USER_CANNOT_BE_FOUND,
} from '../config/Responses';

const router = Router();

const tableRepository = orm.getRepository(Table);
const foodRepository = orm.getRepository(Food);
const userRepository = orm.getRepository(User);
const companyRepository = orm.getRepository(Company);

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	const err = isInt([id]);
	if (err) return res.json(err);

	const table = await tableRepository.findOne({
		where: { id: parseInt(id) },
	});

	if (!table) return res.json(CreateResponse(TABLE_CANNOT_BE_FOUND));

	return res.json(table);
});

router.post('/addFood', async (req: Request, res: Response) => {
	const { foodId, tableId, amount } = req.body;

	const err = isInt([foodId, tableId, amount]);
	if (err) return res.json(err);

	const userId = req.session.userId;
	if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	const food = await foodRepository.findOne({
		where: { id: parseInt(foodId) },
		relations: ['company'],
	});

	if (!food) return res.json(CreateResponse(FOOD_CANNOT_BE_FOUND));

	const table = await tableRepository.findOne({
		where: { id: parseInt(tableId) },
		relations: ['company', 'items'],
	});

	if (!table) return res.json(CreateResponse(TABLE_CANNOT_BE_FOUND));

	if (food.company.id !== table.company.id)
		return res.json(CreateResponse(FOOD_NOT_OWNED));

	if (!isOwner(userId, table.company.id))
		return res.json(CreateResponse(OWNER_ERROR));

	const orderItem = new OrderItem();
	orderItem.amount = parseFloat(amount);
	orderItem.food = food;
	orderItem.table = table;

	table.total = table.total + food.price * parseFloat(amount);
	table.items.push(orderItem);

	return await tableRepository
		.save(table)
		.then(() => res.json(FOOD_ADDED_ON_TABLE))
		.catch(() => res.json(CreateResponse(FOOD_FAILED_ON_TABLE)));
});

router.get('/foods', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	const err = isInt([id]);
	if (err) return res.json(err);

	const table = await tableRepository.findOne({
		relations: ['items'],
		where: { id: parseInt(id) },
	});

	if (!table) return res.json(CreateResponse(TABLE_CANNOT_BE_FOUND));

	return res.json(table.items);
});

router.post('/create', async (req: Request, res: Response) => {
	const { companyId, name, description } = req.body;
	const userId = req.session.userId;

	if (!companyId) return res.json(CreateResponse(EMPTY_ID));

	const error = isInt([companyId]);
	if (error) return res.json(error);

	const numberId = parseInt(companyId);

	const err = await isOwner(userId, numberId);

	if (err) return res.json(err);

	const user = await userRepository.findOne({ where: { id: userId } });
	if (!user) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));
	const subscription = getSubscriptionType(user);
	const limit = new SubscriptionLimits().getTable(subscription);
	const company = await companyRepository.findOne({
		where: { id: numberId },
	});
	if (!company) return res.json(CreateResponse(COMPANY_CANNOT_BE_FOUND));
	const tables = company.tables;
	if (tables && tables.length >= limit)
		return res.json(CreateResponse(LIMIT_REACHED));

	const newTable = new Table();
	newTable.name = name;
	newTable.description = description;
	newTable.company = company;

	return await tableRepository
		.save(newTable)
		.then(() => res.json(TABLE_CREATED))
		.catch((e) => console.log(e));
});

router.delete('/remove', async (req: Request, res: Response) => {
	const { id } = req.body;

	const userId = req.session.userId;
	if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	const err = isInt([id]);
	if (err) return res.json(err);

	const table = await tableRepository.findOne({
		where: { id: parseInt(id) },
		relations: ['company'],
	});

	if (!table) return res.json(CreateResponse(TABLE_CANNOT_BE_FOUND));

	if (!isOwner(userId, table.company.id))
		return res.json(CreateResponse(OWNER_ERROR));

	return await tableRepository
		.remove(table)
		.then(() => res.json(TABLE_CREATED))
		.catch(() => {
			return res.json(CreateResponse(TABLE_REMOVE_FAILED));
		});
});

export default router;
