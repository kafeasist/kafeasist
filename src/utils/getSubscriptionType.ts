import { SubscriptionTypes } from '../types/SubscriptionInfo';

export const getSubscriptionType = (
	subsType: number,
): SubscriptionTypes | null => {
	switch (subsType) {
		case 0:
			return SubscriptionTypes.FREE;
		case 1:
			return SubscriptionTypes.MEDIUM;
		case 2:
			return SubscriptionTypes.LARGE;
		default:
			return null;
	}
};
