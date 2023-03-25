import {
	CreateResponse,
	USERNAME_OR_PASSWORD_NOT_FOUND,
	UNKNOWN_ERROR,
} from '@kafeasist/responses';
import { Component, createEffect } from 'solid-js';
import { useStorage } from '../hooks/useStorage';
import { trpc } from '../lib/trpc';
import { createHooksReturn } from '../utils/createHooksReturn';

const Login: Component = () => {
	const login = trpc.auth.login.useMutation();

	const handleLogin = async () => {
		createEffect(async () => {
			await login.mutateAsync({
				emailOrPhone: 'testing@poopy.com',
				password: 'Testing123',
			});

			if (login.isError)
				return createHooksReturn(
					true,
					CreateResponse(USERNAME_OR_PASSWORD_NOT_FOUND),
				);
			if (login.data?.error) return createHooksReturn(true, login.data);

			if (login.data) {
				const [_, setStorage] = useStorage('SESSION');

				const token = login.data.data.token;
				setStorage(token);

				return createHooksReturn(false, login.data);
			}

			return createHooksReturn(true, CreateResponse(UNKNOWN_ERROR));
		}, []);

		return createHooksReturn(true, CreateResponse(UNKNOWN_ERROR));
	};

	return (
		<>
			<button
				onClick={handleLogin}
				class="border p-3 transition hover:bg-gray-200"
			>
				Login
			</button>

			{!login.isError ? JSON.stringify(login.data) : login.error.message}
		</>
	);
};

export default Login;
