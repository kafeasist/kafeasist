export interface JwtPayload {
	id: number;
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	subs_type: number;
	verified: boolean;
}
