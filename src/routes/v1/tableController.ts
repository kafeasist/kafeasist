import { Request, Response, Router } from 'express';
import { createError } from '../../utils/createError';
import { prisma } from '../../index';
import { isOwner } from '../../middlewares/isOwner';
import { getSubscriptionType } from '../../utils/getSubscriptionType';
import { SubscriptionLimits } from '../../types/SubscriptionInfo';
import { isInt } from '../../middlewares/isInt';

const router = Router();

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	const err = isInt([id]);
	if (err) return res.json(err);

	const table = await prisma.table.findUnique({
		where: { id: parseInt(id) },
	});

	if (!table) return res.json(createError('Masa bulunamadı'));

	return res.json(table);
});

router.post('/addFood', async (req: Request, res: Response) => {
	const { foodId, tableId } = req.body;

	const userId = req.session.userId;
	if (!userId) return res.json(createError('Kullanıcı bulunamadı'));

	const err = isInt([foodId, tableId]);
	if (err) return res.json(err);

	const food = await prisma.food.findUnique({
		where: { id: parseInt(foodId) },
	});
	if (!food) return res.json(createError('Yiyecek bulunamadı'));

	const table = await prisma.table.findUnique({
		where: { id: parseInt(tableId) },
	});
	if (!table) return res.json(createError('Masa bulunamadı'));

	if (food.company_id !== table.company_id)
		return res.json(createError('Yiyecek ve masa aynı şirkete ait değil.'));

	if (!isOwner(userId, food.company_id))
		return res.json(
			createError(
				'Sahibi olmadığınız bir şirket üzerinde işlem yapamazsınız!',
			),
		);

	return await prisma.table
		.update({
			where: { id: parseInt(tableId) },
			data: {
				foods: { connect: { id: parseInt(foodId) } },
			},
		})
		.then(() => {
			return res.json({ message: 'Yiyecek masaya eklendi!' });
		})
		.catch(() => {
			return res.json(
				createError(
					'Masaya yiyecek eklenirken bir hata ile karşılaşıldı!',
				),
			);
		});
});

router.delete('/removeFood', async (req: Request, res: Response) => {
	const { foodId, tableId } = req.body;

	const userId = req.session.userId;
	if (!userId) return res.json(createError('Kullanıcı bulunamadı'));

	const err = isInt([foodId, tableId]);
	if (err) return res.json(err);

	const food = await prisma.food.findUnique({
		where: { id: parseInt(foodId) },
	});
	if (!food) return res.json(createError('Yiyecek bulunamadı'));

	const table = await prisma.table.findUnique({
		where: { id: parseInt(tableId) },
	});
	if (!table) return res.json(createError('Masa bulunamadı'));

	if (food.company_id !== table.company_id)
		return res.json(createError('Yiyecek ve masa aynı şirkete ait değil.'));

	if (!isOwner(userId, food.company_id))
		return res.json(
			createError(
				'Sahibi olmadığınız bir şirket üzerinde işlem yapamazsınız!',
			),
		);

	const foods = await prisma.table
		.findUnique({
			where: { id: parseInt(tableId) },
		})
		.foods();

	if (!foods.includes(food))
		return res.json(createError('Bu yiyecek zaten bu masada değil!'));

	return await prisma.table
		.update({
			where: { id: parseInt(tableId) },
			data: {
				foods: { disconnect: { id: parseInt(foodId) } },
			},
		})
		.then(() => {
			return res.json({ message: 'Yiyecek masadan çıkarıldı!' });
		})
		.catch(() => {
			return res.json(
				createError(
					'Masadan yiyecek çıkarılırken bir hata ile karşılaşıldı!',
				),
			);
		});
});

router.get('/foods', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	const err = isInt([id]);
	if (err) return res.json(err);

	const foods = await prisma.table
		.findUnique({
			where: { id: parseInt(id) },
		})
		.foods();

	if (!foods) return res.json(createError('Masa bulunamadı'));

	return res.json(foods);
});

router.post('/create', async (req: Request, res: Response) => {
	const { companyId, name, description } = req.body;
	const userId = req.session.userId;

	if (!companyId)
		return res.json(createError('ID kısmı boş bırakılamaz', 'id'));

	if (isNaN(parseInt(companyId)))
		return res.json(createError('ID sadece sayı olabilir', 'id'));

	const numberId = parseInt(companyId);

	const err = await isOwner(userId, numberId);

	if (err) return res.json(err);

	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) return res.json(createError('Kullanıcı bulunamadı!'));
	const subscription = getSubscriptionType(user);
	const limit = new SubscriptionLimits().getTable(subscription);
	const tables = await prisma.company
		.findUnique({ where: { id: numberId } })
		.tables();
	if (!tables) return res.json(createError('Belirtilen şirket bulunamadı!'));
	if (tables.length >= limit)
		return res.json(
			createError(
				'Bu işletme için daha fazla masa oluşturamazsınız. Daha fazla oluşturmak için hesabınızı yükseltin.',
			),
		);

	return await prisma.table
		.create({
			data: {
				name,
				description,
				company: { connect: { id: numberId } },
			},
		})
		.then((table) => {
			return res.json({
				message: 'Başarıyla masa oluşturuldu!',
				table,
			});
		})
		.catch((e) => {
			if (e.code === 'P2002')
				return res.json(
					createError(
						'Bu alanlardaki değerler ile bir hesap oluşturulmuş',
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

	const table = await prisma.table.findUnique({
		where: { id: parseInt(id) },
	});

	if (!table) return res.json(createError('Masa bulunamadı'));

	if (!isOwner(userId, table.company_id))
		return res.json(
			createError(
				'Sahibi olmadığınız bir şirket üzerinde işlem yapamazsınız!',
			),
		);

	return await prisma.table
		.delete({ where: { id: parseInt(id) } })
		.then((newTable) => {
			return res.json({
				message: 'Masa başarıyla silindi!',
				table: newTable,
			});
		})
		.catch(() => {
			return res.json(
				createError('Masa silinirken bir hata ile karşılaşıldı!'),
			);
		});
});

export default router;
