import { Request, Response, Router } from 'express';
import { apiConfig } from '../../config/api.config';
import userController from './userController';
import authController from './authController';
import { createError } from '../../utils/createError';

const router = Router();

router.get('/', (_: Request, res: Response) =>
	res.json({ ...apiConfig, version: 1 }),
);

// get current authorization token
router.get('/token', (req: Request, res: Response) => {
	res.json({
		token: req.token,
	});
});

// routers
router.use('/user', userController);
router.use('/auth', authController);

router.use((_: Request, res: Response) => {
	const err = new Error('Cannot find any events to perform');
	res.status(404);
	return res.json(createError(err));
});

export default router;
