import { CreateResponse } from '@kafeasist/responses';
import { Employee } from '../entities/Employee';
import {
	COMPANY_CANNOT_BE_FOUND,
	EMPLOYEE_CANNOT_BE_FOUND,
} from '@kafeasist/responses';
import { orm } from '../config/typeorm.config';

const employeeRepository = orm.getRepository(Employee);

export const isEmployee = async (
	employeeId: number | undefined | null,
	companyId: number | undefined | null,
) => {
	if (!employeeId) return CreateResponse(EMPLOYEE_CANNOT_BE_FOUND);
	if (!companyId) return CreateResponse(COMPANY_CANNOT_BE_FOUND);

	const employee = await employeeRepository.findOne({
		where: { id: employeeId },
		relations: ['company'],
	});
	if (!employee) return CreateResponse(EMPLOYEE_CANNOT_BE_FOUND);

	return employee.company.id === companyId;
};
