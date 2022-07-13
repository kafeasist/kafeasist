import {
	COMPANY_CANNOT_BE_FOUND,
	OWNER_CANNOT_BE_FOUND,
	OWNER_ERROR,
	USER_CANNOT_BE_FOUND,
} from '../config/Responses';
import { orm } from '../config/typeorm.config';
import { Company } from '../entities/Company';
import { KafeasistResponse } from '../types/ErrorStack';
import { CreateResponse } from '../utils/CreateResponse';

const companyRepository = orm.getRepository(Company);

export const isOwner = async (
	userId: number | undefined,
	companyId: number,
): Promise<KafeasistResponse | null> => {
	if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

	const company = await companyRepository.findOne({
		where: { id: companyId },
		relations: ['owner'],
	});

	if (!company) return CreateResponse(COMPANY_CANNOT_BE_FOUND);
	if (!company.owner) return CreateResponse(OWNER_CANNOT_BE_FOUND);

	if (company.owner.id !== userId) return CreateResponse(OWNER_ERROR);

	return null;
};
