import { API_404, API_NOT_FOUND } from '@kafeasist/responses';
import { __version__ } from '../../config/constants';
import { assert } from 'chai';
import { TestFactory } from '../../utils/TestFactory';

describe('GET /', () => {
	const factory: TestFactory = new TestFactory();

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});

	it('should give 404 error', (done) => {
		factory.app.get('/').end((err, res) => {
			if (err) return done(err);
			assert(res.body.error === API_404.message);
			return done();
		});
	});

	it('should give the version of the API', (done) => {
		factory.app.get('/api').end((err, res) => {
			if (err) return done(err);
			assert(res.body.version === __version__);
			return done();
		});
	});

	it('should give not found error', (done) => {
		const random = (Math.random() + 1).toString(36).substring(7);
		factory.app.get('/api/' + random).end((err, res) => {
			if (err) return done(err);
			assert(res.body.error === API_NOT_FOUND.message);
			return done();
		});
	});
});
