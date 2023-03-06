import { JwtExtendedPayload } from 'jsonwebtoken';
declare global {
	namespace Express {
		interface Request {
			token: string;
			issuer: JwtExtendedPayload;
		}
	}
}
