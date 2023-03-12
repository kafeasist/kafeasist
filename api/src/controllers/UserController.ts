import {
	ALREADY_SUBSCRIBED,
	CreateResponse,
	EMPTY_ID,
	MFA_ACTIVATION_FAILED,
	MFA_ALREADY_ACTIVE,
	MFA_INCORRECT,
	MFA_SUCCEEDED,
	SUBSCRIPTION_CHANGED,
	SUBSCRIPTION_NOT_FOUND,
	TRY_AGAIN_SERVER,
	USER_CANNOT_BE_FOUND,
	USER_REMOVED,
	USER_REMOVE_FAILED,
} from '@kafeasist/responses';
import qrcode from 'qrcode';
import speakeasy, { GeneratedSecretWithOtpAuthUrl, totp } from 'speakeasy';
import { z } from 'zod';
import { orm } from '../config/typeorm.config';
import { User } from '../entities/User';
import { publicProcedure, router } from '../routes/trpc';
import { getKey, removeKey, setKey } from '../services/connectRedis';
import { getSubscriptionType } from '../utils/getSubscriptionType';
import { logger } from '../utils/logger';
import { validateInputs } from '../utils/validateInputs';

const MFA_PREFIX = '2fa_secret_';

const userRepository = orm.getRepository(User);

export interface UserActivate2FAParams {
	code: string;
}

export interface UserUpdateSubsTypeParams {
	id: string;
	subs_type: string;
}

export const userRouter = router({
	// TODO: isAuth
	me: publicProcedure.query(async ({ ctx }) => {
		const id = ctx.userId;
		if (!id) return CreateResponse(USER_CANNOT_BE_FOUND);

		const user = await userRepository.findOne({ where: { id } });

		if (!user) return CreateResponse(USER_CANNOT_BE_FOUND);

		const returnedFields = {
			id: user.id,
			firstName: user.first_name,
			lastName: user.last_name,
			email: user.email,
			phone: user.phone,
		};

		return returnedFields;
	}),
	get: publicProcedure // TODO: isAdmin
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ input }) => {
			const { id } = input;

			if (!id) return CreateResponse(EMPTY_ID);

			const user = await userRepository.findOne({
				where: { id },
			});

			if (!user) return CreateResponse(USER_CANNOT_BE_FOUND);

			return user;
		}),
	companies: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ input }) => {
			const { id } = input;

			const user = await userRepository.findOne({
				where: { id },
				relations: ['companies'],
			});

			if (!user) return CreateResponse(USER_CANNOT_BE_FOUND);

			return user.companies;
		}),
	remove: publicProcedure // TODO: isAdmin
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			const { id } = input;

			const user = await userRepository.findOne({
				where: { id },
			});

			if (!user) return CreateResponse(USER_CANNOT_BE_FOUND);

			return userRepository
				.remove(user)
				.then(() => CreateResponse(USER_REMOVED))
				.catch((err) => {
					logger(err.message);
					return CreateResponse(USER_REMOVE_FAILED);
				});
		}),
	// TODO: isAuth
	generate2fa: publicProcedure.query(async ({ ctx }) => {
		const userId = ctx.userId;
		if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

		const user = await userRepository.findOne({
			where: { id: userId },
		});
		if (!user) return CreateResponse(USER_CANNOT_BE_FOUND);

		if (user.mfa) return CreateResponse(MFA_ALREADY_ACTIVE);

		const secret: GeneratedSecretWithOtpAuthUrl = speakeasy.generateSecret({
			issuer: 'kafeasist',
			name: `kafeasist (${user.email})`,
			otpauth_url: true,
		});

		await setKey(MFA_PREFIX + userId, secret.base32);

		return qrcode.toDataURL(secret.otpauth_url as string, (err, data) => {
			if (err) return CreateResponse(MFA_ACTIVATION_FAILED);

			return { data };
		});
	}),
	activate2fa: publicProcedure // TODO: isAuth
		.input(
			z.object({
				code: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { code } = input;

			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);

			const user = await userRepository.findOne({
				where: { id: userId },
			});
			if (!user) return CreateResponse(USER_CANNOT_BE_FOUND);

			if (user.mfa) return CreateResponse(MFA_ALREADY_ACTIVE);

			const secret = await getKey(MFA_PREFIX + userId);
			if (!secret) return CreateResponse(TRY_AGAIN_SERVER);

			const err = validateInputs({ mfa: code });
			if (err) return err;

			const result = totp.verify({
				secret,
				encoding: 'base32',
				token: code,
			});

			if (!result) return CreateResponse(MFA_INCORRECT);

			user.mfa = secret;
			await User.save(user);
			await removeKey(MFA_PREFIX + userId);

			return CreateResponse(MFA_SUCCEEDED);
		}),
	updateSubType: publicProcedure // TODO: isAdmin
		.input(
			z.object({
				id: z.number(),
				subs_type: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			const { id, subs_type } = input;

			const user = await userRepository.findOne({
				where: { id },
			});
			if (!user) return USER_CANNOT_BE_FOUND;

			if (user.subs_type === subs_type)
				return CreateResponse(ALREADY_SUBSCRIBED);

			if (getSubscriptionType(subs_type) === null)
				return CreateResponse(SUBSCRIPTION_NOT_FOUND);

			user.subs_type = subs_type;
			await userRepository.save(user);

			return CreateResponse(SUBSCRIPTION_CHANGED);
		}),
});

export default router;
