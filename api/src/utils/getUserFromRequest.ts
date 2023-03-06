import { JwtDecode, JwtPayload } from '@kafeasist/auth';
import { Request } from 'express';

export const getUserFromRequest = (req: Request): number | null => {
	const token = req.headers['authorization'];
	if (!token) return null;

	const decoded = JwtDecode(token) as JwtPayload;

	if (!decoded.id) return null;
	return decoded.id;
};
