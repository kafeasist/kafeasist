import {
	CATEGORY_CANNOT_BE_FOUND,
	COMPANY_CANNOT_BE_FOUND,
	CreateResponse,
	FOOD_CANNOT_BE_FOUND,
	FOOD_CREATED,
	FOOD_EDIT_FAILED,
	FOOD_EDIT_SUCCEEDED,
	FOOD_REMOVED,
	FOOD_REMOVE_ERROR,
	OWNER_ERROR,
	USER_CANNOT_BE_FOUND,
} from '@kafeasist/responses';
import { z } from 'zod';
import { orm } from '../config/typeorm.config';
import { Category } from '../entities/Category';
import { Company } from '../entities/Company';
import { Food } from '../entities/Food';
import { isOwner } from '../middlewares/isOwner';
import { publicProcedure, router } from '../routes/trpc';
import { logger } from '../utils/logger';
import { validateInputs } from '../utils/validateInputs';

const foodRepository = orm.getRepository(Food);
const categoryRepository = orm.getRepository(Category);
const companyRepository = orm.getRepository(Company);

// TODO: isAuth
export const foodRouter = router({
	get: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			const { id } = input;

			const food = await foodRepository.findOne({
				where: { id },
			});

			if (!food) return CreateResponse(FOOD_CANNOT_BE_FOUND);

			return food;
		}),
	create: publicProcedure
		.input(
			z.object({
				name: z.string(),
				priceFirst: z.number(),
				priceLast: z.number(),
				description: z.string().optional(),
				categoryId: z.number(),
				companyId: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const {
				name,
				priceFirst,
				priceLast,
				description,
				categoryId,
				companyId,
			} = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const errors = validateInputs({ name });
			if (errors) return errors;

			const category = await categoryRepository.findOne({
				where: { id: categoryId },
			});

			if (!category) return CreateResponse(CATEGORY_CANNOT_BE_FOUND);

			const company = await companyRepository.findOne({
				where: { id: companyId },
				relations: ['owner'],
			});

			if (!company) return CreateResponse(COMPANY_CANNOT_BE_FOUND);

			const price = priceFirst + priceLast / 100;

			if (company.owner.id !== userId) return CreateResponse(OWNER_ERROR);

			const newFood = new Food();
			newFood.name = name;
			newFood.price = price;
			newFood.category = category;
			newFood.company = company;
			newFood.description = description;

			return await foodRepository
				.save(newFood)
				.then(() => CreateResponse(FOOD_CREATED))
				.catch((e) => console.log(e));
		}),
	edit: publicProcedure
		.input(
			z.object({
				foodId: z.number(),
				name: z.string().optional(),
				priceFirst: z.number().optional(),
				priceLast: z.number().optional(),
				description: z.string().optional(),
				categoryId: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const {
				foodId,
				name,
				priceFirst,
				priceLast,
				description,
				categoryId,
			} = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const error = validateInputs({ name });
			if (error) return error;

			const food = await foodRepository.findOne({
				where: { id: foodId },
				relations: ['company'],
			});
			if (!food) return CreateResponse(FOOD_CANNOT_BE_FOUND);

			const ownership = await isOwner(userId, food.company.id);
			if (ownership) return ownership;

			let category: Category | null = null;
			if (categoryId) {
				category = await categoryRepository.findOne({
					where: { id: categoryId },
				});
				if (!category) return CreateResponse(CATEGORY_CANNOT_BE_FOUND);
			}

			let price: number | null = null;
			if (priceFirst && priceLast) price = priceFirst + priceLast / 100;

			food.name = name ? name : food.name;
			food.price = price ? price : food.price;
			food.description = description ? description : food.description;
			food.category = category ? category : food.category;

			foodRepository.save(food).catch((e) => {
				logger(e);
				return CreateResponse(FOOD_EDIT_FAILED);
			});

			return CreateResponse(FOOD_EDIT_SUCCEEDED);
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

			const food = await foodRepository.findOne({
				where: { id },
			});
			if (!food) return CreateResponse(FOOD_CANNOT_BE_FOUND);

			const ownership = await isOwner(userId, food.company.id);
			if (ownership) return ownership;

			return await foodRepository
				.remove(food)
				.then(() => CreateResponse(FOOD_REMOVED))
				.catch(() => {
					return CreateResponse(FOOD_REMOVE_ERROR);
				});
		}),
});

export default router;
