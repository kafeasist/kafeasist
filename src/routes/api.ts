import { Request, Response, Router } from 'express';
import { createError } from '../utils/createError';
import { apiVersions } from '../config/api.config';

const router = Router();

router.get('/v:id', (req: Request, res: Response) => {
	const { id } = req.params;

	if (!apiVersions.includes(id)) {
		res.status(404);
		return res.json(
			createError('Version you provided cannot be found on the server'),
		);
	}

	return null;
});

router.use((_: Request, res: Response) => {
	res.status(400);
	return res.json(createError('Please provide a valid version for the API'));
});

export default router;
