import app from '../../app';
import request from 'supertest';
import { API_404, API_NOT_FOUND } from '../../config/Responses';
import { CreateResponse } from '../../utils/CreateResponse';
import { env } from '../../config/constants';

describe('GET /', () => {
	it('should give 404 error', async () => {
		const response = await request(app).get('/');

		expect({ ...response.body, stack: undefined }).toEqual({
			...CreateResponse(API_404),
			stack: undefined,
		});
	});

	it('should give the version of the API', async () => {
		const response = await request(app).get('/api');

		expect(response.body).toEqual({ version: env.VERSION });
	});

	it('should give not found error', async () => {
		const random = (Math.random() + 1).toString(36).substring(7);
		const response = await request(app).get('/api/' + random);

		expect({ ...response.body, stack: undefined }).toEqual({
			...CreateResponse(API_NOT_FOUND),
			stack: undefined,
		});
	});
});
