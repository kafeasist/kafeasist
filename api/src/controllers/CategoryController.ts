import { validateInputs, InputsInterface } from '../utils/validateInputs';
import { SubscriptionLimits } from '../utils/SubscriptionInfo';
import { getSubscriptionType } from '../utils/getSubscriptionType';
import { CreateResponse, USER_CANNOT_BE_FOUND } from '@kafeasist/responses';
import { isOwner } from '../middlewares/isOwner';
import { orm } from '../config/typeorm.config';
import { Category } from '../entities/Category';
import { Company } from '../entities/Company';
import {
	ALREADY_IN_USE,
	CATEGORY_CANNOT_BE_FOUND,
	CATEGORY_CREATED,
	CATEGORY_EDIT_FAILED,
	CATEGORY_EDIT_SUCCEEDED,
	CATEGORY_REMOVED,
	CATEGORY_REMOVE_ERROR,
	COMPANY_CANNOT_BE_FOUND,
	LIMIT_REACHED,
	SUBSCRIPTION_NOT_FOUND,
} from '@kafeasist/responses';
import { logger } from '../utils/logger';
import { User } from '../entities/User';
import { publicProcedure, router } from '../routes/trpc';
import { z } from 'zod';

const categoryRepository = orm.getRepository(Category);
const companyRepository = orm.getRepository(Company);
const userRepository = orm.getRepository(User);

export const categoryRouter = router({
	get: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ input }) => {
			const { id } = input;

			const category = await categoryRepository.findOne({
				where: { id },
			});

			if (!category) return CreateResponse(CATEGORY_CANNOT_BE_FOUND);

			return category;
		}),
	create: publicProcedure // TODO: isAuth
		.input(
			z.object({
				name: z.string(),
				description: z.string().optional(),
				companyId: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { name, description, companyId } = input;

			const company = await companyRepository.findOne({
				where: { id: companyId },
				relations: ['categories'],
			});

			if (!company) return CreateResponse(COMPANY_CANNOT_BE_FOUND);

			const err = validateInputs({ name } as InputsInterface);
			if (err) return err;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const owner = await isOwner(userId, companyId);
			if (owner) return owner;

			const user = await userRepository.findOne({
				where: { id: userId },
			});
			if (!user) return CreateResponse(USER_CANNOT_BE_FOUND);

			const subscription = getSubscriptionType(user.subs_type);
			if (subscription === null) return SUBSCRIPTION_NOT_FOUND;
			const limit = new SubscriptionLimits().getCategory(subscription);

			const categories = company.categories;

			if (!categories) return CreateResponse(CATEGORY_CANNOT_BE_FOUND);
			if (categories.length >= limit)
				return CreateResponse(LIMIT_REACHED);

			let exists = false;
			categories.forEach((category) => {
				if (category.name === name) exists = true;
			});

			if (exists)
				return CreateResponse({ ...ALREADY_IN_USE, fields: 'name' });

			const newCategory = new Category();
			newCategory.name = name;
			newCategory.description = description;
			newCategory.company = company;

			return categoryRepository
				.save(newCategory)
				.then(() => {
					return CreateResponse(CATEGORY_CREATED);
				})
				.catch((error) => {
					console.log(error);
				});
		}),

	edit: publicProcedure
		.input(
			z.object({
				categoryId: z.number(),
				name: z.string(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const { categoryId, name, description } = input;

			if (name) {
				const error = validateInputs({ name });
				if (error) return error;
			}

			const category = await categoryRepository.findOne({
				where: { id: categoryId },
				relations: ['company'],
			});
			if (!category) return CreateResponse(CATEGORY_CANNOT_BE_FOUND);

			category.name = name ? name : category.name;
			category.description = description
				? description
				: category.description;
			await categoryRepository.save(category).catch((e) => {
				logger(e);
				return CreateResponse(CATEGORY_EDIT_FAILED);
			});

			return CreateResponse(CATEGORY_EDIT_SUCCEEDED);
		}),

	delete: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id } = input;

			const category = await categoryRepository.findOne({
				where: { id },
			});

			if (!category) return CreateResponse(CATEGORY_CANNOT_BE_FOUND);

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const owner = await isOwner(userId, id);
			if (owner) return owner;

			return await categoryRepository
				.remove(category)
				.then(() => {
					return CreateResponse(CATEGORY_REMOVED);
				})
				.catch(() => {
					return CreateResponse(CATEGORY_REMOVE_ERROR);
				});
		}),
});

export default router;
