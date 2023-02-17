import { Router, Response } from 'express';
import { validateInputs, InputsInterface } from '../utils/validateInputs';
import { SubscriptionLimits } from '../utils/SubscriptionInfo';
import { getSubscriptionType } from '../utils/getSubscriptionType';
import { CreateResponse } from '@kafeasist/responses';
import { isOwner } from '../middlewares/isOwner';
import { orm } from '../config/typeorm.config';
import { Category } from '../entities/Category';
import { Company } from '../entities/Company';
import { User } from '../entities/User';
import {
	ALREADY_IN_USE,
	CATEGORY_CANNOT_BE_FOUND,
	CATEGORY_CREATED,
	CATEGORY_EDIT_FAILED,
	CATEGORY_EDIT_SUCCEEDED,
	CATEGORY_REMOVED,
	CATEGORY_REMOVE_ERROR,
	COMPANY_CANNOT_BE_FOUND,
	EMPTY_ID,
	LIMIT_REACHED,
	OWNER_ERROR,
	SUBSCRIPTION_NOT_FOUND,
	USER_CANNOT_BE_FOUND,
} from '@kafeasist/responses';
import { isInt } from '../middlewares/isInt';
import { logger } from '../utils/logger';
import { ExtendedRequest, IDRequest } from '../types/ExtendedRequest';

const router = Router();

const categoryRepository = orm.getRepository(Category);
const companyRepository = orm.getRepository(Company);
const userRepository = orm.getRepository(User);

export interface CategoryCreate {
	name: string;
	description: string;
	companyId: string;
}

export interface CategoryEdit {
	name: string;
	description: string;
	categoryId: string;
}

router.get('/get', async (req: IDRequest, res: Response) => {
	const { id } = req.query;

	if (!id) return res.json(CreateResponse(EMPTY_ID));

	const err = isInt([id]);
	if (err) return res.json(err);
	const numberId = parseInt(id);

	const category = await categoryRepository.findOne({
		where: { id: numberId },
	});

	if (!category) return res.json(CreateResponse(CATEGORY_CANNOT_BE_FOUND));

	return res.json(category);
});

router.post(
	'/create',
	async (req: ExtendedRequest<CategoryCreate>, res: Response) => {
		const { name, description, companyId } = req.body;

		if (!companyId) return res.json(CreateResponse(EMPTY_ID));

		const error = isInt([companyId]);
		if (error) return res.json(error);
		const numberId = parseInt(companyId);

		const company = await companyRepository.findOne({
			where: { id: numberId },
			relations: ['categories'],
		});

		if (!company) return res.json(CreateResponse(COMPANY_CANNOT_BE_FOUND));

		const err = validateInputs({ name } as InputsInterface);
		if (err) return res.json(err);

		const userId = req.session.userId;
		if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

		if (!isOwner(userId, numberId))
			return res.json(CreateResponse(OWNER_ERROR));

		const user = await userRepository.findOne({ where: { id: userId } });
		if (!user) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));
		const subscription = getSubscriptionType(user.subs_type);
		if (subscription === null) return res.json(SUBSCRIPTION_NOT_FOUND);
		const limit = new SubscriptionLimits().getCategory(subscription);

		const categories = company.categories;

		if (!categories)
			return res.json(CreateResponse(CATEGORY_CANNOT_BE_FOUND));
		if (categories.length >= limit)
			return res.json(CreateResponse(LIMIT_REACHED));

		let exists = false;
		categories.forEach((category) => {
			if (category.name === name) exists = true;
		});

		if (exists)
			return res.json(
				CreateResponse({ ...ALREADY_IN_USE, fields: 'name' }),
			);

		const newCategory = new Category();
		newCategory.name = name;
		newCategory.description = description;
		newCategory.company = company;

		return await categoryRepository
			.save(newCategory)
			.then(() => {
				return res.json(CreateResponse(CATEGORY_CREATED));
			})
			.catch((error) => {
				console.log(error);
			});
	},
);

router.put(
	'/edit',
	async (req: ExtendedRequest<CategoryEdit>, res: Response) => {
		const { categoryId, name, description } = req.body;

		const userId = req.session.userId;
		if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

		const err = isInt([categoryId]);
		if (err) return res.json(err);

		if (name) {
			const error = validateInputs({ name });
			if (error) return res.json(error);
		}

		const category = await categoryRepository.findOne({
			where: { id: parseInt(categoryId) },
			relations: ['company'],
		});
		if (!category)
			return res.json(CreateResponse(CATEGORY_CANNOT_BE_FOUND));

		category.name = name ? name : category.name;
		category.description = description ? description : category.description;
		await categoryRepository.save(category).catch((e) => {
			logger(e);
			return res.json(CreateResponse(CATEGORY_EDIT_FAILED));
		});

		return res.json(CreateResponse(CATEGORY_EDIT_SUCCEEDED));
	},
);

router.delete(
	'/remove',
	async (req: ExtendedRequest<{ id: string }>, res: Response) => {
		const { id } = req.body;

		if (!id) return res.json(CreateResponse(EMPTY_ID));

		const err = isInt([id]);
		if (err) return res.json(err);
		const numberId = parseInt(id);

		const category = await categoryRepository.findOne({
			where: { id: numberId },
		});

		if (!category)
			return res.json(CreateResponse(CATEGORY_CANNOT_BE_FOUND));

		const userId = req.session.userId;
		if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

		if (!isOwner(userId, numberId))
			return res.json(CreateResponse(OWNER_ERROR));

		return await categoryRepository
			.remove(category)
			.then(() => {
				return res.json(CreateResponse(CATEGORY_REMOVED));
			})
			.catch(() => {
				return res.json(CreateResponse(CATEGORY_REMOVE_ERROR));
			});
	},
);

export default router;
