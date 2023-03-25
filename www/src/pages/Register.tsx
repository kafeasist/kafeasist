import { CreateResponse, UNKNOWN_ERROR } from '@kafeasist/responses';
import { Component, createEffect } from 'solid-js';
import { useStorage } from '../hooks/useStorage';
import { trpc } from '../lib/trpc';
import { createHooksReturn } from '../utils/createHooksReturn';

const Register: Component = () => {
	const register = trpc.auth.register.useMutation();

	const handleRegister = async () => {
		createEffect(async () => {
			await register.mutateAsync({
				email: 'testing@poopy.com',
				first_name: 'hello',
				last_name: 'testing',
				password: 'Testing123',
				passwordAgain: 'Testing123',
				phone: '1231231234',
			});

			if (register.isError)
				return createHooksReturn(true, CreateResponse(UNKNOWN_ERROR));
			if (register.data?.error)
				return createHooksReturn(true, register.data);

			if (register.data) {
				const [_, setStorage] = useStorage('SESSION');

				const token = register.data.data.token;
				setStorage(token);

				return createHooksReturn(false, register.data);
			}

			return createHooksReturn(true, CreateResponse(UNKNOWN_ERROR));
		}, []);

		return createHooksReturn(true, CreateResponse(UNKNOWN_ERROR));
	};

	return (
		<>
			<button
				onClick={handleRegister}
				class="border p-3 transition hover:bg-gray-200"
			>
				Register
			</button>

			{!register.isError
				? JSON.stringify(register.data)
				: register.error.message}
		</>
	);
};

export default Register;
