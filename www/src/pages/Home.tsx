import type { Component } from 'solid-js';
import { trpc } from '../services/trpc';

const Home: Component = () => {
	const login = trpc.auth.login.useMutation();
	const register = trpc.auth.register.useMutation();

	const handleLogin = async () => {
		await login.mutateAsync({
			emailOrPhone: 'testing@poopy.com',
			password: 'Testing123',
		});
	};

	const handleRegister = async () => {
		await register.mutateAsync({
			email: 'testing@poopy.com',
			first_name: 'hello',
			last_name: 'testing',
			password: 'Testing123',
			passwordAgain: 'Testing123',
			phone: '1231231234',
		});
	};

	return (
		<>
			<button
				onClick={handleLogin}
				disabled={login.isPending}
				class="border p-3 transition hover:bg-gray-200"
			>
				Login
			</button>
			<button
				onClick={handleRegister}
				disabled={register.isPending}
				class="border p-3 transition hover:bg-gray-200"
			>
				Register
			</button>

			{register.isError && register.error}
			{register.isSuccess && JSON.stringify(register.data)}

			{login.isError && login.error}
			{login.isSuccess && login.data.data.token}
		</>
	);
};

export default Home;
