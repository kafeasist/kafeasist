import { Request, Response, Router } from 'express';
import { isInt } from '../middlewares/isInt';
import { createError } from '../utils/createError';
import { validateInputs } from '../middlewares/validateInputs';
import { isOwner } from '../middlewares/isOwner';
import { orm } from '../config/typeorm.config';
import { Food } from '../entities/Food';
import { Category } from '../entities/Category';
import { Company } from '../entities/Company';

const router = Router();

const foodRepository = orm.getRepository(Food);
const categoryRepository = orm.getRepository(Category);
const companyRepository = orm.getRepository(Company);

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	const err = isInt([id]);
	if (err) return res.json(err);

	const food = await foodRepository.findOne({ where: { id: parseInt(id) } });

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

	const category = await categoryRepository.findOne({
		where: { id: parseInt(categoryId) },
	});

	if (!category)
		return res.json(createError('Kategori bulunamadı', 'categoryId'));

	const company = await companyRepository.findOne({
		where: { id: parseInt(companyId) },
		relations: ['owner'],
	});

	if (!company)
		return res.json(createError('Şirket bulunamadı', 'companyId'));

	if (priceLast.length < 2) priceLast = '0' + priceLast;
	const price =
		parseInt(priceFirst) + parseInt(priceLast[0] + priceLast[1]) / 100;

	if (company.owner.id !== userId)
		return res.json(
			createError(
				'Sahibi olmadığınız bir şirket üzerinde işlem yapamazsınız!',
			),
		);

	const newFood = new Food();
	newFood.name = name;
	newFood.price = price;
	newFood.category = category;
	newFood.company = company;
	newFood.daily = daily ? daily : false;
	newFood.description = description;

	return await foodRepository
		.save(newFood)
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

	const food = await foodRepository.findOne({ where: { id: parseInt(id) } });
	if (!food) return res.json(createError('Yiyecek bulunamadı!'));

	if (!isOwner(userId, food.company.id))
		return res.json(
			createError(
				'Sahibi olmadığınız bir şirket üzerinde işlem yapamazsınız!',
			),
		);

	return await foodRepository
		.remove(food)
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
