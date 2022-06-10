import { CustomError } from '../types/errorStack';
import { createError } from '../utils/createError';
import { prisma } from '../index';

export const isOwner = async (
	userId: number | undefined,
	companyId: number,
): Promise<CustomError | null> => {
	if (!userId) return createError('Kullanıcı bulunamadı!');

	const company = await prisma.company.findUnique({
		where: { id: companyId },
	});

	if (!company) return createError('Şirket bulunamadı!');

	if (company.owner_id !== userId)
		return createError(
			'Bu işletmede değişiklik yapabilmek için sahibi olmalısınız!',
		);

	return null;
};
