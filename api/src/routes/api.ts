import { Request, Response, Router } from 'express';
import { CreateResponse } from '../utils/CreateResponse';
import { isAuth } from '../middlewares/isAuth';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import CompanyController from '../controllers/CompanyController';
import TableController from '../controllers/TableController';
import FoodController from '../controllers/FoodController';
import CategoryController from '../controllers/CategoryController';
import EmployeeController from '../controllers/EmployeeController';
import IyzipayController from '../controllers/IyzipayController';
import { API_NOT_FOUND } from '../config/Responses';
import { __version__ } from '../config/constants';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

router.get('/', (_: Request, res: Response) =>
	res.json({ version: __version__ }),
);

// routers
router.use('/auth', AuthController);
router.use('/user', UserController);
router.use('/company', isAuth, CompanyController);
router.use('/table', isAuth, TableController);
router.use('/food', isAuth, FoodController);
router.use('/category', isAuth, CategoryController);
router.use('/employee', isAuth, EmployeeController);
router.use('/iyzipay', isAdmin, IyzipayController);

router.use((_: Request, res: Response) => {
	res.status(404);
	return res.json(CreateResponse(API_NOT_FOUND));
});

export default router;
