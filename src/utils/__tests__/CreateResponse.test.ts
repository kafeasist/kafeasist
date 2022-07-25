import { CustomResponse } from '../../types/ErrorStack';
import { CreateResponse } from '../CreateResponse';

describe('Create Response function', () => {
	it('should work with error responses', async () => {
		const error: CustomResponse = {
			code: 0,
			message: 'Test message',
			fields: ['error', 'field'],
		};

		const response = CreateResponse(error);

		expect(response).toHaveProperty('code', error.code);
		expect(response).toHaveProperty('error', error.message);
		expect(response).toHaveProperty('help');
		expect(response).toHaveProperty('fields', error.fields);
		expect(response).toHaveProperty('stack');
	});

	it('should work with success responses', async () => {
		const success: CustomResponse = {
			code: 0,
			message: 'Test message',
			fields: ['success', 'field'],
			error: false,
		};

		const response = CreateResponse(success);

		expect(response).toHaveProperty('code', success.code);
		expect(response).toHaveProperty('message', success.message);
		expect(response).toHaveProperty('help');
		expect(response).toHaveProperty('fields', success.fields);
	});

	it('should work with issuer context', async () => {
		const error: CustomResponse = {
			code: 0,
			message: 'Test message',
		};

		const success: CustomResponse = { ...error, error: false };
		const issuer = 'test';

		const errorResponse = CreateResponse(error, issuer);
		const successResponse = CreateResponse(success, issuer);

		expect(errorResponse).toHaveProperty('issuer', issuer);
		expect(errorResponse).toHaveProperty('error', error.message);
		expect(successResponse).toHaveProperty('issuer', issuer);
		expect(successResponse).toHaveProperty('message', success.message);
	});
});
