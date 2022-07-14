import { Request, Response, Router } from 'express';
import { CreateResponse } from '../utils/CreateResponse';
import {
	ABSTRACT_API_KEY,
	__jwt_secret__,
	__prod__,
} from '../config/constants';
import * as argon2 from 'argon2';
import { logIn, logOut } from '../utils/logUser';
import { v4 as uuidv4 } from 'uuid';
import { setKey, getKey, removeKey } from '../utils/connectRedis';
import { validateInputs } from '../middlewares/validateInputs';
import axios from 'axios';
import { orm } from '../config/typeorm.config';
import { User } from '../entities/User';
import {
	ACCOUNT_CREATED,
	FAILED_FORGOT_PASSWORD,
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

const router = Router();

const PASSWORD_RESET_PREFIX = 'pass_reset_';

const userRepository = orm.getRepository(User);

router.post('/register', isNotAuth, async (req: Request, res: Response) => {
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
			console.log(err);
		});
});

router.post('/login', isNotAuth, async (req, res) => {
	const { emailOrPhone, password } = req.body;

	const error = CreateResponse(USERNAME_OR_PASSWORD_NOT_FOUND);

	let user = await userRepository.findOne({ where: { email: emailOrPhone } });
	if (!user)
		user = await userRepository.findOne({ where: { phone: emailOrPhone } });
	if (!user) return res.json(error);

	if (!(await argon2.verify(user.password, password))) {
		await axios.get(
			'https://ipgeolocation.abstractapi.com/v1/?api_key=' +
				ABSTRACT_API_KEY,
		);

		return res.json(error);
	}

	logIn(req, user.id);

	return res.json(CreateResponse(SUCCESSFUL_LOGIN));
});

router.post('/logout', isAuth, async (req: Request, res: Response) => {
	logOut(req, res);

	return res.json(CreateResponse(SUCCESSFUL_LOGOUT));
});

router.post(
	'/forgot-password',
	isNotAuth,
	async (req: Request, res: Response) => {
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
		}

		return res.json(CreateResponse(SUCCESSFUL_FORGOT_PASSWORD));
	},
);

router.post(
	'/reset-password',
	isNotAuth,
	async (req: Request, res: Response) => {
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
