import { JwtPayload } from './types/JwtPayload';
import { decode, sign, verify } from 'jsonwebtoken';
import { __jwt_options__, __jwt_secret__ } from './config';

export * from './types/JwtPayload';

export const JwtSign = (payload: JwtPayload): string => {
	return sign(payload, __jwt_secret__, __jwt_options__);
};

export const JwtVerify = async (token: string) => {
	verify(token.split(' ')[1], __jwt_secret__, __jwt_options__, (err, _) => {
		if (err) return false;
		return true;
	});
};

export const JwtDecode = (token: string) => {
	return decode(token.split(' ')[1]);
};
