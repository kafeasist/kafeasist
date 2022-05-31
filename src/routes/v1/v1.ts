import { Request, Response, Router } from 'express';
import { apiConfig } from '../../config/api.config';
import userController from './userController';

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

export default router;
