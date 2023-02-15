import { Request, Response, Router } from 'express';
import { CreateResponse } from '../utils/CreateResponse';
import { __jwt_secret__, __prod__, __testing__ } from '../config/constants';
import * as argon2 from 'argon2';
import { logIn, logOut } from '../utils/logUser';
import { v4 as uuidv4 } from 'uuid';
import { setKey, getKey, removeKey } from '../services/connectRedis';
import { validateInputs } from '../utils/validateInputs';
import { orm } from '../config/typeorm.config';
import { User } from '../entities/User';
import {
	ACCOUNT_CREATED,
	ALREADY_IN_USE,
	FAILED_FORGOT_PASSWORD,
	MFA_FAILED,
	MFA_INCORRECT,
	PASSWORD_CHANGED,
	SAME_PASSWORD,
	SUCCESSFUL_FORGOT_PASSWORD,
	SUCCESSFUL_LOGIN,
	SUCCESSFUL_LOGOUT,
	USERNAME_OR_PASSWORD_NOT_FOUND,
	USER_CANNOT_BE_FOUND,
} from '../config/Responses';
import { isAuth } from '../middlewares/isAuth';
import { isNotAuth } from '../middlewares/isNotAuth';
import { totp } from 'speakeasy';
import { ExtendedRequest } from '../types/ExtendedRequest';
import { getUniqueItem } from '../utils/getUniqueItem';

const router = Router();

const PASSWORD_RESET_PREFIX = 'pass_reset_';

const userRepository = orm.getRepository(User);

export interface RegisterParams {
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	password: string;
	passwordAgain: string;
}

export interface LoginParams {
	emailOrPhone: string;
	remember: boolean;
	password: string;
	mfa?: string;
}

export interface ForgotPasswordParams {
	emailOrPhone: string;
}

export interface ResetPasswordParams {
	password: string;
	confirmPassword: string;
}

router.post(
	'/register',
	isNotAuth,
	async (req: ExtendedRequest<RegisterParams>, res: Response) => {
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

				return res.json(CreateResponse(ACCOUNT_CREATED));
			})
			.catch((err) => {
				if (err.code === '23505') {
					const key = getUniqueItem(err?.detail);

					res.json(
						CreateResponse({ ...ALREADY_IN_USE, fields: key }),
					);
				}
			});
	},
);

router.post(
	'/login',
	isNotAuth,
	async (req: ExtendedRequest<LoginParams>, res: Response) => {
		const { emailOrPhone, password, mfa } = req.body;

		const error = CreateResponse(USERNAME_OR_PASSWORD_NOT_FOUND);

		let user = await userRepository.findOne({
			where: { email: emailOrPhone },
		});

		if (!user) {
			user = await userRepository.findOne({
				where: { phone: emailOrPhone },
			});
		}
		if (!user) {
			return res.json(error);
		}

		if (!(await argon2.verify(user.password, password))) {
			// const { data } = await axios.get(
			// 	'https://ipgeolocation.abstractapi.com/v1/?api_key=' +
			// 		ABSTRACT_API_KEY,
			// );
			// socket.emit('server:failed_login', data);
			return res.json(error);
		}

		if (user.mfa) {
			if (!mfa) return res.json(CreateResponse(MFA_FAILED));

			const err = validateInputs({ mfa });
			if (err) return res.json(err);

			const result = totp.verify({
				secret: user.mfa,
				encoding: 'base32',
				token: mfa,
			});

			if (!result) return res.json(CreateResponse(MFA_INCORRECT));
		}

		logIn(req, user.id);

		return res.json(
			CreateResponse(SUCCESSFUL_LOGIN, {
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				phone: user.phone,
				subs_type: user.subs_type,
				verified: user.verified,
			}),
		);
	},
);

router.post('/logout', isAuth, async (req: Request, res: Response) => {
	logOut(req, res);

	return res.json(CreateResponse(SUCCESSFUL_LOGOUT));
});

router.post(
	'/forgot-password',
	isNotAuth,
	async (req: ExtendedRequest<ForgotPasswordParams>, res: Response) => {
		const { emailOrPhone } = req.body;

		let user = await userRepository.findOne({
			where: { email: emailOrPhone },
		});
		if (!user)
			user = await userRepository.findOne({
				where: { phone: emailOrPhone },
			});
		if (user) {
			const token = uuidv4();
			setKey(PASSWORD_RESET_PREFIX + token, String(user.id));
			// sendMail(userEmail, MailTypes.FORGOT_PASSWORD, { token });
			if (__testing__)
				return res.json(
					CreateResponse(SUCCESSFUL_FORGOT_PASSWORD, token),
				);
		}

		return res.json(CreateResponse(SUCCESSFUL_FORGOT_PASSWORD));
	},
);

router.post(
	'/reset-password',
	isNotAuth,
	async (
		req: ExtendedRequest<ResetPasswordParams, { token: string }>,
		res: Response,
	) => {
		const { password, confirmPassword } = req.body;
		const { token } = req.query;

		const key = PASSWORD_RESET_PREFIX + token;
		const userId = await getKey(key);

		if (!userId) return res.json(CreateResponse(FAILED_FORGOT_PASSWORD));

		const user = await userRepository.findOne({
			where: { id: parseInt(userId) },
		});

		if (!user) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

		const err = validateInputs({
			password,
			confirmPassword,
		});

		if (err) res.json(err);

		if (await argon2.verify(user.password, password))
			return res.json(CreateResponse(SAME_PASSWORD));

		removeKey(key);
		const hashedPassword = await argon2.hash(password);

		user.password = hashedPassword;
		await userRepository.save(user);

		return res.json(CreateResponse(PASSWORD_CHANGED));
	},
);

export default router;
