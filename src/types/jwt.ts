import { JwtPayload } from 'jsonwebtoken';

export interface JwtExtendedPayload extends JwtPayload {
	id: string;
	name: string;
}
