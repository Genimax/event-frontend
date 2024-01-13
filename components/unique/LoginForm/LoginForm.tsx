import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import '../../../config/i18n';

import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import isEmail from '@/utils/validation/isEmail';
import {
	formatPhoneNumber,
	isPhoneNumber,
} from '@/utils/validation/isPhoneNumber';
import style from './style.module.scss';

import { throttle } from '@/utils/throttle';
import { FormLoader } from '@/components/common/FormLoader/FormLoader';
import Link from 'next/link';
import { apiPaths } from '@/config/api';
import Tooltip from '@/components/common/Tooltip/Tooltip';
import ArrowButton from '@/components/common/ArrowButton/ArrowButton';

export default function LoginForm() {
	const router = useRouter();
	const { t } = useTranslation();
	const [stage, setStage] = useState(0);
	const [field, setField] = useState('');
	const [password, setPassword] = useState('');
	const [buttonActive, setButtonActive] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

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
		setLoading(true);
		const newField = isEmail(field)
			? field
			: {
					phoneNumber: formatPhoneNumber(field, 'RU'),
					region: 'RU',
			  };

		try {
			await apiPaths.auth.login(newField, password);
			router.push('/profile');
		} catch (e) {
			console.error('Login error: ', e);
			setError(true);
		}
		setLoading(false);
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
			<FormLoader loading={loading} />
			<h1 className={style.title}>{t('loginTitle')}</h1>
			{stage === 0 && (
				<Input
					title={t('phoneOrEmail')}
					value={field}
					setValue={setField}
					onInput={() => setError(false)}
					autoFocus
				/>
			)}
			{stage === 1 && (
				<Tooltip message={t('wrongCredentials')} isVisible={error}>
					<Input
						type="password"
						title={t('password')}
						value={password}
						setValue={setPassword}
						onInput={() => setError(false)}
						autoFocus
					/>
				</Tooltip>
			)}
			<Link className={style.forgotPassword} href={'/reset-password'}>
				{t('forgotResetAccess')}
			</Link>
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
			{stage === 1 && <ArrowButton onClick={() => setStage(0)} />}
		</form>
	);
}
