import { CustomError } from '../types/errorStack';
import { createError } from '../utils/createError';

export const isInt = (integers: string[] | null): CustomError | null => {
	if (!integers) return createError('Bu alanı boş bırakamazsınız');

	const errors: string[] = [];
	integers.forEach((integer) => {
		if (isNaN(parseInt(integer))) errors.push(integer);
	});

	if (errors.length > 0)
		return createError('Bu alanlardaki veriler tam sayı olmalı', errors);

	return null;
};
