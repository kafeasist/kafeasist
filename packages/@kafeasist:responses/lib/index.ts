export * from './responses';

export interface KafeasistResponse {
	api: {
		version?: string;
		name: string;
	};
	code: number;
	error?: string;
	message?: string;
	help: string;
	fields?: string[] | string;
	data?: any;
}

export interface CustomResponse {
	code: number;
	message: string;
	error?: boolean | true;
	fields?: string[] | string;
}

const __version__ = process.env.npm_package_version;
const __api_name__ = 'kafeasist_api';
const __api_info__ = {
	version: __version__,
	name: __api_name__,
};

export const CreateResponse = (
	{ error, code, message, fields }: CustomResponse,
	data?: any,
): KafeasistResponse => {
	if (error === false) {
		return {
			api: __api_info__,
			code,
			message,
			fields,
			help: `https://destek.kafeasist.com/mesaj?kod=${code}`,
			data,
		};
	} else {
		const err = new Error(message);

		return {
			api: __api_info__,
			code,
			error: err.message,
			fields,
			help: `https://destek.kafeasist.com/hata?kod=${code}`,
			data,
		};
	}
};
