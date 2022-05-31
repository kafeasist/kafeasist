import { CustomError } from '../types/errorStack';
import { __prod__ } from '../config/constants';

export const createError = (
	{ message, stack }: Error,
	fields?: string[] | string,
): CustomError => {
	return {
		error: message,
		fields,
		stack: __prod__
			? 'Stack not reachable due to production reasons.'
			: stack,
	};
};
