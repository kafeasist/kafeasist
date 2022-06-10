import { Request, Response, Router } from 'express';
import { createError } from '../../utils/createError';
import { __jwt_secret__, __prod__ } from '../../config/constants';
import * as argon2 from 'argon2';
import { logIn } from '../../utils/logIn';
import { v4 as uuidv4 } from 'uuid';
import { setKey, getKey, removeKey } from '../../utils/connectRedis';
import { prisma } from '../../index';
import { validateInputs } from '../../middlewares/validateInputs';

const router = Router();

const PASSWORD_RESET_PREFIX = 'pass_reset_';

router.post('/register', async (req: Request, res: Response) => {
	const { first_name, last_name, phone, email, password, passwordAgain } =
		req.body;

	const err = validateInputs({
		name: first_name,
		last_name,
		phone,
		email,
		password,
		confirmPassword: passwordAgain,
	});

	if (err) return res.json(err);

	const hashedPassword = await argon2.hash(password);

	return await prisma.user
		.create({
			data: {
				first_name,
				last_name,
				phone,
				email,
				password: hashedPassword,
			},
		})
		.then((newUser) => {
			logIn(req, newUser.id);

			return res.json({
				message: 'Hesabınız oluşturuldu',
			});
		})
		.catch((err) => {
			if (err.code === 'P2002')
				res.json(
					createError(
						'Bu alanlardaki değerler ile bir hesap oluşturulmuş',
						err.meta.target,
					),
				);
			return;
		});
});

router.post('/login', async (req, res) => {
	const { emailOrPhone, password } = req.body;

	const error = createError('Kullanıcı adı veya şifre bulunamadı', [
		'emailOrPhone',
		'password',
	]);

	let user = await prisma.user.findUnique({ where: { email: emailOrPhone } });
	if (!user)
		user = await prisma.user.findUnique({ where: { phone: emailOrPhone } });
	if (!user) return res.json(error);

	if (!(await argon2.verify(user.password, password))) return res.json(error);

	logIn(req, user.id);

	return res.json({
		message: 'Giriş başarıyla yapıldı',
	});
});

router.post('/forgot-password', async (req: Request, res: Response) => {
	const { emailOrPhone } = req.body;

	let user = await prisma.user.findUnique({ where: { email: emailOrPhone } });
	if (!user)
		user = await prisma.user.findUnique({ where: { phone: emailOrPhone } });
	if (user) {
		const token = uuidv4();
		setKey(PASSWORD_RESET_PREFIX + token, String(user.id));
		// sendMail(userEmail, MailTypes.FORGOT_PASSWORD, { token });
	}

	return res.json({
		message:
			'Böyle bir kullanıcı varsa e-posta adresine sıfırlama bağlantısı gönderildi',
	});
});

router.post('/reset-password', async (req: Request, res: Response) => {
	const { newPassword, confirmNewPassword } = req.body;
	const { token } = req.query;

	const key = PASSWORD_RESET_PREFIX + token;
	const userId = await getKey(key);

	if (!userId)
		return res.json(
			createError('Kullandığınız bağlantının süresi geçmiş olabilir'),
		);

	const user = await prisma.user.findUnique({
		where: { id: parseInt(userId) },
	});

	if (!user)
		return res.json(
			createError(
				'Şifresini değiştirmek istediğiniz kullanıcı bulunamadı',
			),
		);

	const err = validateInputs({
		password: newPassword,
		confirmPassword: confirmNewPassword,
	});

	if (err) res.json(err);

	if (await argon2.verify(user.password, newPassword))
		return res.json(
			createError('Oluşturacağınız şifre öncekiyle aynı olamaz', [
				'newPassword',
				'confirmNewPassword',
			]),
		);

	removeKey(key);
	const hashedPassword = await argon2.hash(newPassword);

	await prisma.user.update({
		where: { id: user.id },
		data: { password: hashedPassword },
	});

	return res.json({
		message: 'Şifreniz başarıyla değiştirildi',
	});
});

export default router;
