import 'module-alias/register';
import { TestFactory } from '../../utils/TestFactory';

describe('TESTING /api/category', () => {
	const factory: TestFactory = new TestFactory();

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});
});
