import { Request, Response, Router } from 'express';
import { orm } from '../config/typeorm.config';
import { User } from '../entities/User';
import { isAuth } from '../middlewares/isAuth';
import { CreateResponse } from '../utils/CreateResponse';
import { logger } from '../utils/logger';
import speakeasy, { GeneratedSecretWithOtpAuthUrl, totp } from 'speakeasy';
import qrcode from 'qrcode';
import { getKey, removeKey, setKey } from '../utils/connectRedis';
import {
	ALREADY_SUBSCRIBED,
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
} from '../config/Responses';
import { isInt } from '../middlewares/isInt';
import { validateInputs } from '../middlewares/validateInputs';
import { isAdmin } from '../middlewares/isAdmin';
import { getSubscriptionType } from '../utils/getSubscriptionType';

const router = Router();

const MFA_PREFIX: string = '2fa_secret_';

const userRepository = orm.getRepository(User);

router.get('/me', isAuth, async (req: Request, res: Response) => {
	const id = req.session.userId;

	const user = await userRepository.findOne({ where: { id } });

	if (!user) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	const returnedFields = {
		id: user.id,
		firstName: user.first_name,
		lastName: user.last_name,
		email: user.email,
		phone: user.phone,
	};

	return returnedFields;
});

router.get(
	'/checkauth',
	isAuth,
	(_: Request, res: Response): Response<boolean, Record<string, boolean>> => {
		return res.send(true);
	},
);

router.get('/get', isAdmin, async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id) return res.json(CreateResponse(EMPTY_ID, req.issuer));

	const err = isInt([id]);
	if (err) return res.json(err);

	const numberId = parseInt(id);

	const user = await userRepository.findOne({ where: { id: numberId } });

	if (!user)
		return res.json(CreateResponse(USER_CANNOT_BE_FOUND, req.issuer));

	return res.json(user);
});

router.get('/companies', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id) return res.json(CreateResponse(EMPTY_ID));

	const err = isInt([id]);
	if (err) return res.json(err);

	const user = await userRepository.findOne({
		where: { id: parseInt(id) },
		relations: ['companies'],
	});

	if (!user) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	return res.json(user.companies);
});

router.delete('/remove', isAdmin, async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id) return res.json(CreateResponse(EMPTY_ID, req.issuer));

	const err = isInt([id]);
	if (err) return res.json(err);

	const numberId = parseInt(id);

	const user = await userRepository.findOne({ where: { id: numberId } });

	if (!user)
		return res.json(CreateResponse(USER_CANNOT_BE_FOUND, req.issuer));

	return userRepository
		.remove(user)
		.then(() => res.json(CreateResponse(USER_REMOVED, req.issuer)))
		.catch((err) => {
			logger(err.message);
			return res.json(CreateResponse(USER_REMOVE_FAILED, req.issuer));
		});
});

router.get('/generate2fa', isAuth, async (req, res) => {
	const userId: number | undefined = req.session.userId;

	if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	const user: User | null = await userRepository.findOne({
		where: { id: userId },
	});
	if (!user) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	if (user.mfa) return res.json(CreateResponse(MFA_ALREADY_ACTIVE));

	const secret: GeneratedSecretWithOtpAuthUrl = speakeasy.generateSecret({
		issuer: 'kafeasist',
		name: `kafeasist (${user.email})`,
		otpauth_url: true,
	});

	await setKey(MFA_PREFIX + userId, secret.base32);

	return qrcode.toDataURL(secret.otpauth_url as string, (err, data) => {
		if (err) return res.json(CreateResponse(MFA_ACTIVATION_FAILED));

		return res.json({ data });
	});
});

router.post('/activate2fa', isAuth, async (req: Request, res: Response) => {
	const { code } = req.body;

	const userId = req.session.userId;
	if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	const user = await userRepository.findOne({ where: { id: userId } });
	if (!user) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));

	if (user.mfa) return res.json(CreateResponse(MFA_ALREADY_ACTIVE));

	const secret = await getKey(MFA_PREFIX + userId);
	if (!secret) return res.json(CreateResponse(TRY_AGAIN_SERVER));

	const err = validateInputs({ mfa: code });
	if (err) return res.json(err);

	const result = totp.verify({
		secret,
		encoding: 'base32',
		token: code,
	});

	if (!result) return res.json(CreateResponse(MFA_INCORRECT));

	user.mfa = secret;
	await User.save(user);
	await removeKey(MFA_PREFIX + userId);

	return res.json(CreateResponse(MFA_SUCCEEDED));
});

router.post('/updateSubType', isAdmin, async (req: Request, res: Response) => {
	const { id, subs_type } = req.body;

	if (!id || !subs_type) return res.json(EMPTY_ID);

	const err = isInt([id, subs_type]);
	if (err) return res.json(err);

	const user = await userRepository.findOne({ where: { id: parseInt(id) } });
	if (!user) return res.json(USER_CANNOT_BE_FOUND);

	if (user.subs_type === parseInt(subs_type))
		return res.json(ALREADY_SUBSCRIBED);

	if (getSubscriptionType(parseInt(subs_type)) === null)
		return res.json(SUBSCRIPTION_NOT_FOUND);

	user.subs_type = parseInt(subs_type);
	await userRepository.save(user);

	return res.json(SUBSCRIPTION_CHANGED);
});

export default router;
