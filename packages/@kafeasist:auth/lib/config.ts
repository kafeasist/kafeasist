import dotenv from 'dotenv';
dotenv.config();

import { Secret } from 'jsonwebtoken';

export const __jwt_secret__ = process.env.JWT_SECRET as Secret;
export const __jwt_options__ = {
	issuer: process.env.JWT_ISSUER,
};
