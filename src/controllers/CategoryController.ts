import { Router, Request, Response } from 'express';
import { validateInputs, InputsInterface } from '../middlewares/validateInputs';
import { SubscriptionLimits } from '../types/SubscriptionInfo';
import { getSubscriptionType } from '../utils/getSubscriptionType';
import { CreateResponse } from '../utils/CreateResponse';
import { isOwner } from '../middlewares/isOwner';
import { orm } from '../config/typeorm.config';
import { Category } from '../entities/Category';
import { Company } from '../entities/Company';
import { User } from '../entities/User';
import {
	CATEGORY_CANNOT_BE_FOUND,
	CATEGORY_CREATED,
	CATEGORY_REMOVED,
	CATEGORY_REMOVE_ERROR,
	COMPANY_CANNOT_BE_FOUND,
	EMPTY_ID,
	LIMIT_REACHED,
	OWNER_ERROR,
	USER_CANNOT_BE_FOUND,
} from '../config/Responses';
import { isInt } from '../middlewares/isInt';

const router = Router();

const categoryRepository = orm.getRepository(Category);
const companyRepository = orm.getRepository(Company);
const userRepository = orm.getRepository(User);

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

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

router.post('/create', async (req: Request, res: Response) => {
	const { name, description, companyId } = req.body;

	if (!companyId) return res.json(CreateResponse(EMPTY_ID));

	const error = isInt([companyId]);
	if (error) return res.json(error);
	const numberId = parseInt(companyId);

	const company = await companyRepository.findOne({
		where: { id: numberId },
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
	const subscription = getSubscriptionType(user);
	const limit = new SubscriptionLimits().getCategory(subscription);

	const categories = company.categories;

	if (categories && categories.length >= limit)
		return res.json(CreateResponse(LIMIT_REACHED));

	const newCategory = new Category();
	newCategory.name = name;
	newCategory.description = description;
	newCategory.company = company;

	return await categoryRepository
		.save(newCategory)
		.then(() => {
			return res.json(CATEGORY_CREATED);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.delete('/remove', async (req: Request, res: Response) => {
	const { id } = req.body;

	if (!id) return res.json(CreateResponse(EMPTY_ID));

	const err = isInt([id]);
	if (err) return res.json(err);
	const numberId = parseInt(id);

	const category = await categoryRepository.findOne({
		where: { id: numberId },
	});

	if (!category) return res.json(CreateResponse(CATEGORY_CANNOT_BE_FOUND));

	const userId = req.session.userId;
	if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	if (!isOwner(userId, numberId))
		return res.json(CreateResponse(OWNER_ERROR));

	return await categoryRepository
		.remove(category)
		.then(() => {
			return res.json(CATEGORY_REMOVED);
		})
		.catch(() => {
			return res.json(CreateResponse(CATEGORY_REMOVE_ERROR));
		});
});

export default router;
