import { Response, Router } from 'express';
import { isInt } from '../middlewares/isInt';
import { CreateResponse } from '../utils/CreateResponse';
import { validateInputs } from '../utils/validateInputs';
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
	FOOD_EDIT_FAILED,
	FOOD_EDIT_SUCCEEDED,
	FOOD_REMOVED,
	FOOD_REMOVE_ERROR,
	OWNER_ERROR,
	USER_CANNOT_BE_FOUND,
} from '../config/Responses';
import { logger } from '../utils/logger';
import { ExtendedRequest, IDRequest } from '../types/ExtendedRequest';

const router = Router();

const foodRepository = orm.getRepository(Food);
const categoryRepository = orm.getRepository(Category);
const companyRepository = orm.getRepository(Company);

export interface FoodCreateParams {
	name: string;
	priceFirst: string;
	priceLast: string;
	description?: string;
	categoryId: string;
	companyId: string;
}

export interface FoodEditParams {
	foodId: string;
	name?: string;
	priceFirst?: string;
	priceLast?: string;
	description?: string;
	categoryId?: string;
}

router.get('/get', async (req: IDRequest, res: Response) => {
	const { id } = req.query;

	const err = isInt([id]);
	if (err) return res.json(err);

	const food = await foodRepository.findOne({
		where: { id: parseInt(id) },
	});

	if (!food) return res.json(CreateResponse(FOOD_CANNOT_BE_FOUND));

	return res.json(food);
});

router.post(
	'/create',
	async (req: ExtendedRequest<FoodCreateParams>, res: Response) => {
		const {
			name,
			priceFirst,
			priceLast,
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

		if (!category)
			return res.json(CreateResponse(CATEGORY_CANNOT_BE_FOUND));

		const company = await companyRepository.findOne({
			where: { id: parseInt(companyId) },
			relations: ['owner'],
		});

		if (!company) return res.json(CreateResponse(COMPANY_CANNOT_BE_FOUND));

		const price =
			parseInt(priceFirst) + parseInt(priceLast[0] + priceLast[1]) / 100;

		if (company.owner.id !== userId)
			return res.json(CreateResponse(OWNER_ERROR));

		const newFood = new Food();
		newFood.name = name;
		newFood.price = price;
		newFood.category = category;
		newFood.company = company;
		newFood.description = description;

		return await foodRepository
			.save(newFood)
			.then(() => res.json(CreateResponse(FOOD_CREATED)))
			.catch((e) => console.log(e));
	},
);

router.put(
	'/edit',
	async (req: ExtendedRequest<FoodEditParams>, res: Response) => {
		const { foodId, name, priceFirst, priceLast, description, categoryId } =
			req.body;

		const userId = req.session.userId;
		if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

		const err = isInt([
			foodId,
			priceFirst ? priceFirst : '0',
			priceLast ? priceLast : '0',
			categoryId ? categoryId : '0',
		]);
		if (err) return res.json(err);

		const error = validateInputs({ name });
		if (error) return res.json(error);

		const food = await foodRepository.findOne({
			where: { id: parseInt(foodId) },
			relations: ['company'],
		});
		if (!food) return res.json(CreateResponse(FOOD_CANNOT_BE_FOUND));

		if (!isOwner(userId, food.company.id))
			return res.json(CreateResponse(OWNER_ERROR));

		let category: Category | null = null;
		if (categoryId) {
			category = await categoryRepository.findOne({
				where: { id: parseInt(categoryId) },
			});
			if (!category)
				return res.json(CreateResponse(CATEGORY_CANNOT_BE_FOUND));
		}

		let price: number | null = null;
		if (priceFirst && priceLast) {
			price =
				parseInt(priceFirst) +
				parseInt(priceLast[0] + priceLast[1]) / 100;
		}

		food.name = name ? name : food.name;
		food.price = price ? price : food.price;
		food.description = description ? description : food.description;
		food.category = category ? category : food.category;

		foodRepository.save(food).catch((e) => {
			logger(e);
			return res.json(CreateResponse(FOOD_EDIT_FAILED));
		});

		return res.json(CreateResponse(FOOD_EDIT_SUCCEEDED));
	},
);

router.delete(
	'/remove',
	async (req: ExtendedRequest<{ id: string }>, res: Response) => {
		const { id } = req.body;

		const userId = req.session.userId;
		if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

		const err = isInt([id]);
		if (err) return res.json(err);

		const food = await foodRepository.findOne({
			where: { id: parseInt(id) },
		});
		if (!food) return res.json(CreateResponse(FOOD_CANNOT_BE_FOUND));

		if (!isOwner(userId, food.company.id))
			return res.json(CreateResponse(OWNER_ERROR));

		return await foodRepository
			.remove(food)
			.then(() => res.json(FOOD_REMOVED))
			.catch(() => {
				return res.json(CreateResponse(FOOD_REMOVE_ERROR));
			});
	},
);

export default router;
