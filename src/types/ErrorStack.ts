export interface ErrorStack {
	error: [CustomError];
}

export interface CustomError {
	error: string;
	fields?: string[] | string;
	stack: string | undefined;
}
