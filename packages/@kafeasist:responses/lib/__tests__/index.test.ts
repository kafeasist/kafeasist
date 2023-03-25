import { CreateResponse, CustomResponse } from '../index';
import { expect } from 'chai';

describe('Create Response function', () => {
	it('should work with error responses', async () => {
		const error: CustomResponse = {
			code: 0,
			message: 'Test message',
			fields: ['error', 'field'],
		};

		const response = CreateResponse(error);

		expect(response).haveOwnProperty('code', error.code);
		expect(response).haveOwnProperty('error', error.message);
		expect(response).haveOwnProperty('help');
		expect(response).haveOwnProperty('fields', error.fields);
	});

	it('should work with success responses', async () => {
		const success: CustomResponse = {
			code: 0,
			message: 'Test message',
			fields: ['success', 'field'],
			error: false,
		};

		const response = CreateResponse(success);

		expect(response).haveOwnProperty('code', success.code);
		expect(response).haveOwnProperty('message', success.message);
		expect(response).haveOwnProperty('help');
		expect(response).haveOwnProperty('fields', success.fields);
	});

	it('should work with additional data', async () => {
		const error: CustomResponse = {
			code: 0,
			message: 'Test message',
		};

		const success: CustomResponse = { ...error, error: false };
		const randomData = {
			test: 'test',
			testing: 'testing',
		};

		const errorResponse = CreateResponse(error, randomData);
		const successResponse = CreateResponse(success, randomData);

		expect(errorResponse).haveOwnProperty('data', randomData);
		expect(errorResponse).haveOwnProperty('error', error.message);
		expect(successResponse).haveOwnProperty('data', randomData);
		expect(successResponse).haveOwnProperty('message', success.message);
	});
});
