import { Request, Response, Router } from 'express';
import { createError } from '../utils/createError';
import { isNotAuth } from '../middlewares/isNotAuth';
import { isAuth } from '../middlewares/isAuth';

import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
import CompanyController from '../controllers/CompanyController';
import TableController from '../controllers/TableController';
import FoodController from '../controllers/FoodController';
import CategoryController from '../controllers/CategoryController';

const router = Router();

router.get('/', (_: Request, res: Response) => res.json({ version: 1 }));

// routers
router.use('/user', UserController);
router.use('/auth', isNotAuth, AuthController);
router.use('/company', CompanyController);
router.use('/table', isAuth, TableController);
router.use('/food', isAuth, FoodController);
router.use('/category', isAuth, CategoryController);

router.use((_: Request, res: Response) => {
	res.status(404);
	return res.json(createError('Cannot find any actions to perform'));
});

export default router;
