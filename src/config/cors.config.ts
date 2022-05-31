import { CorsOptions } from 'cors';
import { __cors_origin__ } from './constants';

export const corsOptions = {
	origin: __cors_origin__,
	credentials: true,
} as CorsOptions;
