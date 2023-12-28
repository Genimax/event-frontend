import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const isTokenValid = tokenName => {
	try {
		const token = Cookies.get()[tokenName];
		const decodedToken = jwtDecode(token);
		const currentTime = Date.now() / 1000;

		return decodedToken.exp > currentTime;
	} catch (e) {
		return false;
	}
};

export const refreshToken = async () => {
	if (isTokenValid('refresh_token')) {
		// Запрос на обновление обоих токенов
	} else {
		throw new Error('Error during refresh token validation');
	}
	// Запрос к серверу для получения нового access_token используя refresh_token
	// Возвращаем новый access_token
};
