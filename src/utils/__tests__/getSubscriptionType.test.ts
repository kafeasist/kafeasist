import { SubscriptionTypes } from '../../types/SubscriptionInfo';
import { getSubscriptionType } from '../getSubscriptionType';

describe('getSubscriptionType util function', () => {
	it('should give proper subscription types', async () => {
		const free = getSubscriptionType(0);
		const medium = getSubscriptionType(1);
		const large = getSubscriptionType(2);
		const nil = getSubscriptionType(3);

		expect(free).toEqual(SubscriptionTypes.FREE);
		expect(medium).toEqual(SubscriptionTypes.MEDIUM);
		expect(large).toEqual(SubscriptionTypes.LARGE);
		expect(nil).toEqual(null);
	});
});
