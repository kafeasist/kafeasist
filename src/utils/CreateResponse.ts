import { CustomResponse, KafeasistResponse } from '../types/ErrorStack';
import { __prod__ } from '../config/constants';

export const CreateResponse = (
	{ error, code, message, fields }: CustomResponse,
	issuer?: string,
): KafeasistResponse => {
	if (error === false) {
		return {
			code,
			message,
			fields,
			help: `https://destek.kafeasist.com/mesaj/kod?=${code}`,
			issuer,
		};
	} else {
		const err = new Error(message);

		return {
			code,
			error: err.message,
			fields,
			help: `https://destek.kafeasist.com/hata?kod=${code}`,
			stack: __prod__
				? 'Stack not reachable due to production reasons.'
				: err.stack,
			issuer,
		};
	}
};
