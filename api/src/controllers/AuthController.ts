import { CreateResponse } from '@kafeasist/responses';
import { __testing__ } from '../config/constants';
import * as argon2 from 'argon2';
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
	USERNAME_OR_PASSWORD_NOT_FOUND,
	USER_CANNOT_BE_FOUND,
} from '@kafeasist/responses';
import { totp } from 'speakeasy';
import { getUniqueItem } from '../utils/getUniqueItem';
import { JwtPayload, JwtSign } from '@kafeasist/auth';
import { publicProcedure, router } from '../routes/trpc';
import { z } from 'zod';

const PASSWORD_RESET_PREFIX = 'pass_reset_';

const userRepository = orm.getRepository(User);

export const authRouter = router({
	register: publicProcedure // TODO: notAuthProcedure
		.input(
			z.object({
				first_name: z.string(),
				last_name: z.string(),
				phone: z.string(),
				email: z.string().email(),
				password: z.string(),
				passwordAgain: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const {
				first_name,
				last_name,
				phone,
				email,
				password,
				passwordAgain,
			} = input;

			const err = validateInputs({
				name: first_name,
				last_name,
				phone,
				email,
				password,
				confirmPassword: passwordAgain,
			});

			if (err) return err;

			const hashedPassword = await argon2.hash(password);

			const newUser = new User();
			newUser.first_name = first_name;
			newUser.last_name = last_name;
			newUser.phone = phone;
			newUser.email = email;
			newUser.password = hashedPassword;

			return await User.save(newUser)
				.then((newUser) => {
					const payload: JwtPayload = {
						id: newUser.id,
						first_name: newUser.first_name,
						last_name: newUser.last_name,
						email: newUser.email,
						phone: newUser.phone,
						subs_type: newUser.subs_type,
						verified: newUser.verified,
					};

					const token = JwtSign(payload);

					return CreateResponse(ACCOUNT_CREATED, { token });
				})
				.catch((err) => {
					if (err.code === '23505') {
						const key = getUniqueItem(err?.detail);

						return CreateResponse({
							...ALREADY_IN_USE,
							fields: key,
						});
					}
					return;
				});
		}),

	login: publicProcedure // TODO: notAuthProcedure
		.input(
			z.object({
				emailOrPhone: z.string(),
				remember: z.boolean().default(false),
				password: z.string(),
				mfa: z.string().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const { emailOrPhone, password, mfa } = input;

			const error = CreateResponse(USERNAME_OR_PASSWORD_NOT_FOUND);

			let user = await userRepository.findOne({
				where: { email: emailOrPhone },
			});

			if (!user) {
				user = await userRepository.findOne({
					where: { phone: emailOrPhone },
				});
			}

			if (!user) return error;

			if (!(await argon2.verify(user.password, password))) {
				// const { data } = await axios.get(
				// 	'https://ipgeolocation.abstractapi.com/v1/?api_key=' +
				// 		ABSTRACT_API_KEY,
				// );
				// socket.emit('server:failed_login', data);
				return error;
			}

			if (user.mfa) {
				if (!mfa) return CreateResponse(MFA_FAILED);

				const err = validateInputs({ mfa });
				if (err) return err;

				const result = totp.verify({
					secret: user.mfa,
					encoding: 'base32',
					token: mfa,
				});

				if (!result) return CreateResponse(MFA_INCORRECT);
			}

			const payload: JwtPayload = {
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				phone: user.phone,
				subs_type: user.subs_type,
				verified: user.verified,
			};

			const token = JwtSign(payload);

			return CreateResponse(SUCCESSFUL_LOGIN, { token });
		}),

	'forgot-password': publicProcedure // TODO: notAuthProcedure
		.input(
			z.object({
				emailOrPhone: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const { emailOrPhone } = input;

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
				// TODO: sendMail(userEmail, MailTypes.FORGOT_PASSWORD, { token });
				if (__testing__)
					return CreateResponse(SUCCESSFUL_FORGOT_PASSWORD, token);
			}

			return CreateResponse(SUCCESSFUL_FORGOT_PASSWORD);
		}),

	'reset-password': publicProcedure // TODO: notAuthProcedure
		.input(
			z.object({
				password: z.string(),
				confirmPassword: z.string(),
				token: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const { password, confirmPassword, token } = input;

			const key = PASSWORD_RESET_PREFIX + token;
			const userId = await getKey(key);

			if (!userId) return CreateResponse(FAILED_FORGOT_PASSWORD);

			const user = await userRepository.findOne({
				where: { id: parseInt(userId) },
			});

			if (!user) return CreateResponse(USER_CANNOT_BE_FOUND);

			const err = validateInputs({
				password,
				confirmPassword,
			});

			if (err) err;

			if (await argon2.verify(user.password, password))
				return CreateResponse(SAME_PASSWORD);

			removeKey(key);
			const hashedPassword = await argon2.hash(password);

			user.password = hashedPassword;
			await userRepository.save(user);

			return CreateResponse(PASSWORD_CHANGED);
		}),
});

export default router;
