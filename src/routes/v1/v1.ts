import { Request, Response, Router } from 'express';
import { apiConfig } from '../../config/api.config';
import userController from './userController';
import authController from './authController';
import companyController from './companyController';
import tableController from './tableController';
import { createError } from '../../utils/createError';
import { isNotAuth } from '../../middlewares/isNotAuth';
import { isAuth } from '../../middlewares/isAuth';

const router = Router();

router.get('/', (_: Request, res: Response) =>
	res.json({ ...apiConfig, version: 1 }),
);

// routers
router.use('/user', userController);
router.use('/auth', isNotAuth, authController);
router.use('/company', companyController);
router.use('/table', isAuth, tableController);

router.use((_: Request, res: Response) => {
	res.status(404);
	return res.json(createError('Cannot find any actions to perform'));
});

export default router;
