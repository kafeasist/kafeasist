import { Request, Response, Router } from 'express';
import { createError } from '../utils/createError';
import { apiVersions } from '../config/api.config';

const router = Router();

router.get('/v:id', (req: Request, res: Response) => {
	const { id } = req.params;

	if (!apiVersions.includes(id)) {
		const err = new Error(
			'Version you provided cannot be found on the server',
		);
		return res.sendStatus(404).json(createError(err));
	}

	return null;
});

router.use((_: Request, res: Response) => {
	const err = new Error('Please provide a valid version for the API');
	return res.sendStatus(404).json(createError(err));
});

export default router;
