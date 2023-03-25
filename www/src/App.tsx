import { QueryClientProvider, QueryClient } from '@tanstack/solid-query';
import { trpc } from './lib/trpc';
import type { Component } from 'solid-js';
import { Routes, Route } from 'solid-app-router';
import { httpBatchLink } from '@trpc/client';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

const queryClient = new QueryClient();

const client = trpc.createClient({
	links: [
		httpBatchLink({
			url: import.meta.env.VITE_API_URL,
		}),
	],
});

const App: Component = () => {
	return (
		<AuthProvider
			isAuth={false}
			user={{
				id: 0,
				firstName: '',
				lastName: '',
				email: '',
				phone: '',
				verified: false,
				subsType: 0,
			}}
		>
			<trpc.Provider client={client} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					<Routes>
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
					</Routes>
				</QueryClientProvider>
			</trpc.Provider>
		</AuthProvider>
	);
};

export default App;
