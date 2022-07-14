import { Request, Response, Router } from 'express';
import { CreateResponse } from '../utils/CreateResponse';
import { isAuth } from '../middlewares/isAuth';
import { validateInputs } from '../middlewares/validateInputs';
import { getSubscriptionType } from '../utils/getSubscriptionType';
import { SubscriptionLimits } from '../types/SubscriptionInfo';
import { logger } from '../utils/logger';
import { orm } from '../config/typeorm.config';
import { Company } from '../entities/Company';
import { User } from '../entities/User';
import {
	ALREADY_IN_USE,
	COMPANY_CANNOT_BE_FOUND,
	COMPANY_REMOVED,
	COMPANY_REMOVE_ERROR,
	EMPTY_ID,
	LIMIT_REACHED,
	NO_CATEGORY_FOUND,
	NO_TABLE_FOUND,
	SUBSCRIPTION_NOT_FOUND,
	USER_CANNOT_BE_FOUND,
} from '../config/Responses';
import { isInt } from '../middlewares/isInt';

const router = Router();

const companyRepository = orm.getRepository(Company);
const userRepository = orm.getRepository(User);

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id) return res.json(CreateResponse(EMPTY_ID));

	const err = isInt([id]);
	if (err) return res.json(err);

	const numberId = parseInt(id);

	const company = await companyRepository.findOne({
		where: { id: numberId },
	});

	if (!company) return res.json(CreateResponse(COMPANY_CANNOT_BE_FOUND));

	return res.json(company);
});

router.get('/tables', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id) return res.json(CreateResponse(EMPTY_ID));

	const err = isInt([id]);
	if (err) return res.json(err);

	const company = await companyRepository.findOne({
		where: { id: parseInt(id) },
		relations: ['tables'],
	});

	if (!company) return res.json(CreateResponse(COMPANY_CANNOT_BE_FOUND));

	const tables = company.tables;

	if (!tables) return res.json(CreateResponse(NO_TABLE_FOUND));

	return res.json(tables);
});

router.get('/categories', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id) return res.json(CreateResponse(EMPTY_ID));

	const err = isInt([id]);
	if (err) return res.json(err);

	const company = await companyRepository.findOne({
		where: { id: parseInt(id) },
		relations: ['categories'],
	});

	if (!company) return res.json(CreateResponse(COMPANY_CANNOT_BE_FOUND));

	const categories = company.categories;

	if (!categories) return res.json(CreateResponse(NO_CATEGORY_FOUND));

	return res.json(categories);
});

router.post('/create', isAuth, async (req: Request, res: Response) => {
	const { name, address, phone, image_url, description } = req.body;

	const err = validateInputs({ name, address, phone });
	if (err) return res.json(err);

	const userId = req.session.userId;
	if (!userId) return res.json(USER_CANNOT_BE_FOUND);
	const user = await userRepository.findOne({
		where: { id: userId },
		relations: ['companies'],
	});

	if (!user) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));
	const userCompanies = user?.companies;

	const subscription = getSubscriptionType(user.subs_type);
	if (!subscription) return res.json(SUBSCRIPTION_NOT_FOUND);
	const companyLimit = new SubscriptionLimits().getCompany;

	if (userCompanies && userCompanies?.length >= companyLimit(subscription))
		return res.json(CreateResponse(LIMIT_REACHED));

	let exists = false;
	userCompanies.forEach((company) => {
		if (company.name === name) exists = true;
	});

	if (exists)
		return res.json(CreateResponse({ ...ALREADY_IN_USE, fields: 'name' }));

	const newCompany = new Company();
	newCompany.name = name;
	newCompany.address = address;
	newCompany.phone = phone;
	newCompany.image_url = image_url;
	newCompany.description = description;
	newCompany.owner = user;

	await companyRepository.save(newCompany).catch((error) => logger(error));

	return res.json(newCompany);
});

router.delete('/remove', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id) return res.json(CreateResponse(EMPTY_ID));

	const err = isInt([id]);
	if (err) return res.json(err);

	const numberId = parseInt(id);

	const company = await companyRepository.findOne({
		where: { id: numberId },
	});

	if (!company) return res.json(CreateResponse(COMPANY_CANNOT_BE_FOUND));

	return companyRepository
		.remove(company)
		.then(() => res.json(CreateResponse(COMPANY_REMOVED)))
		.catch((err) => {
			logger(err.message);
			return res.json(CreateResponse(COMPANY_REMOVE_ERROR));
		});
});

export default router;
