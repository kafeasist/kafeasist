import { CorsOptions } from 'cors';
import { env } from './constants';

export const corsOptions = {
	origin: env.CORS_ORIGIN,
	credentials: true,
} as CorsOptions;
