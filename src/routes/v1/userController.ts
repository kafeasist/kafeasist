import { Request, Response, Router } from 'express';
import { ProtectedReturn } from '../../types/ProtectedReturn';
import User from '../../models/User';
import { createError } from '../../utils/createError';
import { nameValidation } from '../../utils/validation';
import { CustomError } from 'src/types/errorStack';
import { logger } from '../../utils/logger';

const router = Router();

// get user with user_id
router.get('/:id', async (req: Request, res: Response) => {
	const issuer = req.issuer;

	let response: ProtectedReturn = {
		issue_date: new Date(),
		issuer,
	};

	await User.findOne({ user_id: req.params.id })
		.then((data) => {
			if (!data)
				response = {
					...response,
					error: createError(
						new Error('Specified user cannot be found'),
					),
				};
			else
				response = {
					...response,
					data,
				};
		})
		.catch((err) => {
			response = {
				...response,
				error: createError(new Error(err.message)),
			};
		});

	return res.json(response);
});

// create user
router.post('/create', async (req: Request, res: Response) => {
	const { name } = req.body;

	const issuer = req.issuer;

	let response: ProtectedReturn = {
		issue_date: new Date(),
		issuer,
	};
	let errors: CustomError[] = [];

	// input validation
	if (!nameValidation(name))
		errors.push(createError(new Error('İsim kriterlere uymuyor'), 'name'));

	if (errors.length > 0) return res.json({ ...response, errors });

	return await User.create({ name })
		.then((newUser) => {
			res.json({
				...response,
				data: { message: 'New user created!', user: newUser },
			});
		})
		.catch((err) => {
			logger(err.message);
			res.json({
				...response,
				errors: createError(
					new Error('Kullanıcı oluşturulurken hata ile karşılaşıldı'),
				),
			});
		});
});

// remove user
router.delete('/remove', async (req: Request, res: Response) => {
	const { id } = req.body;

	const issuer = req.issuer;

	let response: ProtectedReturn = {
		issue_date: new Date(),
		issuer,
	};

	if (!id)
		return res.json({
			...response,
			errors: createError(
				new Error('ID kısmı boş bırakılmamalıdır'),
				'id',
			),
		});

	return await User.findById(id)
		.then((user) => {
			User.deleteOne({ _id: id })
				.then(() => {
					return res.json({
						...response,
						data: {
							message: 'Successfully removed user from database',
							user,
						},
					});
				})
				.catch((err) => {
					logger(err.message);
					return res.json({
						...response,
						errors: createError(
							new Error(
								'Kullanıcı silinirken bir hata ile karşılaşıldı',
							),
						),
					});
				});
		})
		.catch(() => {
			return res.json({
				...response,
				errors: createError(
					new Error('Belirtilen kullanıcı bulunamadı'),
					'id',
				),
			});
		});
});

// edit user
router.post('/edit');

export default router;
