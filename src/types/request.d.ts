import { JwtExtendedPayload } from './jwt';

export {};

declare global {
	namespace Express {
		interface Request {
			token: string;
			issuer: JwtExtendedPayload;
		}
	}
}
