import { orm } from '../config/typeorm.config';
import { Company } from '../entities/Company';
import { CustomError } from '../types/errorStack';
import { createError } from '../utils/createError';

const companyRepository = orm.getRepository(Company);

export const isOwner = async (
	userId: number | undefined,
	companyId: number,
): Promise<CustomError | null> => {
	if (!userId) return createError('Kullanıcı bulunamadı!');

	const company = await companyRepository.findOne({
		where: { id: companyId },
		relations: ['owner'],
	});

	if (!company) return createError('Şirket bulunamadı!');
	if (!company.owner) return createError('Şirketin yöneticisi bulunamadı!');

	if (company.owner.id !== userId)
		return createError(
			'Bu işletmede değişiklik yapabilmek için sahibi olmalısınız!',
		);

	return null;
};
