import { defineConfig, loadEnv } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [solidPlugin()],
		server: {
			port: 3000,
		},
		build: {
			target: 'esnext',
		},
		define: {
			'process.env': {
				NODE_ENV: env.NODE_ENV,
				API_URL: env.VITE_API_URL,
			},
		},
	};
});
