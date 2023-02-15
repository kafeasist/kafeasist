import { Response, Router } from 'express';
import { CreateResponse } from '../utils/CreateResponse';
import iyzipay, {
	InitSubscriptionCheckoutFormInterface,
	RetrieveSubscriptionCheckoutFormInterface,
} from '../services/iyzipay';
import { ExtendedRequest } from '../types/ExtendedRequest';
import { USER_CANNOT_BE_FOUND } from '../config/Responses';

const router = Router();

router.post(
	'/subscription',
	(
		req: ExtendedRequest<InitSubscriptionCheckoutFormInterface>,
		res: Response,
	) => {
		if (!req.session.userId)
			return res.json(CreateResponse(USER_CANNOT_BE_FOUND));
		return iyzipay.initSubscriptionCheckoutForm(
			res,
			req.session.userId,
			req.body,
		);
	},
);

router.get(
	'/subscription',
	(
		req: ExtendedRequest<RetrieveSubscriptionCheckoutFormInterface>,
		res: Response,
	) => {
		if (!req.session.userId)
			return res.json(CreateResponse(USER_CANNOT_BE_FOUND));
		return iyzipay.retrieveSubscriptionCheckoutForm(
			res,
			req.session.userId,
			req.body,
		);
	},
);

export default router;
