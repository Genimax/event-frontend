'use client';
import React from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';
import Logo from '@/assets/images/Logo.svg';
import { useRouter } from 'next/navigation';
import { useAuthCheck } from '@/components/hooks/useAuth';

import ResetPasswordForm from '@/components/unique/ResetPasswordForm/ResetPasswordForm';
import Link from 'next/link';
import { authConfig } from '@/config/authConfig';

export default function Registration() {
	const router = useRouter();
	const { showContent } = useAuthCheck(
		router,
		authConfig.routeForAuthRedirect,
		false
	);

	return (
		showContent && (
			<div className={styles.registrationMainContainer}>
				<Link href={'/'} className={styles.logoContainer}>
					<Image src={Logo} alt={'logo'} className={styles.logo} />
				</Link>
				<ResetPasswordForm />
			</div>
		)
	);
}
