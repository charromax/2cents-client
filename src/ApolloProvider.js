import React from 'react';
import App from './App';
import {
	InMemoryCache,
	ApolloProvider,
	ApolloClient,
	ApolloLink,
} from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

const authLink = setContext((_, { headers, ...context }) => {
	const token = localStorage.getItem('jwtToken');
	return {
		headers: {
			...headers,
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		...context,
	};
});

const httpLink = createHttpLink({ uri: 'https://ur2cents.herokuapp.com/' });
const link = ApolloLink.from([authLink, httpLink]);
const client = new ApolloClient({
	link: link,
	cache: new InMemoryCache(),
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
