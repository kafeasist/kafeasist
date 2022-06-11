import { Router, Request, Response } from 'express';
import {
	validateInputs,
	InputsInterface,
} from '../../middlewares/validateInputs';
import { SubscriptionLimits } from '../../types/SubscriptionInfo';
import { getSubscriptionType } from '../../utils/getSubscriptionType';
import { prisma } from '../../index';
import { createError } from '../../utils/createError';
import { isOwner } from '../../middlewares/isOwner';

const router = Router();

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id) return res.json(createError('ID kısmı boş bırakılamaz'));

	const numberId = parseInt(id);

	if (isNaN(numberId))
		return res.json(createError('Id sadece sayı olabilir'));

	const category = await prisma.category.findUnique({
		where: { id: numberId },
	});

	if (!category) return res.json(createError('Kategori bulunamadı'));

	return res.json(category);
});

router.post('/create', async (req: Request, res: Response) => {
	const { name, description, companyId } = req.body;

	if (!companyId)
		return res.json(createError('Şirket ID kısmı boş bırakılamaz'));

	const numberId = parseInt(companyId);

	if (isNaN(numberId))
		return res.json(createError('Şirket ID kısmı sadece sayı olabilir'));

	const company = await prisma.company.findUnique({
		where: { id: numberId },
	});

	if (!company) return res.json(createError('Şirket bulunamadı'));

	const err = validateInputs({ name } as InputsInterface);
	if (err) return res.json(err);

	const userId = req.session.userId;
	if (!userId) return res.json(createError('Kullanıcı bulunamadı'));

	if (!isOwner(userId, numberId))
		return res.json(
			createError(
				'Sadece sahibi olduğunuz şirketlerin kategorisini düzenleyebilirsniiz.',
			),
		);

	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) return res.json(createError('Kullanıcı bulunamadı'));
	const subscription = getSubscriptionType(user);
	const limit = new SubscriptionLimits().getCategory(subscription);

	const categories = await prisma.company
		.findUnique({ where: { id: numberId } })
		.categories();

	if (!categories)
		return res.json(createError('Şirkette kategori bulunamadı'));

	if (categories.length >= limit)
		return res.json(
			createError(
				'Daha fazla kategori oluşturamazsınız. Oluşturmak için hesabınızı yükseltin.',
			),
		);

	return await prisma.category
		.create({
			data: {
				name,
				description,
				company: { connect: { id: numberId } },
			},
		})
		.then((newCategory) => {
			return res.json({
				message: 'Kategori başarıyla oluşturuldu!',
				newCategory,
			});
		})
		.catch((error) => {
			if (error.code === 'P2002')
				res.json(
					createError(
						'Bu alanlardaki değerler ile bir kategori oluşturulmuş',
						error.meta.target,
					),
				);
			return;
		});
});

router.delete('/remove', async (req: Request, res: Response) => {
	const { id } = req.body;

	if (!id) return res.json(createError('ID kısmı boş bırakılamaz'));

	const numberId = parseInt(id);

	if (isNaN(numberId))
		return res.json(createError('Id sadece sayı olabilir'));

	const category = await prisma.category.findUnique({
		where: { id: numberId },
	});

	if (!category)
		return res.json(createError('Belirtilen kategori bulunamadı', 'id'));

	const userId = req.session.userId;
	if (!userId) return res.json(createError('Kullanıcı bulunamadı'));

	if (!isOwner(userId, numberId))
		return res.json(
			createError(
				'Sadece sahibi olduğunuz şirketlerin kategorisini düzenleyebilirsniiz.',
			),
		);

	return await prisma.category
		.delete({ where: { id: category.id } })
		.then(() => {
			return res.json({ message: 'Kategori başarıyla silindi!' });
		})
		.catch(() => {
			return res.json(
				createError('Kategori silinirken bir hatayla karşılaşıldı.'),
			);
		});
});

export default router;
