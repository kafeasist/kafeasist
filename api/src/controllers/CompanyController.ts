import {
	ALREADY_IN_USE,
	COMPANY_CANNOT_BE_FOUND,
	COMPANY_EDIT_FAILED,
	COMPANY_EDIT_SUCCEEDED,
	COMPANY_REMOVED,
	COMPANY_REMOVE_ERROR,
	CreateResponse,
	EMPTY_ID,
	LIMIT_REACHED,
	NO_CATEGORY_FOUND,
	NO_EMPLOYEE_FOUND,
	NO_TABLE_FOUND,
	SUBSCRIPTION_NOT_FOUND,
	USER_CANNOT_BE_FOUND,
} from '@kafeasist/responses';
import { z } from 'zod';
import { orm } from '../config/typeorm.config';
import { Company } from '../entities/Company';
import { User } from '../entities/User';
import { isOwner } from '../middlewares/isOwner';
import { publicProcedure, router } from '../routes/trpc';
import { getSubscriptionType } from '../utils/getSubscriptionType';
import { logger } from '../utils/logger';
import { SubscriptionLimits } from '../utils/SubscriptionInfo';
import { validateInputs } from '../utils/validateInputs';

const companyRepository = orm.getRepository(Company);
const userRepository = orm.getRepository(User);

export const companyRouter = router({
	get: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ input }) => {
			const { id } = input;

			const company = await companyRepository.findOne({
				where: { id: id },
			});

			if (!company) return CreateResponse(COMPANY_CANNOT_BE_FOUND);

			return company;
		}),
	tables: publicProcedure // TODO: isAuth
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { id } = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const company = await companyRepository.findOne({
				where: { id: id },
				relations: ['tables'],
			});

			if (!company) return CreateResponse(COMPANY_CANNOT_BE_FOUND);

			const ownership = await isOwner(userId, company.id);
			if (ownership) return ownership;

			const tables = company.tables;

			if (!tables) return CreateResponse(NO_TABLE_FOUND);

			return tables;
		}),
	categories: publicProcedure // TODO: isAuth
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { id } = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const company = await companyRepository.findOne({
				where: { id: id },
				relations: ['categories'],
			});

			if (!company) return CreateResponse(COMPANY_CANNOT_BE_FOUND);

			const ownership = await isOwner(userId, company.id);
			if (ownership) return ownership;

			const categories = company.categories;

			if (!categories) return CreateResponse(NO_CATEGORY_FOUND);

			return categories;
		}),
	employees: publicProcedure // TODO: isAuth
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { id } = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const company = await companyRepository.findOne({
				where: { id: id },
				relations: ['employees'],
			});

			if (!company) return CreateResponse(COMPANY_CANNOT_BE_FOUND);

			const ownership = await isOwner(userId, company.id);
			if (ownership) return ownership;

			const employees = company.employees;

			if (!employees) return CreateResponse(NO_EMPLOYEE_FOUND);

			return employees;
		}),
	create: publicProcedure // TODO: isAuth
		.input(
			z.object({
				name: z.string(),
				address: z.string(),
				phone: z.string(),
				image_url: z.string().url().optional(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { name, address, phone, image_url, description } = input;

			const err = validateInputs({ name, address, phone });
			if (err) return err;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const user = await userRepository.findOne({
				where: { id: userId },
				relations: ['companies'],
			});
			if (!user) return CreateResponse(USER_CANNOT_BE_FOUND);
			const userCompanies = user.companies;

			const subscription = getSubscriptionType(user.subs_type);
			if (subscription === null) return SUBSCRIPTION_NOT_FOUND;
			const companyLimit = new SubscriptionLimits().getCompany;

			if (!userCompanies) return CreateResponse(COMPANY_CANNOT_BE_FOUND);
			if (userCompanies.length >= companyLimit(subscription))
				return CreateResponse(LIMIT_REACHED);

			let exists = false;
			userCompanies.forEach((company) => {
				if (company.name === name) exists = true;
			});

			if (exists)
				return CreateResponse({ ...ALREADY_IN_USE, fields: 'name' });

			const newCompany = new Company();
			newCompany.name = name;
			newCompany.address = address;
			newCompany.phone = phone;
			newCompany.image_url = image_url;
			newCompany.description = description;
			newCompany.owner = user;

			companyRepository.save(newCompany).catch((error) => logger(error));

			return newCompany;
		}),
	edit: publicProcedure // TODO: isAuth
		.input(
			z.object({
				companyId: z.number(),
				name: z.string().optional(),
				address: z.string().optional(),
				phone: z.string().optional(),
				image_url: z.string().url().optional(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { companyId, name, address, phone, image_url, description } =
				input;

			const company = await companyRepository.findOne({
				where: { id: companyId },
			});
			if (!company) return CreateResponse(COMPANY_CANNOT_BE_FOUND);

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const ownership = await isOwner(userId, company.id);
			if (ownership) return ownership;

			const errors = validateInputs({
				name: name ? name : company.name,
				address: address ? address : company.address,
				phone: phone ? phone : company.phone,
			});
			if (errors) return errors;

			company.name = name ? name : company.name;
			company.address = address ? address : company.address;
			company.phone = phone ? phone : company.phone;
			company.image_url = image_url ? image_url : company.image_url;
			company.description = description
				? description
				: company.description;
			await companyRepository.save(company).catch((e) => {
				logger(e);
				return CreateResponse(COMPANY_EDIT_FAILED);
			});

			return CreateResponse(COMPANY_EDIT_SUCCEEDED);
		}),
	remove: publicProcedure // TODO: isAuth
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id } = input;
			if (!id) return CreateResponse(EMPTY_ID);

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const company = await companyRepository.findOne({
				where: { id },
			});

			if (!company) return CreateResponse(COMPANY_CANNOT_BE_FOUND);

			const ownership = await isOwner(userId, company.id);
			if (ownership) return ownership;

			return companyRepository
				.remove(company)
				.then(() => CreateResponse(COMPANY_REMOVED))
				.catch((err) => {
					logger(err.message);
					return CreateResponse(COMPANY_REMOVE_ERROR);
				});
		}),
});

export default router;
