'use client';
import React from 'react';
import style from './style.module.scss';
import Image from 'next/image';
import Logo from '@/assets/images/Logo.svg';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/config/apolloClient';
import { useRouter } from 'next/navigation';
import { useForNotAuth } from '@/components/hooks/useAuth';
import RegistrationForm from '@/components/unique/RegistrationForm/RegistrationForm';

export default function Registration() {
	const router = useRouter();
	const { showContent } = useForNotAuth(router, '/dashboard');

	return (
		showContent && (
			<ApolloProvider client={apolloClient}>
				<div className={style.registrationMainContainer}>
					<Image src={Logo} alt={'logo'} className={style.logo} />
					<RegistrationForm />
				</div>
			</ApolloProvider>
		)
	);
}
