import { Request, Response, Router } from 'express';
import { ProtectedReturn } from '../../types/ProtectedReturn';
import User from '../../models/User';
import { createError } from '../../utils/createError';
import { logger } from '../../utils/logger';

const router = Router();

// get user with user_id
router.get('/get', async (req: Request, res: Response) => {
	const issuer = req.issuer;
	const { id } = req.body;

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

	await User.findOne({ user_id: id })
		.then((data) => {
			if (!data)
				response = {
					...response,
					error: createError(
						new Error('Belirtilen kullanıcı bulunamadı'),
						'id',
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

	return await User.findById(id).then((user) => {
		if (!user)
			return res.json({
				...response,
				errors: createError(
					new Error('Belirtilen kullanıcı bulunamadı'),
					'id',
				),
			});

		return User.deleteOne({ _id: id })
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
	});
});

export default router;
