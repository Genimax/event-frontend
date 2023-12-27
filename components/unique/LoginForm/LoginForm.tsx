import Input from '@/components/common/Input/Input';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Cookie from 'js-cookie';

import Button from '@/components/common/Button/Button';

import style from './style.module.scss';
import '../../../config/i18n';

import isEmail from '@/utils/validation/isEmail';
import {
	formatPhoneNumber,
	isPhoneNumber,
} from '@/utils/validation/isPhoneNumber';
import { useMutation } from '@apollo/client';
import {
	LOGIN_BY_EMAIL_MUTATION,
	LOGIN_BY_PHONE_MUTATION,
} from '@/graphql/mutations/login';

export default function LoginForm() {
	const { t } = useTranslation();
	const [stage, setStage] = useState(0);

	const [field, setField] = useState('');
	const [password, setPassword] = useState('');

	const [buttonActive, setButtonActive] = useState(false);

	const [loginByEmail, requestEmail] = useMutation(LOGIN_BY_EMAIL_MUTATION);
	const [loginWithPhone, requestPhone] = useMutation(LOGIN_BY_PHONE_MUTATION);

	const handleLogin = async () => {
		try {
			let response;
			if (isEmail(field)) {
				response = (
					await loginByEmail({
						variables: {
							email: field,
							password,
						},
					})
				).data?.loginByEmail;
			} else if (isPhoneNumber(field)) {
				response = (
					await loginWithPhone({
						variables: {
							phoneNumber: formatPhoneNumber(field, 'RU'),
							password,
							region: 'RU',
						},
					})
				).data?.loginWithPhone;
			}
			Cookie.set('access_token', response['access_token']);
			Cookie.set('refresh_token', response['refresh_token']);
		} catch (e) {
			console.error('Login error:', e);
		}
	};

	const nextAction = () => {
		if (stage === 0) {
			setStage(1);
		}
		if (stage === 1) {
			handleLogin();
		}
	};

	useEffect(() => {
		setButtonActive(
			(stage === 0 && (isEmail(field) || isPhoneNumber(field))) ||
				(stage === 1 && password.length >= 8)
		);
	}, [field, password, stage]);

	return (
		<form
			className={style.authContainer}
			onKeyDown={e => {
				if (e.key === 'Enter' && buttonActive) {
					e.preventDefault();
					nextAction();
				}
			}}
		>
			<h1 className={style.title}>{t('loginTitle')}</h1>
			<div className={style.methods}>
				<div className={style.method}></div>
				<div className={style.method}></div>
				<div className={style.method}></div>
			</div>
			<div className={style.separator}>{t('or')}</div>
			{stage === 0 && (
				<Input
					title={t('phoneOrEmail')}
					value={field}
					setValue={setField}
					placeholder=""
					autoFocus={true}
				/>
			)}
			{stage === 1 && (
				<div className={style.fadeIn}>
					<Input
						type={'password'}
						title={t('password')}
						value={password}
						setValue={setPassword}
						autoFocus={true}
					/>
				</div>
			)}
			<a className={style.forgotPassword} href="/">
				{t('forgotResetAccess')}
			</a>
			<div className={style.buttonsContainer}>
				<Button
					text={t('enter')}
					submit={stage === 1}
					type="primary-orange"
					onClick={nextAction}
					disabled={!buttonActive}
				/>
				<Button
					text={t('toRegistration')}
					type="secondary-orange"
					onClick={() => {}}
				/>
			</div>
		</form>
	);
}
