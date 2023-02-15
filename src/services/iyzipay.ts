import Iyzipay, { IyzipayCustomer, IyzipayPaymentCard } from 'iyzipay';
import { logger } from '../utils/logger';
import {
	__iyzipay_config__,
	__iyzipay_number__,
	__prod__,
} from '../config/constants';
import { Response } from 'express';
import { CreateResponse } from '../utils/CreateResponse';
import {
	FAILED_IYZIPAY_INIT_SUBSCRIPTION,
	FAILED_IYZIPAY_RETRIEVE_SUBSCRIPTION,
	IYZIPAY_INIT_SUBSCRIPTION,
	IYZIPAY_RETRIEVE_SUBSCRIPTION,
} from '../config/Responses';
import { getKey, setKey } from './connectRedis';

export interface InitSubscriptionCheckoutFormInterface {
	callbackUrl: string;
	pricingPlanReferenceCode: string;
	customer: IyzipayCustomer;
	paymentCard: IyzipayPaymentCard;
}

export interface RetrieveSubscriptionCheckoutFormInterface {
	token: string;
}

const iyzipay = new Iyzipay(__iyzipay_config__);
const IYZIPAY_PREFIX = 'iyzipay_content_';
const IYZIPAY_TOKEN_PREFIX = 'iyzipay_token_';

const initSubscriptionCheckoutForm = (
	res: Response,
	userId: number,
	props: InitSubscriptionCheckoutFormInterface,
) => {
	return iyzipay.subscriptionCheckoutForm.initialize(
		{
			...props,
			conversationId: __iyzipay_number__,
			subscriptionInitialStatus:
				Iyzipay.SUBSCRIPTION_INITIAL_STATUS.ACTIVE,
		},
		async (_, result) => {
			if (
				result.status === 'failure' ||
				result?.conversationId !== __iyzipay_number__
			) {
				logger(JSON.stringify(result));
				return res.json(
					CreateResponse(FAILED_IYZIPAY_INIT_SUBSCRIPTION, result),
				);
			}

			const { checkoutFormContent, token, tokenExpireTime } = result;
			await setKey(IYZIPAY_PREFIX + userId, checkoutFormContent);
			await setKey(IYZIPAY_TOKEN_PREFIX + userId, token);

			return res.json(
				CreateResponse(IYZIPAY_INIT_SUBSCRIPTION, {
					checkoutFormContent,
					token,
					tokenExpireTime,
				}),
			);
		},
	);
};

const retrieveSubscriptionCheckoutForm = (
	res: Response,
	userId: number,
	props: RetrieveSubscriptionCheckoutFormInterface,
) =>
	iyzipay.subscriptionCheckoutForm.retrieve(
		{
			...props,
			conversationId: __iyzipay_number__,
		},
		async (_, result) => {
			if (
				result.status === 'failure' ||
				result?.conversationId !== __iyzipay_number__
			) {
				logger(JSON.stringify(result));
				return res.json(
					CreateResponse(
						FAILED_IYZIPAY_RETRIEVE_SUBSCRIPTION,
						result,
					),
				);
			}

			const { token } = props;
			const storedToken = await getKey(IYZIPAY_TOKEN_PREFIX + userId);

			if (storedToken !== token)
				return res.json(
					CreateResponse(
						FAILED_IYZIPAY_RETRIEVE_SUBSCRIPTION,
						result,
					),
				);

			return res.json(
				CreateResponse(IYZIPAY_RETRIEVE_SUBSCRIPTION, result),
			);
		},
	);

export default {
	initSubscriptionCheckoutForm,
	retrieveSubscriptionCheckoutForm,
};
