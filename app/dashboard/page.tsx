'use client';
import style from './style.module.scss';
import React from 'react';
import { logOut, useOnlyForAuth } from '@/components/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
	const router = useRouter();
	const { showContent } = useOnlyForAuth(router);

	return (
		showContent && (
			<div className={style.dashboardContainer}>
				<div>
					<button
						className={style.button}
						onClick={() => logOut(router)}
					>
						Выйти
					</button>
				</div>
			</div>
		)
	);
}
