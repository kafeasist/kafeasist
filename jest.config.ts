import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	clearMocks: true,
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'jest-environment-node',
	testMatch: ['<rootDir>/src/**/*.test.ts'],
	setupFilesAfterEnv: ['<rootDir>/src/utils/MockConnection.ts'],
};

export default config;
