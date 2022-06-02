import { Request, Response, Router } from 'express';
import { ProtectedReturn } from '../../types/ProtectedReturn';
import {
	emailValidation,
	nameValidation,
	passwordValidation,
	phoneValidation,
} from '../../utils/validation';
import User, { UserInterface } from '../../models/User';
import { createError } from '../../utils/createError';
import jwt from 'jsonwebtoken';
import { __jwt_secret__, __prod__ } from '../../config/constants';
import * as argon2 from 'argon2';
import { logIn } from '../../utils/logIn';
import { MailTypes } from '../../types/MailTypes';
import { sendMail } from '../../utils/sendMail';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
	const inputFields: UserInterface = req.body;
	const { name, last_name, phone, email, address, password } = inputFields;
	const { passwordAgain } = req.body;

	const issuer = req.issuer;

	let response: ProtectedReturn = {
		issue_date: new Date(),
		issuer,
	};

	if (!nameValidation(name) || !nameValidation(last_name))
		return res.json({
			...response,
			errors: createError(
				new Error('İsim veya soy isim belirtilen kritelere uymuyor'),
				['name', 'last_name'],
			),
		});

	if (!phoneValidation(phone))
		return res.json({
			...response,
			errors: createError(
				new Error('Lütfen geçerli bir telefon numarası giriniz'),
				'phone',
			),
		});

	if (!emailValidation(email))
		return res.json({
			...response,
			errors: createError(
				new Error('Lütfen geçerli bir e-posta adresi giriniz'),
				'email',
			),
		});

	if (address.length <= 0)
		return res.json({
			...response,
			errors: createError(
				new Error('Adres kısmı boş bırakılamaz'),
				'address',
			),
		});

	if (!passwordValidation(password))
		return res.json({
			...response,
			errors: createError(
				new Error(
					'Şifre 8-24 karakter arasında en az 1 büyük en az 1 küçük harf ve sayı içermelidir',
				),
				['password', 'passwordAgain'],
			),
		});

	if (password !== passwordAgain)
		return res.json({
			...response,
			errors: createError(new Error('Şifreler birbiriyle uyuşmuyor'), [
				'password',
				'passwordAgain',
			]),
		});

	const hashedPassword = await argon2.hash(password);

	return await User.create({ ...inputFields, password: hashedPassword })
		.then((newUser) => {
			const token = jwt.sign({ id: newUser._id }, __jwt_secret__);

			logIn(req, newUser._id.toString());

			return res.json({
				...response,
				data: { message: 'Hesabınız oluşturuldu', newUser, token },
			});
		})
		.catch((err) => {
			if (err.message.includes('duplicate key error')) {
				const field = Object.keys(err.keyValue);
				return res.json({
					...response,
					errors: createError(
						new Error(
							'Bu alandaki değerler ile daha önce bir hesap oluşturulmuş',
						),
						field,
					),
				});
			}
			return;
		});
});

router.post('/login', async (req, res) => {
	const { emailOrPhone, password } = req.body;

	const issuer = req.issuer;

	let response: ProtectedReturn = {
		issue_date: new Date(),
		issuer,
	};

	const error = createError(
		new Error('Kullanıcı adı veya şifre bulunamadı'),
		['emailOrPhone', 'password'],
	);

	let user = await User.findOne({ email: emailOrPhone });
	if (!user) user = await User.findOne({ phone: emailOrPhone });
	if (!user)
		return res.json({
			...response,
			errors: error,
		});

	if (!(await argon2.verify(user.password, password)))
		return res.json({
			...response,
			errors: error,
		});

	const token = jwt.sign({ id: user._id }, __jwt_secret__);

	logIn(req, user._id.toString());

	return res.json({
		...response,
		data: { message: 'Giriş başarıyla yapıldı', token },
	});
});

router.post('/forgot-password', async (req: Request, res: Response) => {
	const { emailOrPhone } = req.body;

	const issuer = req.issuer;

	let response: ProtectedReturn = {
		issue_date: new Date(),
		issuer,
	};

	let user = await User.findOne({ email: emailOrPhone });
	if (!user) user = await User.findOne({ phone: emailOrPhone });
	if (user) {
		const userEmail = user.email;
		sendMail(userEmail, MailTypes.FORGOT_PASSWORD);
	}

	return res.json({
		...response,
		data: {
			message:
				'Böyle bir kullanıcı varsa e-posta adresine sıfırlama bağlantısı gönderildi',
		},
	});
});

export default router;
