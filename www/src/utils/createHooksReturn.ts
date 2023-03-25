import { KafeasistResponse } from '@kafeasist/responses';
import { HooksReturn } from './HooksReturn';

export const createHooksReturn = (
	isError: boolean,
	response: KafeasistResponse,
): HooksReturn => {
	return { isError, response };
};
