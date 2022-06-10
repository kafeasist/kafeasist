import { CustomError } from '../types/errorStack';
import { __prod__ } from '../config/constants';

export const createError = (
	error: string,
	fields?: string[] | string,
): CustomError => {
	const err = new Error(error);

	return {
		error: err.message,
		fields,
		stack: __prod__
			? 'Stack not reachable due to production reasons.'
			: err.stack,
	};
};
