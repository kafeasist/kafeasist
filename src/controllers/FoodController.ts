import { Request, Response, Router } from 'express';
import { isInt } from '../middlewares/isInt';
import { CreateResponse } from '../utils/CreateResponse';
import { validateInputs } from '../middlewares/validateInputs';
import { isOwner } from '../middlewares/isOwner';
import { orm } from '../config/typeorm.config';
import { Food } from '../entities/Food';
import { Category } from '../entities/Category';
import { Company } from '../entities/Company';
import {
	CATEGORY_CANNOT_BE_FOUND,
	COMPANY_CANNOT_BE_FOUND,
	FOOD_CANNOT_BE_FOUND,
	FOOD_CREATED,
	FOOD_REMOVED,
	FOOD_REMOVE_ERROR,
	OWNER_ERROR,
	USER_CANNOT_BE_FOUND,
} from '../config/Responses';

const router = Router();

const foodRepository = orm.getRepository(Food);
const categoryRepository = orm.getRepository(Category);
const companyRepository = orm.getRepository(Company);

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	const err = isInt([id]);
	if (err) return res.json(err);

	const food = await foodRepository.findOne({ where: { id: parseInt(id) } });

	if (!food) return res.json(CreateResponse(FOOD_CANNOT_BE_FOUND));

	return res.json(food);
});

router.post('/create', async (req: Request, res: Response) => {
	let {
		name,
		priceFirst,
		priceLast,
		daily,
		description,
		categoryId,
		companyId,
	} = req.body;

	const userId = req.session.userId;
	if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	const err = isInt([priceFirst, priceLast, categoryId, companyId]);
	if (err) return res.json(err);

	const errors = validateInputs({ name });
	if (errors) return res.json(errors);

	const category = await categoryRepository.findOne({
		where: { id: parseInt(categoryId) },
	});

	if (!category) return res.json(CreateResponse(CATEGORY_CANNOT_BE_FOUND));

	const company = await companyRepository.findOne({
		where: { id: parseInt(companyId) },
		relations: ['owner'],
	});

	if (!company) return res.json(CreateResponse(COMPANY_CANNOT_BE_FOUND));

	if (priceLast.length < 2) priceLast = '0' + priceLast;
	const price =
		parseInt(priceFirst) + parseInt(priceLast[0] + priceLast[1]) / 100;

	if (company.owner.id !== userId)
		return res.json(CreateResponse(OWNER_ERROR));

	const newFood = new Food();
	newFood.name = name;
	newFood.price = price;
	newFood.category = category;
	newFood.company = company;
	newFood.daily = daily ? daily : false;
	newFood.description = description;

	return await foodRepository
		.save(newFood)
		.then(() => res.json(CreateResponse(FOOD_CREATED)))
		.catch((e) => console.log(e));
});

router.delete('/remove', async (req: Request, res: Response) => {
	const { id } = req.body;

	const userId = req.session.userId;
	if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	const err = isInt([id]);
	if (err) return res.json(err);

	const food = await foodRepository.findOne({ where: { id: parseInt(id) } });
	if (!food) return res.json(CreateResponse(FOOD_CANNOT_BE_FOUND));

	if (!isOwner(userId, food.company.id))
		return res.json(CreateResponse(OWNER_ERROR));

	return await foodRepository
		.remove(food)
		.then(() => res.json(FOOD_REMOVED))
		.catch(() => {
			return res.json(CreateResponse(FOOD_REMOVE_ERROR));
		});
});

export default router;
