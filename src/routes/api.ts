import { Request, Response, Router } from 'express';
import { CreateResponse } from '../utils/CreateResponse';
import { isNotAuth } from '../middlewares/isNotAuth';
import { isAuth } from '../middlewares/isAuth';

import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
import CompanyController from '../controllers/CompanyController';
import TableController from '../controllers/TableController';
import FoodController from '../controllers/FoodController';
import CategoryController from '../controllers/CategoryController';
import { API_NOT_FOUND } from '../config/Responses';

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
	return res.json(CreateResponse(API_NOT_FOUND));
});

export default router;
