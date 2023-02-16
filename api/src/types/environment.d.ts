namespace NodeJS {
	interface ProcessEnv {
		PORT: number;
		NODE_ENV: 'test' | 'prod' | 'dev';
		JWT_SECRET: string;
		COOKIE_NAME: string;
		COOKIE_SECRET: string;
		REDIS_USER: string;
		REDIS_HOST: string;
		REDIS_PORT: number;
		REDIS_PASSWORD: string;
		ABSTRACT_API_KEY: string;
		DB_NAME: string;
		DB_USER: string;
		DB_PASS: string;
		DB_PORT: number;
		DB_HOST: string;
		TEST_DB_NAME: string;
		TEST_DB_USER: string;
		TEST_DB_PASS: string;
		TEST_DB_PORT: number;
		TEST_DB_HOST: string;
		IYZIPAY_API_KEY: string;
		IYZIPAY_SECRET_KEY: string;
		IYZIPAY_URI: string;
		IYZIPAY_NUMBER: string;
	}
}
