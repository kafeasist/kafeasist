import { QueryClientProvider, QueryClient } from '@tanstack/solid-query';
import { trpc } from './services/trpc';
import type { Component } from 'solid-js';
import { Routes, Route } from 'solid-app-router';
import Home from './pages/Home';
import { httpBatchLink } from '@trpc/client';

const queryClient = new QueryClient();

const client = trpc.createClient({
	links: [
		httpBatchLink({
			url: 'http://localhost:8000/api',
		}),
	],
});

const App: Component = () => {
	return (
		<trpc.Provider client={client} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path="/home" component={Home} />
				</Routes>
			</QueryClientProvider>
		</trpc.Provider>
	);
};

export default App;
