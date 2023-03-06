import { Response, Router } from 'express';
import { CreateResponse } from '@kafeasist/responses';
import iyzipay, {
	InitSubscriptionCheckoutFormInterface,
	RetrieveSubscriptionCheckoutFormInterface,
} from '../services/iyzipay';
import { ExtendedRequest } from '../types/ExtendedRequest';
import { USER_CANNOT_BE_FOUND } from '@kafeasist/responses';
import { getUserFromRequest } from '../utils/getUserFromRequest';

const router = Router();

router.post(
	'/subscription',
	(
		req: ExtendedRequest<InitSubscriptionCheckoutFormInterface>,
		res: Response,
	) => {
		const userId = getUserFromRequest(req);
		if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));
		return iyzipay.initSubscriptionCheckoutForm(res, userId, req.body);
	},
);

router.get(
	'/subscription',
	(
		req: ExtendedRequest<RetrieveSubscriptionCheckoutFormInterface>,
		res: Response,
	) => {
		const userId = getUserFromRequest(req);
		if (!userId) return res.json(CreateResponse(USER_CANNOT_BE_FOUND));
		return iyzipay.retrieveSubscriptionCheckoutForm(res, userId, req.body);
	},
);

export default router;
