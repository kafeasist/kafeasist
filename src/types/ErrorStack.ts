export interface ErrorStack {
	error: [CustomError];
}

export interface CustomError {
	error: string;
	fields?: string[] | string;
	stack: string | undefined;
}

export interface CustomResponse {
	code: number;
	message: string;
	fields?: string[] | string;
}
