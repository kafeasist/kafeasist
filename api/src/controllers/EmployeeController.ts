import {
	ALREADY_IN_USE,
	COMPANY_CANNOT_BE_FOUND,
	CreateResponse,
	EMPLOYEE_CANNOT_BE_FOUND,
	EMPLOYEE_CREATED,
	EMPLOYEE_CREATE_FAILED,
	EMPLOYEE_EDITED,
	EMPLOYEE_EDIT_FAILED,
	EMPLOYEE_REMOVED,
	EMPLOYEE_REMOVE_FAILED,
	EMPTY_ID,
	ROLE_CANNOT_BE_FOUND,
	SAME_PASSWORD,
	USER_CANNOT_BE_FOUND,
} from '@kafeasist/responses';
import argon2 from 'argon2';
import { z } from 'zod';
import { orm } from '../config/typeorm.config';
import { Company } from '../entities/Company';
import { Employee, isValidRole, UserRoles } from '../entities/Employee';
import { isOwner } from '../middlewares/isOwner';
import { publicProcedure, router } from '../routes/trpc';
import { getUniqueItem } from '../utils/getUniqueItem';
import { logger } from '../utils/logger';
import { validateInputs } from '../utils/validateInputs';

const companyRepository = orm.getRepository(Company);
const employeeRepository = orm.getRepository(Employee);

// TODO: isAuth
export const employeeRouter = router({
	get: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { id } = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			if (!id) return CreateResponse(EMPTY_ID);

			const employee = await employeeRepository.findOne({
				where: { id: id },
			});

			if (!employee) return CreateResponse(EMPLOYEE_CANNOT_BE_FOUND);

			return employee;
		}),
	create: publicProcedure
		.input(
			z.object({
				username: z.string(),
				first_name: z.string(),
				last_name: z.string(),
				image_url: z.string().url().optional(),
				role: z.string(),
				password: z.string(),
				confirmPassword: z.string(),
				companyId: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const {
				username,
				first_name,
				last_name,
				image_url,
				role,
				password,
				confirmPassword,
				companyId,
			} = input;

			const userId = ctx.userId;
			if (!userId) return USER_CANNOT_BE_FOUND;

			const err = validateInputs({
				username,
				name: first_name,
				last_name,
				password,
				confirmPassword,
			});
			if (err) return err;

			if (!isValidRole(role)) return CreateResponse(ROLE_CANNOT_BE_FOUND);

			const ownership = await isOwner(userId, companyId);
			if (ownership) return ownership;

			const company = await companyRepository.findOne({
				where: { id: companyId },
			});
			if (!company) return CreateResponse(COMPANY_CANNOT_BE_FOUND);

			const hashedPassword = await argon2.hash(password);

			const employee = new Employee();
			employee.username = username;
			employee.first_name = first_name;
			employee.last_name = last_name;
			employee.image_url = image_url;
			employee.role = role;
			employee.password = hashedPassword;
			employee.company = company;

			return await employeeRepository
				.save(employee)
				.then(() => CreateResponse(EMPLOYEE_CREATED))
				.catch((err: any) => {
					if (err.code === '23505') {
						const item = getUniqueItem(err.detail);
						return CreateResponse({
							...ALREADY_IN_USE,
							fields: item,
						});
					} else {
						logger(err);
						return CreateResponse(EMPLOYEE_CREATE_FAILED);
					}
				});
		}),
	edit: publicProcedure
		.input(
			z.object({
				employeeId: z.number(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				image_url: z.string().url().optional(),
				role: z.string().optional(),
				password: z.string().optional(),
				confirmPassword: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const {
				employeeId,
				first_name,
				last_name,
				image_url,
				role,
				password,
				confirmPassword,
			} = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const err = validateInputs({
				name: first_name,
				last_name,
				password,
				confirmPassword,
			});
			if (err) return err;

			const employee = await employeeRepository.findOne({
				where: { id: employeeId },
			});

			if (!employee) return CreateResponse(EMPLOYEE_CANNOT_BE_FOUND);

			if (role && !isValidRole(role))
				return CreateResponse(ROLE_CANNOT_BE_FOUND);

			if (password) {
				const isSame = await argon2.verify(employee.password, password);
				if (isSame) return CreateResponse(SAME_PASSWORD);
				const hashedPassword = await argon2.hash(password);
				employee.password = hashedPassword;
			}

			employee.first_name = first_name ? first_name : employee.first_name;
			employee.last_name = last_name ? last_name : employee.last_name;
			employee.image_url = image_url ? image_url : employee.image_url;
			employee.role = role ? (role as UserRoles) : employee.role;

			await employeeRepository.save(employee).catch((err) => {
				logger(err);
				return CreateResponse(EMPLOYEE_EDIT_FAILED);
			});

			return CreateResponse(EMPLOYEE_EDITED);
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

			const employee = await employeeRepository.findOne({
				where: { id: id },
				relations: ['company'],
			});

			if (!employee) return CreateResponse(EMPLOYEE_CANNOT_BE_FOUND);

			const ownership = isOwner(userId, employee.company.id);
			if (ownership !== null) return ownership;

			await employeeRepository.remove(employee).catch((error) => {
				logger(error);
				return CreateResponse(EMPLOYEE_REMOVE_FAILED);
			});

			return CreateResponse(EMPLOYEE_REMOVED);
		}),
});

export default router;
