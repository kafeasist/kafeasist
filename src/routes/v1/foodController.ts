import { Request, Response, Router } from 'express';
import { isInt } from '../../middlewares/isInt';
import { prisma } from '../../index';
import { createError } from '../../utils/createError';
import { validateInputs } from '../../middlewares/validateInputs';
import { isOwner } from '../../middlewares/isOwner';

const router = Router();

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	const err = isInt([id]);
	if (err) return res.json(err);

	const food = await prisma.food.findUnique({ where: { id: parseInt(id) } });

	if (!food) return res.json(createError('Yiyecek bulunamadı!'));

	return res.json(food);
});

router.post('/create', async (req: Request, res: Response) => {
	let {
		name,
		priceFirst,
		priceLast,
		daily,
		description,
		categoryId,
		companyId,
	} = req.body;

	const userId = req.session.userId;
	if (!userId) return res.json(createError('Kullanıcı bulunamadı'));

	const err = isInt([priceFirst, priceLast, categoryId, companyId]);
	if (err) return res.json(err);

	const errors = validateInputs({ name });
	if (errors) return res.json(errors);

	const category = await prisma.category.findUnique({
		where: { id: parseInt(categoryId) },
	});

	if (!category)
		return res.json(createError('Kategori bulunamadı', 'categoryId'));

	const company = await prisma.company.findUnique({
		where: { id: parseInt(companyId) },
	});

	if (!company)
		return res.json(createError('Şirket bulunamadı', 'companyId'));

	if (priceLast.length < 2) priceLast = '0' + priceLast;
	const price =
		parseInt(priceFirst) + parseInt(priceLast[0] + priceLast[1]) / 100;

	if (company.owner_id !== userId)
		return res.json(
			createError(
				'Sahibi olmadığınız bir şirket üzerinde işlem yapamazsınız!',
			),
		);

	return await prisma.food
		.create({
			data: {
				name,
				price,
				category: { connect: { id: parseInt(categoryId) } },
				company: { connect: { id: parseInt(companyId) } },
				daily: daily ? daily : false,
				description,
			},
		})
		.then((newFood) => {
			return res.json({
				message: 'Yeni yiyecek başarıyla oluşturuldu.',
				food: newFood,
			});
		})
		.catch((e) => {
			if (e.code === 'P2002')
				res.json(
					createError(
						'Bu alanlardaki değerler ile bir şirket oluşturulmuş',
						e.meta.target,
					),
				);
			return;
		});
});

router.delete('/remove', async (req: Request, res: Response) => {
	const { id } = req.body;

	const userId = req.session.userId;
	if (!userId) return res.json(createError('Kullanıcı bulunamadı'));

	const err = isInt([id]);
	if (err) return res.json(err);

	const food = await prisma.food.findUnique({ where: { id: parseInt(id) } });
	if (!food) return res.json(createError('Yiyecek bulunamadı!'));

	if (!isOwner(userId, food.company_id))
		return res.json(
			createError(
				'Sahibi olmadığınız bir şirket üzerinde işlem yapamazsınız!',
			),
		);

	return await prisma.food
		.delete({ where: { id: parseInt(id) } })
		.then(() => {
			return res.json({ message: 'Yiyecek başarıyla silindi!' });
		})
		.catch(() => {
			return res.json(
				createError('Yiyecek silinirken bir hata ile karşılaşıldı!'),
			);
		});
});

export default router;
