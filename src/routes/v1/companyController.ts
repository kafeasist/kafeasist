import { Request, Response, Router } from 'express';
import { prisma } from '../../index';
import { createError } from '../../utils/createError';
import { isAuth } from '../../middlewares/isAuth';
import { validateInputs } from '../../middlewares/validateInputs';
import { getSubscriptionType } from '../../utils/getSubscriptionType';
import { SubscriptionLimits } from '../../types/SubscriptionInfo';
import { logger } from '../../utils/logger';

const router = Router();

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id)
		return res.json(createError('ID kısmı boş bırakılmamalıdır', 'id'));

	if (isNaN(parseInt(id)))
		return res.json(createError('ID sadece sayı olabilir', 'id'));

	const numberId = parseInt(id);

	const company = await prisma.company.findUnique({
		where: { id: numberId },
	});

	if (!company)
		return res.json(createError('Belirtilen şirket bulunamadı', 'id'));

	return res.json(company);
});

router.get('/tables', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id)
		return res.json(createError('ID kısmı boş bırakılmamalıdır', 'id'));

	if (isNaN(parseInt(id)))
		return res.json(createError('ID sadece sayı olabilir', 'id'));

	const numberId = parseInt(id);

	const tables = await prisma.company
		.findUnique({
			where: { id: numberId },
		})
		.tables();

	if (!tables)
		return res.json(
			createError('Belirtilen şirketin hiçbir masası bulunamadı!', 'id'),
		);

	return res.json(tables);
});

router.get('/categories', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id)
		return res.json(createError('ID kısmı boş bırakılmamalıdır', 'id'));

	if (isNaN(parseInt(id)))
		return res.json(createError('ID sadece sayı olabilir', 'id'));

	const numberId = parseInt(id);

	const categories = await prisma.company
		.findUnique({
			where: { id: numberId },
		})
		.categories();

	if (!categories)
		return res.json(
			createError(
				'Belirtilen şirketin hiçbir kategorisi bulunamadı!',
				'id',
			),
		);

	return res.json(categories);
});

router.post('/create', isAuth, async (req: Request, res: Response) => {
	const { name, address, phone, image_url, description } = req.body;

	const err = validateInputs({ name, address, phone });
	if (err) return res.json(err);

	const id = parseInt(String(req.session.userId));
	const user = await prisma.user.findUnique({ where: { id } });
	const userCompanies = await prisma.user
		.findUnique({ where: { id } })
		.companies();

	if (!user) return res.json(createError('Kullanıcı bulunamadı'));

	const subscription = getSubscriptionType(user);
	const companyLimit = new SubscriptionLimits().getCompany;

	if (userCompanies.length >= companyLimit(subscription))
		return res.json(
			createError(
				'Şirket oluşturma hakkınızı doldurdunuz. Daha fazla hak için lütfen hesabınızı yükseltin.',
			),
		);

	const newCompany = await prisma.company
		.create({
			data: {
				name,
				address,
				phone,
				image_url,
				description,
				owner: { connect: { id } },
			},
		})
		.catch((err) => {
			if (err.code === 'P2002')
				res.json(
					createError(
						'Bu alanlardaki değerler ile bir şirket oluşturulmuş',
						err.meta.target,
					),
				);
			return;
		});

	return res.json(newCompany);
});

router.delete('/remove', async (req: Request, res: Response) => {
	const { id } = req.body;

	if (!id)
		return res.json(createError('ID kısmı boş bırakılmamalıdır', 'id'));

	if (isNaN(parseInt(id)))
		return res.json(createError('ID sadece sayı olabilir', 'id'));

	const numberId = parseInt(id);

	const company = await prisma.company.findUnique({
		where: { id: numberId },
	});

	if (!company)
		return res.json(createError('Belirtilen şirket bulunamadı', 'id'));

	return prisma.company
		.delete({ where: { id: numberId } })
		.then(() => {
			return res.json({
				message: 'Şirket başarıyla silindi',
			});
		})
		.catch((err) => {
			logger(err.message);
			return res.json(
				createError('Şirket silinirken bir hata ile karşılaşıldı'),
			);
		});
});

export default router;
