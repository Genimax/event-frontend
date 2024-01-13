import axios from 'axios';

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	timeout: 10000,
	withCredentials: true,
});

export const apiPaths = {
	registration: {
		requestCode: async (phoneNumber, email, password, region) =>
			await api.post('/registration', {
				phoneNumber,
				email,
				password,
				region,
			}),
		checkCode: async (code, phoneNumber, region) =>
			await api.post('/registration/checkCode', {
				phoneNumber,
				region,
				code,
			}),
		checkUser: async (type, value) =>
			await api.post('/registration/checkUser', {
				type,
				value,
			}),
	},

	auth: {
		login: async (field, password) =>
			await api.post('/login', {
				field,
				password,
			}),
		logout: async () => await api.post('/logout'),
	},

	resetPassword: {
		byPhone: async (phoneNumber, region) =>
			await api.post('/resetPassword/byPhone', {
				phoneNumber,
				region,
			}),

		byEmail: async email =>
			await api.post('/resetPassword/byEmail', { email }),

		checkCode: async (code, id) =>
			await api.post('/resetPassword/checkCode', { code, id }),

		newPassword: async (code, id, password) =>
			await api.post('/resetPassword/newPassword', {
				code,
				id,
				password,
			}),
	},

	authCheck: {
		forLoggedIn: async () => await api.get('/authentication/forLoggedIn'),
		forLoggedOut: async () => await api.get('/authentication/forLoggedOut'),
	},
};
