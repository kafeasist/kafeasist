import { Request, Response, Router } from 'express';
import { isAuth } from '../../middlewares/isAuth';
import { prisma } from '../../index';
import { createError } from '../../utils/createError';
import { logger } from '../../utils/logger';

const router = Router();

router.get('/me', isAuth, async (req: Request, res: Response) => {
	const id = req.session.userId;

	const user = await prisma.user.findUnique({ where: { id } });

	if (!user) return res.json(createError('Kullanıcı bulunamadı!'));

	const returnedFields = {
		id: user.id,
		firstName: user.first_name,
		lastName: user.last_name,
		email: user.email,
		phone: user.phone,
	};

	return returnedFields;
});

router.get(
	'/checkauth',
	isAuth,
	(_: Request, res: Response): Response<boolean, Record<string, boolean>> => {
		return res.send(true);
	},
);

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id)
		return res.json(createError('ID kısmı boş bırakılmamalıdır', 'id'));

	if (isNaN(parseInt(id)))
		return res.json(createError('ID sadece sayı olabilir', 'id'));

	const numberId = parseInt(id);

	const user = await prisma.user.findUnique({ where: { id: numberId } });

	if (!user)
		return res.json(createError('Belirtilen kullanıcı bulunamadı', 'id'));

	return res.json(user);
});

router.get('/companies', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id)
		return res.json(createError('ID kısmı boş bırakılmamalıdır', 'id'));

	const companies = await prisma.user
		.findUnique({ where: { id: parseInt(id) } })
		.companies();

	if (!companies)
		return res.json(
			createError('Belirtilen kullanıcının şirketi bulunamadı', 'id'),
		);

	return res.json(companies);
});

router.delete('/remove', async (req: Request, res: Response) => {
	const { id } = req.body;

	if (!id)
		return res.json(createError('ID kısmı boş bırakılmamalıdır', 'id'));

	if (isNaN(parseInt(id)))
		return res.json(createError('ID sadece sayı olabilir', 'id'));

	const numberId = parseInt(id);

	const user = await prisma.user.findUnique({ where: { id: numberId } });

	if (!user)
		return res.json(createError('Belirtilen kullanıcı bulunamadı', 'id'));

	return prisma.user
		.delete({ where: { id: numberId } })
		.then(() => {
			return res.json({
				message: 'Kullanıcı başarıyla silindi!',
			});
		})
		.catch((err) => {
			logger(err.message);
			return res.json(
				createError('Kullanıcı silinirken bir hata ile karşılaşıldı'),
			);
		});
});

export default router;
