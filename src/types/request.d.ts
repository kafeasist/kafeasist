import { JwtExtendedPayload } from 'jwt';
declare global {
	namespace Express {
		interface Request {
			token: string;
			issuer: JwtExtendedPayload;
		}
	}
}

import session from 'express-session';
declare module 'express-session' {
	export interface SessionData {
		userId: number;
	}
}
