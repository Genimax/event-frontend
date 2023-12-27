'use client';

import React from 'react';
import style from './style.module.scss';

import LoginForm from '@/components/unique/LoginForm/LoginForm';
import Image from 'next/image';

import Logo from '@/assets/images/Logo.svg';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/apollo/apolloClient';

export default function Login() {
	return (
		<ApolloProvider client={apolloClient}>
			<div className={style.loginMainContainer}>
				<Image src={Logo} alt={'logo'} className={style.logo} />
				<LoginForm />
			</div>
		</ApolloProvider>
	);
}
