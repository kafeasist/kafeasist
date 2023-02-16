import { SubscriptionTypes } from '../SubscriptionInfo';
import { getSubscriptionType } from '../getSubscriptionType';
import { expect } from 'chai';

describe('getSubscriptionType util function', () => {
	it('should give proper subscription types', async () => {
		const free = getSubscriptionType(0);
		const medium = getSubscriptionType(1);
		const large = getSubscriptionType(2);
		const nil = getSubscriptionType(3);

		expect(free).equal(SubscriptionTypes.FREE);
		expect(medium).equal(SubscriptionTypes.MEDIUM);
		expect(large).equal(SubscriptionTypes.LARGE);
		expect(nil).equal(null);
	});
});
