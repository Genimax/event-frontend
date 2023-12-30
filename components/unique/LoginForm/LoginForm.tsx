import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import { useMutation } from '@apollo/client';
import {
	LOGIN_BY_EMAIL_MUTATION,
	LOGIN_BY_PHONE_MUTATION,
} from '@/graphql/mutations/login';
import isEmail from '@/utils/validation/isEmail';
import {
	formatPhoneNumber,
	isPhoneNumber,
} from '@/utils/validation/isPhoneNumber';
import { saveNewTokens } from '@/utils/saveNewTokens';
import { useRouter } from 'next/navigation';
import style from './style.module.scss';
import '../../../config/i18n';
import { throttle } from '@/utils/throttle';
import { FormLoader } from '@/components/common/FormLoader/FormLoader';

export default function LoginForm() {
	const router = useRouter();
	const { t } = useTranslation();
	const [stage, setStage] = useState(0);
	const [field, setField] = useState('');
	const [password, setPassword] = useState('');
	const [buttonActive, setButtonActive] = useState(false);

	const [loginByEmail, emailRequest] = useMutation(LOGIN_BY_EMAIL_MUTATION);
	const [loginWithPhone, phoneRequest] = useMutation(LOGIN_BY_PHONE_MUTATION);

	const isFieldValid = () => isEmail(field) || isPhoneNumber(field);
	const isPasswordValid = () => password.length >= 8;

	useEffect(() => {
		if (stage === 0) {
			setButtonActive(isFieldValid());
		} else if (stage === 1) {
			setButtonActive(isPasswordValid());
		}
	}, [field, password, stage]);

	const handleLogin = async () => {
		try {
			const response = await (isEmail(field)
				? loginByEmail({ variables: { email: field, password } })
				: loginWithPhone({
						variables: {
							phoneNumber: formatPhoneNumber(field, 'RU'),
							password,
							region: 'RU',
						},
				  }));
			saveNewTokens(
				response.data?.[
					isEmail(field) ? 'loginByEmail' : 'loginWithPhone'
				]
			);
			router.push('/dashboard');
		} catch (e) {
			console.error('Login error:', e);
		}
	};

	const throttledLogin = useCallback(
		throttle(() => handleLogin(), 1000),
		[field, password]
	);

	const nextAction = () => {
		if (stage === 0 && isFieldValid()) {
			setStage(1);
		} else if (stage === 1 && isPasswordValid()) {
			throttledLogin();
		}
	};

	return (
		<form
			autoComplete="true"
			className={style.authContainer}
			onSubmit={e => {
				e.preventDefault();
				nextAction();
			}}
		>
			<FormLoader
				loading={emailRequest.loading || phoneRequest.loading}
			/>
			<h1 className={style.title}>{t('loginTitle')}</h1>
			{stage === 0 && (
				<Input
					title={t('phoneOrEmail')}
					value={field}
					setValue={setField}
					autoFocus
				/>
			)}
			{stage === 1 && (
				<Input
					type="password"
					title={t('password')}
					value={password}
					setValue={setPassword}
					autoFocus
				/>
			)}
			<a className={style.forgotPassword} href="/">
				{t('forgotResetAccess')}
			</a>
			<div className={style.buttonsContainer}>
				<Button
					text={t('enter')}
					submit={true}
					type="primary-orange"
					disabled={!buttonActive}
				/>
				<Button
					text={t('toRegistration')}
					type="secondary-orange"
					onClick={() => router.push('/registration')}
				/>
			</div>
		</form>
	);
}
