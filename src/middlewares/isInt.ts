import { EMPTY_ID, MUST_BE_INT } from '../config/Responses';
import { CreateResponse, KafeasistResponse } from '../utils/CreateResponse';

export const isInt = (integers: string[] | null): KafeasistResponse | null => {
	if (!integers) return CreateResponse(EMPTY_ID);

	const errors: string[] = [];
	integers.forEach((integer) => {
		if (isNaN(parseInt(integer))) errors.push(integer);
	});

	if (errors.length > 0) return CreateResponse(MUST_BE_INT);

	return null;
};
