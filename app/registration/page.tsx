'use client';
import React from 'react';
import style from './style.module.scss';
import Image from 'next/image';
import Logo from '@/assets/images/Logo.svg';
import { useRouter } from 'next/navigation';
import { useAuthCheck } from '@/components/hooks/useAuth';
import RegistrationForm from '@/components/unique/RegistrationForm/RegistrationForm';
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
			<div className={style.registrationMainContainer}>
				<Link className={style.logoContainer} href={'/'}>
					<Image src={Logo} alt={'logo'} className={style.logo} />
				</Link>
				<RegistrationForm />
			</div>
		)
	);
}
