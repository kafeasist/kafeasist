import { Request, Response, Router } from 'express';
import { createError } from '../utils/createError';
import {
	ABSTRACT_API_KEY,
	__jwt_secret__,
	__prod__,
} from '../config/constants';
import * as argon2 from 'argon2';
import { logIn } from '../utils/logIn';
import { v4 as uuidv4 } from 'uuid';
import { setKey, getKey, removeKey } from '../utils/connectRedis';
import { socket } from '../index';
import { validateInputs } from '../middlewares/validateInputs';
import axios from 'axios';
import { orm } from '../config/typeorm.config';
import { User } from '../entities/User';

const router = Router();

const PASSWORD_RESET_PREFIX = 'pass_reset_';

const userRepository = orm.getRepository(User);

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

	const newUser = new User();
	newUser.first_name = first_name;
	newUser.last_name = last_name;
	newUser.phone = phone;
	newUser.email = email;
	newUser.password = hashedPassword;

	return await User.save(newUser)
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

	let user = await userRepository.findOne({ where: { email: emailOrPhone } });
	if (!user)
		user = await userRepository.findOne({ where: { phone: emailOrPhone } });
	if (!user) return res.json(error);

	if (!(await argon2.verify(user.password, password))) {
		const { data } = await axios.get(
			'https://ipgeolocation.abstractapi.com/v1/?api_key=' +
				ABSTRACT_API_KEY,
		);
		socket.emit('failed-login', { id: user.id, ip_data: data });
		return res.json(error);
	}

	logIn(req, user.id);

	return res.json({
		message: 'Giriş başarıyla yapıldı',
	});
});

router.post('/forgot-password', async (req: Request, res: Response) => {
	const { emailOrPhone } = req.body;

	let user = await userRepository.findOne({ where: { email: emailOrPhone } });
	if (!user)
		user = await userRepository.findOne({ where: { phone: emailOrPhone } });
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

	const user = await userRepository.findOne({
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

	user.password = hashedPassword;
	await userRepository.save(user);

	return res.json({
		message: 'Şifreniz başarıyla değiştirildi',
	});
});

export default router;
