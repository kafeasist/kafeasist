import { Response, Router } from 'express';
import { validateInputs } from '../utils/validateInputs';
import {
	ALREADY_IN_USE,
	COMPANY_CANNOT_BE_FOUND,
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
} from '../config/Responses';
import { isInt } from '../middlewares/isInt';
import { Employee, isValidRole } from '../entities/Employee';
import { isOwner } from '../middlewares/isOwner';
import { orm } from '../config/typeorm.config';
import { Company } from '../entities/Company';
import argon2 from 'argon2';
import { CreateResponse } from '../utils/CreateResponse';
import { logger } from '../utils/logger';
import { getUniqueItem } from '../utils/getUniqueItem';
import { ExtendedRequest, IDRequest } from '../types/ExtendedRequest';

const router = Router();

const companyRepository = orm.getRepository(Company);
const employeeRepository = orm.getRepository(Employee);

export interface EmployeeCreateParams {
	username: string;
	name: string;
	image_url?: string;
	role: any;
	password: string;
	confirmPassword: string;
	companyId: any;
}

export interface EmployeeEditParams {
	employeeId: any;
	name?: string;
	image_url?: string;
	role?: any;
	password?: string;
	confirmPassword?: string;
}

router.get('/get', async (req: IDRequest, res: Response) => {
	const { id } = req.query;

	const userId = req.session.userId;
	if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	if (!id) return res.json(CreateResponse(EMPTY_ID));

	const err = isInt([id]);
	if (err) return res.json(err);

	const employee = await employeeRepository.findOne({
		where: { id: parseInt(id) },
	});

	if (!employee) return res.json(CreateResponse(EMPLOYEE_CANNOT_BE_FOUND));

	return res.json(employee);
});

router.post(
	'/create',
	async (req: ExtendedRequest<EmployeeCreateParams>, res: Response) => {
		const {
			username,
			name,
			image_url,
			role,
			password,
			confirmPassword,
			companyId,
		} = req.body;
		const userId = req.session.userId;

		if (!userId) return res.json(USER_CANNOT_BE_FOUND);

		const err = validateInputs({
			username,
			name,
			password,
			confirmPassword,
		});
		if (err) return res.json(err);

		const error = isInt([companyId]);
		if (error) return res.json(error);

		if (!isValidRole(role))
			return res.json(CreateResponse(ROLE_CANNOT_BE_FOUND));

		const ownership = await isOwner(userId, companyId);
		if (ownership !== null) return res.json(ownership);

		const company = await companyRepository.findOne({
			where: { id: parseInt(companyId) },
		});
		if (!company) return res.json(CreateResponse(COMPANY_CANNOT_BE_FOUND));

		const hashedPassword = await argon2.hash(password);

		const employee = new Employee();
		employee.username = username;
		employee.name = name;
		employee.image_url = image_url;
		employee.role = role;
		employee.password = hashedPassword;
		employee.company = company;

		return await employeeRepository
			.save(employee)
			.then(() => res.json(CreateResponse(EMPLOYEE_CREATED)))
			.catch((err) => {
				if (err.code === '23505') {
					const item = getUniqueItem(err);
					return res.json(
						CreateResponse({ ...ALREADY_IN_USE, fields: item }),
					);
				} else {
					logger(err);
					return res.json(CreateResponse(EMPLOYEE_CREATE_FAILED));
				}
			});
	},
);

router.put(
	'/edit',
	async (req: ExtendedRequest<EmployeeEditParams>, res: Response) => {
		const { employeeId, name, image_url, role, password, confirmPassword } =
			req.body;

		const userId = req.session.userId;
		if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

		const error = isInt([employeeId]);
		if (error) return res.json(error);

		const err = validateInputs({ name, password, confirmPassword });
		if (err) return res.json(err);

		const employee = await employeeRepository.findOne({
			where: { id: parseInt(employeeId) },
		});

		if (!employee)
			return res.json(CreateResponse(EMPLOYEE_CANNOT_BE_FOUND));

		if (role && !isValidRole(role))
			return res.json(CreateResponse(ROLE_CANNOT_BE_FOUND));

		if (password) {
			const isSame = await argon2.verify(employee.password, password);
			if (isSame) return res.json(CreateResponse(SAME_PASSWORD));
			const hashedPassword = await argon2.hash(password);
			employee.password = hashedPassword;
		}

		employee.name = name ? name : employee.name;
		employee.image_url = image_url ? image_url : employee.image_url;
		employee.role = role ? role : employee.role;

		await employeeRepository.save(employee).catch((err) => {
			logger(err);
			return res.json(CreateResponse(EMPLOYEE_EDIT_FAILED));
		});

		return res.json(CreateResponse(EMPLOYEE_EDITED));
	},
);

router.delete('/remove', async (req: IDRequest, res: Response) => {
	const { id } = req.query;

	const userId = req.session.userId;
	if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	if (!id) return res.json(CreateResponse(EMPTY_ID));

	const err = isInt([id]);
	if (err) return res.json(err);

	const employee = await employeeRepository.findOne({
		where: { id: parseInt(id) },
		relations: ['company'],
	});

	if (!employee) return res.json(CreateResponse(EMPLOYEE_CANNOT_BE_FOUND));

	const ownership = isOwner(userId, employee.company.id);
	if (ownership !== null) return res.json(ownership);

	await employeeRepository.remove(employee).catch((error) => {
		logger(error);
		return res.json(CreateResponse(EMPLOYEE_REMOVE_FAILED));
	});

	return res.json(CreateResponse(EMPLOYEE_REMOVED));
});

export default router;
