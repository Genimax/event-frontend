import { useCallback, useEffect, useState } from 'react';
import { refreshToken, isTokenValid } from '@/utils/api';
import { router } from 'next/client';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Cookies from 'js-cookie';

export const useOnlyForAuth = (router: AppRouterInstance) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	const verifyAndRefreshToken = useCallback(async () => {
		setLoading(true);
		if (!isTokenValid('access_token')) {
			try {
				await refreshToken();
				setLoggedIn(true);
			} catch (error) {
				console.error('Error refreshing token:', error);
				setLoggedIn(false);
				router.push('/login');
			}
		} else {
			setLoggedIn(true);
		}
		setLoading(false);
	}, [router]);

	useEffect(() => {
		verifyAndRefreshToken();
	}, [verifyAndRefreshToken]);

	const showContent = !loading && loggedIn;
	return { showContent };
};

export const useForNotAuth = (
	router: AppRouterInstance,
	redirectUrl: string
) => {
	const [loggedIn, setLoggedIn] = useState(true);
	const [loading, setLoading] = useState(true);

	const verifyAndHandleToken = useCallback(async () => {
		setLoading(true);
		if (!isTokenValid('access_token')) {
			try {
				await refreshToken();
				setLoggedIn(true);
				router.push(redirectUrl);
			} catch (error) {
				setLoggedIn(false);
			}
		} else {
			setLoggedIn(true);
			router.push(redirectUrl);
		}
		setLoading(false);
	}, [router, redirectUrl]);

	useEffect(() => {
		verifyAndHandleToken();
	}, [verifyAndHandleToken]);

	const showContent = !loading && !loggedIn;
	return { showContent };
};

export const logOut = async (router: AppRouterInstance) => {
	Cookies.remove('access_token');
	Cookies.remove('refresh_token');
	router.push('/login');
};
