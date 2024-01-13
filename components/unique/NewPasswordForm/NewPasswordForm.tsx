import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';

import { INewPasswordForm } from '@/components/unique/NewPasswordForm/types';
import Input from '@/components/common/Input/Input';
import { apiPaths } from '@/config/api';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button/Button';
import { FormLoader } from '@/components/common/FormLoader/FormLoader';
import Tooltip from '@/components/common/Tooltip/Tooltip';

export default function NewPasswordForm(props: INewPasswordForm) {
	const { t } = useTranslation();
	const router = useRouter();

	const [newPasswordOne, setNewPasswordOne] = useState('');
	const [newPasswordTwo, setNewPasswordTwo] = useState('');
	const [loading, setLoading] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [arePasswordsMatching, setArePasswordsMatching] = useState(false);
	const [showErrorOne, setShowErrorOne] = useState(false);
	const [showErrorTwo, setShowErrorTwo] = useState(false);

	const { id, code } = props;

	useEffect(() => {
		validatePassword(newPasswordOne);
		checkPasswordsMatch(newPasswordOne, newPasswordTwo);
	}, [newPasswordOne, newPasswordTwo]);

	const validatePassword = (password: string) => {
		const isValid =
			password.length >= 8 &&
			/[a-zA-Z]/.test(password) &&
			/\d/.test(password);
		setIsPasswordValid(isValid);
	};

	const checkPasswordsMatch = (password1: string, password2: string) => {
		setArePasswordsMatching(password1 === password2);
	};

	const handleSubmit = async () => {
		if (!isPasswordValid || !arePasswordsMatching) return;

		setLoading(true);
		const response = await apiPaths.resetPassword.newPassword(
			code,
			id,
			newPasswordOne
		);
		setLoading(false);
		if (!response?.data?.error) {
			router.push('/login');
		}
	};

	return (
		<form
			className={styles.formContainer}
			onSubmit={e => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<FormLoader loading={loading} />
			<div className={styles.inputContainer}>
				<Tooltip
					message={t('passwordConditions')}
					isVisible={showErrorOne}
				>
					<Input
						setValue={setNewPasswordOne}
						value={newPasswordOne}
						title={t('typeInNewPassword')}
						required={true}
						type={'password'}
						onBlur={() => setShowErrorOne(!isPasswordValid)}
						isError={showErrorOne || showErrorTwo}
						onInput={() => setShowErrorOne(false)}
						autoFocus={true}
					/>
				</Tooltip>
				<Tooltip
					message={t('passwordsNotEqual')}
					isVisible={showErrorTwo}
				>
					<Input
						setValue={setNewPasswordTwo}
						value={newPasswordTwo}
						title={t('typeInNewPasswordAgain')}
						required={true}
						type={'password'}
						onBlur={() => setShowErrorTwo(!arePasswordsMatching)}
						isError={showErrorTwo}
						onInput={() => setShowErrorTwo(false)}
					/>
				</Tooltip>
			</div>
			<div className={styles.buttonsContainer}>
				<Button
					text={t('typeIn')}
					type={'primary-orange'}
					disabled={!isPasswordValid || !arePasswordsMatching}
					submit={true}
				/>
			</div>
		</form>
	);
}
