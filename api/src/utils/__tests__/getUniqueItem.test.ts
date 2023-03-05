import { getUniqueItem } from '../getUniqueItem';
import { expect } from 'chai';

describe('getUniqueItem util function', () => {
	it('should split properly', async () => {
		const tests = [
			{
				message: 'Key (username)=(abc123) already exists.',
				result: 'username',
			},
			{
				message: 'Key (phone)=(123123123) already exists.',
				result: 'phone',
			},
		];

		tests.forEach((test) => {
			expect(getUniqueItem(test.message)).equal(test.result);
		});
	});
});
