import { Request, Response, Router } from 'express';
import { orm } from '../config/typeorm.config';
import { User } from '../entities/User';
import { isAuth } from '../middlewares/isAuth';
import { createError } from '../utils/createError';
import { logger } from '../utils/logger';
import speakeasy, { GeneratedSecretWithOtpAuthUrl, totp } from 'speakeasy';
import qrcode from 'qrcode';
import { getKey, removeKey, setKey } from '../utils/connectRedis';

const router = Router();

const MFA_PREFIX: string = '2fa_secret_';

const userRepository = orm.getRepository(User);

router.get('/me', isAuth, async (req: Request, res: Response) => {
	const id = req.session.userId;

	const user = await userRepository.findOne({ where: { id } });

	if (!user) return res.json(createError('Kullanıcı bulunamadı!'));

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

router.get('/get', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id)
		return res.json(createError('ID kısmı boş bırakılmamalıdır', 'id'));

	if (isNaN(parseInt(id)))
		return res.json(createError('ID sadece sayı olabilir', 'id'));

	const numberId = parseInt(id);

	const user = await userRepository.findOne({ where: { id: numberId } });

	if (!user)
		return res.json(createError('Belirtilen kullanıcı bulunamadı', 'id'));

	return res.json(user);
});

router.get('/companies', async (req: Request, res: Response) => {
	const { id }: any = req.query;

	if (!id)
		return res.json(createError('ID kısmı boş bırakılmamalıdır', 'id'));

	const user = await userRepository.findOne({
		where: { id: parseInt(id) },
		relations: ['companies'],
	});

	if (!user)
		return res.json(createError('Belirtilen kullanıcı bulunamadı!', 'id'));

	return res.json(user.companies);
});

router.delete('/remove', async (req: Request, res: Response) => {
	const { id } = req.body;

	if (!id)
		return res.json(createError('ID kısmı boş bırakılmamalıdır', 'id'));

	if (isNaN(parseInt(id)))
		return res.json(createError('ID sadece sayı olabilir', 'id'));

	const numberId = parseInt(id);

	const user = await userRepository.findOne({ where: { id: numberId } });

	if (!user)
		return res.json(createError('Belirtilen kullanıcı bulunamadı', 'id'));

	return userRepository
		.remove(user)
		.then(() => {
			return res.json({
				message: 'Kullanıcı başarıyla silindi!',
			});
		})
		.catch((err) => {
			logger(err.message);
			if (err.code === 'EREQUEST')
				return res.json(
					createError(
						'Öncelikle kullanıcının şirketlerini silmelisiniz.',
					),
				);
			return res.json(
				createError('Kullanıcı silinirken bir hata ile karşılaşıldı'),
			);
		});
});

router.get('/generate2fa', isAuth, async (req, res) => {
	const userId: number | undefined = req.session.userId;

	if (!userId) return res.json(createError('Kullanıcı bulunamadı!'));

	const user: User | null = await userRepository.findOne({
		where: { id: userId },
	});
	if (!user) return res.json(createError('Kullanıcı bulunamadı!'));

	if (user.mfa)
		return res.json(createError('Zaten çift faktörlü doğrulamanız etkin!'));

	const secret: GeneratedSecretWithOtpAuthUrl = speakeasy.generateSecret({
		issuer: 'kafeasist',
		name: `kafeasist (${user.email})`,
		otpauth_url: true,
	});

	await setKey(MFA_PREFIX + userId, secret.ascii);

	return qrcode.toDataURL(secret.otpauth_url as string, (err, data) => {
		if (err)
			return res.json(
				createError(
					'Çift faktörlü doğrulama etkinleştirilirken bir hatayla karşılaşıldı!',
				),
			);

		return res.json({ data });
	});
});

router.post('/activate2fa', isAuth, async (req: Request, res: Response) => {
	const { code } = req.body;

	const userId = req.session.userId;
	if (!userId) return res.json(createError('Kullanıcı bulunamadı!'));

	const user = await userRepository.findOne({ where: { id: userId } });
	if (!user) return res.json(createError('Kullanıcı bulunamadı!'));

	if (user.mfa)
		return res.json(createError('Zaten çift faktörlü doğrulamanız etkin!'));

	const secret = await getKey(MFA_PREFIX + userId);
	if (!secret)
		return res.json(
			createError(
				'Sunucularda bir hata oluştu, lütfen işlemi yeniden başlatınız.',
			),
		);

	if (!code || (code as string).length !== 6 || !/^\d+$/.test(code))
		return res.json(
			createError('Lütfen uygulamadaki 6 haneli kodu girin.', 'code'),
		);

	const result = totp.verify({
		secret,
		encoding: 'ascii',
		token: code,
	});

	if (!result)
		return res.json(createError('6 haneli kodunuz doğru değil!', 'code'));

	user.mfa = true;
	await User.save(user);
	await removeKey(MFA_PREFIX + userId);

	return res.json({
		message: 'Çift faktörlü doğrulamanız etkinleştirildi.',
		success: result,
	});
});

export default router;
