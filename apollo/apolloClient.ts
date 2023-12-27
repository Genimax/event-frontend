import {
	ApolloClient,
	InMemoryCache,
	HttpLink,
	ApolloLink,
	concat,
} from '@apollo/client';

const httpLink = new HttpLink({
	uri: process.env.NEXT_PUBLIC_BACKEND_URL + 'graphql/',
});

// Пример middleware для добавления токена аутентификации в запросы
const authMiddleware = new ApolloLink((operation, forward) => {
	// Получите токен из localStorage или другого хранилища
	const token = localStorage.getItem('token');

	// Добавьте заголовок авторизации к запросу, если токен существует
	operation.setContext({
		headers: {
			authorization: token ? `Bearer ${token}` : '',
		},
	});

	return forward(operation);
});

// Инициализируйте Apollo Client
const client = new ApolloClient({
	// Свяжите middleware с HttpLink
	link: concat(authMiddleware, httpLink),
	cache: new InMemoryCache(),
});

export default client;
