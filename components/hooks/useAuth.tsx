import { useEffect, useState } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { apiPaths } from '@/config/api';

export const useAuthCheck = (
	router: AppRouterInstance,
	redirectPath: string,
	secure: boolean
) => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	const request = async () => {
		try {
			const response = await apiPaths.authCheck[
				secure ? 'forLoggedIn' : 'forLoggedOut'
			]();
			const resError = response?.data?.error;
			setError(resError);
			setLoading(false);
		} catch (err) {
			setError(true);
			setLoading(false);
		}
		if (error) {
			router.push(redirectPath);
		}
	};

	useEffect(() => {
		request();
	}, []);

	useEffect(() => {
		if (error) {
			router.push(redirectPath);
		}
	}, [error]);

	const showContent = !loading && !error;
	return { showContent };
};
