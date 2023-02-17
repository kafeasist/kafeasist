import { EMPTY_ID, MUST_BE_INT } from '@kafeasist/responses';
import { CreateResponse, KafeasistResponse } from '@kafeasist/responses';

export const isInt = (integers: string[]): KafeasistResponse | null => {
	if (!integers) return CreateResponse(EMPTY_ID);

	const errors: string[] = [];
	integers.forEach((integer: string) => {
		if (isNaN(parseInt(integer))) errors.push(integer);
	});

	if (errors.length > 0) return CreateResponse(MUST_BE_INT);

	return null;
};
