import { ObjectId } from 'mongoose';
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

declare module 'express-session' {
	interface SessionData {
		userId: string;
	}
}
