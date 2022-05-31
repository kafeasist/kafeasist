import { CustomError } from './errorStack';
import { JwtExtendedPayload } from './jwt';

export interface ProtectedReturn {
	issuer: JwtExtendedPayload;
	data?: any;
	error?: CustomError;
	issue_date: Date;
}
