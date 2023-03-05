import { ADMIN_ERROR } from '@kafeasist/responses';
import { assert } from 'chai';
import 'module-alias/register';
import { TestFactory } from '../../utils/TestFactory';

describe('TESTING /api/user', () => {
	const factory: TestFactory = new TestFactory();

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});

	/*
	describe('GET /me', () => {
		it('should give back the user details', (done) => {
			factory.app.get('/api/user/me').end((err, res) => {
				console.log(res.body);

				if (err) return done(err);
				expect(res.body).haveOwnProperty('id');
				expect(res.body).haveOwnProperty('firstName');
				expect(res.body).haveOwnProperty('lastName');
				expect(res.body).haveOwnProperty('email');
				expect(res.body).haveOwnProperty('phone');
				return done();
			});
		});
	});
	*/

	describe('GET /get?id=1', () => {
		it('should fail with admin error whilst getting a user info', (done) => {
			factory.app.get('/api/user/get?id=1').end((err, res) => {
				if (err) return done(err);
				assert(res.body.error === ADMIN_ERROR.message);
				return done();
			});
		});
	});
});
