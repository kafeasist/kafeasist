import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { router, createContext, publicProcedure } from './routes/trpc';
import { __port__ } from './config/constants';
import { authRouter } from './controllers/AuthController';
import { rateLimiter } from './services/rateLimiter';
import { corsOptions } from './config/cors.config';
import cors from 'cors';
import { API_NOT_FOUND, CreateResponse } from '@kafeasist/responses';
import { categoryRouter } from './controllers/CategoryController';
import { companyRouter } from './controllers/CompanyController';
import { employeeRouter } from './controllers/EmployeeController';
import { foodRouter } from './controllers/FoodController';
import { iyzipayRouter } from './controllers/IyzipayController';
import { tableRouter } from './controllers/TableController';
import { userRouter } from './controllers/UserController';

const app = express().use(cors(corsOptions));

const appRouter = router({
	'': publicProcedure.query(() => {
		return CreateResponse(API_NOT_FOUND);
	}),
	auth: authRouter,
	category: categoryRouter,
	company: companyRouter,
	employee: employeeRouter,
	food: foodRouter,
	iyzipay: iyzipayRouter,
	table: tableRouter,
	user: userRouter,
});

app.use((req, _res, next) => {
	console.log('⬅️ ', req.method, req.path, req.body ?? req.query);

	next();
});

app.use(
	'/api',
	rateLimiter,
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext,
	}),
);

export type AppRouter = typeof appRouter;

export default app;
