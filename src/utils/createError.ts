import { __prod__ } from '../config/constants';

export const createError = ({ message, stack }: Error) => {
	return {
		errors: [
			{
				message,
				stack: __prod__
					? 'Stack not reachable due to production reasons.'
					: stack,
			},
		],
	};
};
