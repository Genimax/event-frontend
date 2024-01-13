'use client';
import style from './style.module.scss';
import React from 'react';
import { useAuthCheck } from '@/components/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { apiPaths } from '@/config/api';
import { authConfig } from '@/config/authConfig';

export default function Profile() {
	const router = useRouter();
	const { showContent } = useAuthCheck(
		router,
		authConfig.routeForNotAuthRedirect,
		true
	);

	const exitHandle = async () => {
		try {
			await apiPaths.auth.logout();
			router.push(authConfig.routeForNotAuthRedirect);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		showContent && (
			<div className={style.dashboardContainer}>
				<div>
					<button className={style.button} onClick={exitHandle}>
						Выйти
					</button>
				</div>
			</div>
		)
	);
}
