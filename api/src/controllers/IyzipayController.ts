import { CreateResponse, USER_CANNOT_BE_FOUND } from '@kafeasist/responses';
import { z } from 'zod';
import { publicProcedure, router } from '../routes/trpc';
import iyzipay, {
	InitSubscriptionCheckoutFormInterface,
} from '../services/iyzipay';

export const iyzipayRouter = router({
	subscription: publicProcedure
		.input(
			z.object({
				callbackUrl: z.string(),
				customer: z.any(),
				paymentCard: z.any(),
				pricingPlanReferenceCode: z.string(),
			}),
		)
		.mutation(({ input, ctx }) => {
			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);
			return iyzipay.initSubscriptionCheckoutForm(
				userId,
				input as InitSubscriptionCheckoutFormInterface,
			);
		}),
	getSubscription: publicProcedure
		.input(
			z.object({
				token: z.string(),
			}),
		)
		.query(({ input, ctx }) => {
			const userId = ctx.userId;
			if (!userId) return CreateResponse(USER_CANNOT_BE_FOUND);
			return iyzipay.retrieveSubscriptionCheckoutForm(userId, input);
		}),
});

export default router;
