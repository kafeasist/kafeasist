import { Request, Response, Router } from 'express';
import { createError } from '../utils/createError';
import { isOwner } from '../middlewares/isOwner';
import { getSubscriptionType } from '../utils/getSubscriptionType';
import { SubscriptionLimits } from '../types/SubscriptionInfo';
import { isInt } from '../middlewares/isInt';
import { orm } from '../config/typeorm.config';
import { Table } from '../entities/Table';
import { Food } from '../entities/Food';
import { User } from '../entities/User';
import { Company } from '../entities/Company';
import { OrderItem } from '../entities/OrderItem';

const router = Router();

const tableRepository = orm.getRepository(Table);
const foodRepository = orm.getRepository(Food);
const userRepository = orm.getRepository(User);
const companyRepository = orm.getRepository(Company);

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	const err = isInt([id]);
	if (err) return res.json(err);

	const table = await tableRepository.findOne({
		where: { id: parseInt(id) },
	});

	if (!table) return res.json(createError('Masa bulunamadı'));

	return res.json(table);
});

router.post('/addFood', async (req: Request, res: Response) => {
	const { foodId, tableId, amount } = req.body;

	const err = isInt([foodId, tableId, amount]);
	if (err) return res.json(err);

	const userId = req.session.userId;
	if (!userId) return res.json(createError('Kullanıcı bulunamadı'));

	const food = await foodRepository.findOne({
		where: { id: parseInt(foodId) },
		relations: ['company'],
	});

	if (!food) return res.json(createError('Yemek bulunamadı'));

	const table = await tableRepository.findOne({
		where: { id: parseInt(tableId) },
		relations: ['company', 'items'],
	});

	if (!table) return res.json(createError('Masa bulunamadı'));

	if (food.company.id !== table.company.id)
		return res.json(
			createError('Bu yiyecek bu şirket üzerine kayıtlı değil!'),
		);

	if (!isOwner(userId, table.company.id))
		return res.json(
			createError(
				'Sahibi olmadığınız bir şirket üzerinde işlem yapamazsınız!',
			),
		);

	const orderItem = new OrderItem();
	orderItem.amount = parseFloat(amount);
	orderItem.food = food;
	orderItem.table = table;

	table.total = table.total + food.price * parseFloat(amount);
	table.items.push(orderItem);

	return await tableRepository
		.save(table)
		.then(() => {
			return res.json({
				message: 'Masaya başarıyla ' + food.name + ' eklendi!',
			});
		})
		.catch(() => {
			return res.json(
				createError(
					'Masaya yiyecek eklenirken bir hatayla karşılaşıldı!',
				),
			);
		});
});

router.get('/foods', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	const err = isInt([id]);
	if (err) return res.json(err);

	const table = await tableRepository.findOne({
		relations: ['items'],
		where: { id: parseInt(id) },
	});

	if (!table) return res.json(createError('Masa bulunamadı!'));

	return res.json(table.items);
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

	const user = await userRepository.findOne({ where: { id: userId } });
	if (!user) return res.json(createError('Kullanıcı bulunamadı!'));
	const subscription = getSubscriptionType(user);
	const limit = new SubscriptionLimits().getTable(subscription);
	const company = await companyRepository.findOne({
		where: { id: numberId },
	});
	if (!company) return res.json(createError('Şirket bulunamadı!'));
	const tables = company.tables;
	if (tables && tables.length >= limit)
		return res.json(
			createError(
				'Bu işletme için daha fazla masa oluşturamazsınız. Daha fazla oluşturmak için hesabınızı yükseltin.',
			),
		);

	const newTable = new Table();
	newTable.name = name;
	newTable.description = description;
	newTable.company = company;

	return await tableRepository
		.save(newTable)
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

	const table = await tableRepository.findOne({
		where: { id: parseInt(id) },
		relations: ['company'],
	});

	if (!table) return res.json(createError('Masa bulunamadı'));

	if (!isOwner(userId, table.company.id))
		return res.json(
			createError(
				'Sahibi olmadığınız bir şirket üzerinde işlem yapamazsınız!',
			),
		);

	return await tableRepository
		.remove(table)
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
