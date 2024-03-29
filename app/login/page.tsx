'use client';
import React from 'react';
import style from './style.module.scss';
import LoginForm from '@/components/unique/LoginForm/LoginForm';
import Image from 'next/image';
import Logo from '@/assets/images/Logo.svg';
import { useRouter } from 'next/navigation';
import { useAuthCheck } from '@/components/hooks/useAuth';
import Link from 'next/link';
import { authConfig } from '@/config/authConfig';

export default function Login() {
	const router = useRouter();
	const { showContent } = useAuthCheck(
		router,
		authConfig.routeForAuthRedirect,
		false
	);

	return (
		showContent && (
			<div className={style.loginMainContainer}>
				<Link className={style.logoContainer} href={'/'}>
					<Image src={Logo} alt={'logo'} className={style.logo} />
				</Link>
				<LoginForm />
			</div>
		)
	);
}
