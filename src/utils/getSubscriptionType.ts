import { User } from '../entities/User';
import { SubscriptionTypes } from '../types/SubscriptionInfo';

export const getSubscriptionType = (user: User): SubscriptionTypes => {
	switch (user.subs_type) {
		case 1:
			return SubscriptionTypes.SMALL;
		case 2:
			return SubscriptionTypes.MEDIUM;
		case 3:
			return SubscriptionTypes.LARGE;
		default:
			return SubscriptionTypes.FREE;
	}
};
