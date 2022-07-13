export interface KafeasistResponse {
	code: number;
	error?: string;
	message?: string;
	help: string;
	fields?: string[] | string;
	stack?: string | undefined;
}

export interface CustomResponse {
	code: number;
	message: string;
	error?: boolean | true;
	fields?: string[] | string;
}
