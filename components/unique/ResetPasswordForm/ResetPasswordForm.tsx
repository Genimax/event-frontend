import React, { useEffect, useState } from 'react';
import '../../../config/i18n';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import isEmail from '@/utils/validation/isEmail';
import { isPhoneNumber } from '@/utils/validation/isPhoneNumber';
import { apiPaths } from '@/config/api';

import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button/Button';
import SMSVerificationForm from '@/components/unique/SMSVerificationForm/SMSVerificationForm';
import NewPasswordForm from '@/components/unique/NewPasswordForm/NewPasswordForm';
import { FormLoader } from '@/components/common/FormLoader/FormLoader';

export default function ResetPasswordForm() {
	const { t } = useTranslation();
	const [stage, setStage] = useState(0);
	const [field, setField] = useState<{
		type: undefined | string;
		value: string;
	}>({
		type: undefined,
		value: '',
	});
	const [getCodeStatus, setGetCodeStatus] = useState<any>();
	const [code, setCode] = useState(0);
	const [region, setRegion] = useState('RU');

	useEffect(() => {
		setField(prev => {
			let type = undefined;

			if (isEmail(prev.value)) {
				type = 'email';
			} else if (isPhoneNumber(prev.value, region)) {
				type = 'phoneNumber';
			}

			return {
				...prev,
				type,
			};
		});
	}, [field.value]);

	const handleSubmit = async () => {
		setGetCodeStatus({
			loading: true,
		});

		try {
			const response = await apiPaths.resetPassword[
				field.type === 'email' ? 'byEmail' : 'byPhone'
			](field.value);
			if (!response.data.error && stage !== 2) {
				setStage(1);
			}
			setGetCodeStatus({ loading: false, ...response.data });
		} catch (e) {
			setGetCodeStatus({ loading: false, error: e });
		}
	};

	return (
		<>
			{(stage === 0 || getCodeStatus?.error) && (
				<form
					className={styles.formContainer}
					onSubmit={e => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<FormLoader loading={getCodeStatus?.loading} />
					<h1 className={styles.title}>
						{t('resetPasswordFormTitle')}
					</h1>
					<div className={styles.inputContainer}>
						<Input
							setValue={value =>
								setField(prev => {
									return { ...prev, value };
								})
							}
							value={field.value}
							title={t('phoneOrEmail')}
							required={true}
							type={field.type}
						/>
					</div>
					{getCodeStatus?.error && (
						<p className={styles.error}>
							{getCodeStatus?.error?.response?.data?.code == '01'
								? t('userNotFound')
								: t('tooManyRequests')}
						</p>
					)}
					<div className={styles.buttonsContainer}>
						<Button
							submit={true}
							text={t('getCode')}
							type={'primary-orange'}
							disabled={!field.type}
						/>
						<Button
							text={t('loginTitle')}
							type={'secondary-orange'}
							href={'/login'}
						/>
					</div>
				</form>
			)}
			{stage === 1 && !getCodeStatus?.error && (
				<SMSVerificationForm
					customTitle={t('resetPasswordFormTitle')}
					type={'resetPassword'}
					number={field.value}
					region={region}
					dataSubmit={handleSubmit}
					submitRequestStatus={getCodeStatus}
					setStage={setStage}
					initialTimestampAfterTimeout={
						getCodeStatus?.timestampAfterTimeout
					}
					setCodeUp={setCode}
				/>
			)}
			{stage === 2 && (
				<NewPasswordForm id={getCodeStatus?.id} code={code} />
			)}
		</>
	);
}
