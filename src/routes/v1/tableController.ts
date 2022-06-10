import { Request, Response, Router } from 'express';
import { createError } from '../../utils/createError';
import { prisma } from '../../index';
import { isOwner } from '../../middlewares/isOwner';
import { getSubscriptionType } from '../../utils/getSubscriptionType';
import { SubscriptionLimits } from '../../types/SubscriptionInfo';

const router = Router();

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

export default router;
