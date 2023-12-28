import Cookie from 'js-cookie';

export const saveNewTokens = (objectWithTokens: {
	access_token: string;
	refresh_token: string;
}) => {
	Cookie.set('access_token', objectWithTokens['access_token'], {
		expires: Number(process.env.NEXT_PUBLIC_ACCESS_TOKEN_LIFETIME || 0.01),
	});
	Cookie.set('refresh_token', objectWithTokens['refresh_token'], {
		expires: Number(process.env.NEXT_PUBLIC_REFRESH_TOKEN_LIFETIME || 7),
	});
};
