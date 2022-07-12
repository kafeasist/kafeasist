import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	clearMocks: true,
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['<rootDir>/src/__tests__/**/*.test.ts'],
	setupFilesAfterEnv: ['<rootDir>/src/__tests__/MockConnection.ts'],
};

export default config;
