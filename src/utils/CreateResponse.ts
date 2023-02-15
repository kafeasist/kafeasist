import { __prod__ } from '../config/constants';

export interface KafeasistResponse {
	code: number;
	error?: string;
	message?: string;
	help: string;
	fields?: string[] | string;
	stack?: string | undefined;
	data?: any;
}

export interface CustomResponse {
	code: number;
	message: string;
	error?: boolean | true;
	fields?: string[] | string;
}

export const CreateResponse = (
	{ error, code, message, fields }: CustomResponse,
	data?: any,
): KafeasistResponse => {
	if (error === false) {
		return {
			code,
			message,
			fields,
			help: `https://destek.kafeasist.com/mesaj?kod=${code}`,
			data,
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
			data,
		};
	}
};
