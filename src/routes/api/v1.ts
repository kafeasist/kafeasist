import { Request, Response, Router } from 'express';
import { apiConfig } from '../../config/api.config';

const router = Router();

router.get('/', (_: Request, res: Response) =>
	res.json({ ...apiConfig, version: 1 }),
);

router.get('/token', (req: Request, res: Response) => {
	res.json({
		token: req.token,
	});
});

export default router;
