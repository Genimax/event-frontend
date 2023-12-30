import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import useRegistration from '@/components/hooks/useRegistration';
import { useRouter } from 'next/navigation';
import style from './style.module.scss';
import '../../../config/i18n';
import SMSVerificationForm from '@/components/unique/SMSVerificationForm/SMSVerificationForm';
import { useMutation } from '@apollo/client';
import { REGISTRATION_REQUEST_CODE_MUTATION } from '@/graphql/mutations/registration';
import { throttle } from '@/utils/throttle';
import { FormLoader } from '@/components/common/FormLoader/FormLoader';

export default function RegistrationForm() {
	const router = useRouter();
	const { t } = useTranslation();
	const [stage, setStage] = useState(0);
	const [getCode, requestGetCodeStatus] = useMutation(
		REGISTRATION_REQUEST_CODE_MUTATION
	);
	const {
		checkEmailRequest,
		checkPhoneRequest,
		setError,
		errors,
		fieldsStatus,
		formData,
		setFormData,
		buttonActive,
	} = useRegistration();
	const [nextTimestamp, setNextTimestamp] = useState(0);

	// Функции для обработки изменения данных формы
	const handleChange = (field: string) => (newValue: any) => {
		setFormData(prev => ({ ...prev, [field]: newValue }));
	};

	const handleInputError = (field: string, condition: boolean) => () => {
		setError({ [field]: condition });
	};

	const handleSubmit = useCallback(
		async (event?: React.FormEvent<HTMLFormElement>) => {
			if (event) {
				event.preventDefault();
			}
			if (!requestGetCodeStatus.loading) {
				const response = await getCode({
					variables: {
						email: formData.email,
						phoneNumber: formData.phoneNumber,
						password: formData.passwordOne && formData.passwordTwo,
						region: formData.region,
					},
				});
				const data = response.data?.requestVerificationCode;
				console.log(data);
				setNextTimestamp(data?.timestampAfterTimeout);
				alert(data?.verificationCode);
				setStage(1);
				console.log(requestGetCodeStatus);
			}
		},
		[formData, requestGetCodeStatus]
	);
	const throttledHandleSubmit = throttle(handleSubmit, 1000);

	return (
		<>
			{stage === 0 && (
				<form
					name={'registration'}
					autoComplete="true"
					className={style.authContainer}
					onSubmit={e => {
						e.preventDefault();
						throttledHandleSubmit();
					}}
				>
					<FormLoader loading={requestGetCodeStatus.loading} />
					<h1 className={style.title}>
						{t('registrationFormTitle')}
					</h1>
					<div className={style.methods}>
						<div className={style.method}></div>
						<div className={style.method}></div>
						<div className={style.method}></div>
					</div>
					<div className={style.separator}>{t('or')}</div>
					<div className={style.inputContainer}>
						<Input
							placeholder={
								!formData.email && errors.email
									? t('fieldEmpty')
									: ''
							}
							title={t('emailAddress') + ' *'}
							value={formData.email}
							setValue={handleChange('email')}
							autoFocus={true}
							type="email"
							required={true}
							isError={
								errors.email ||
								(checkEmailRequest.called &&
									!checkEmailRequest.loading &&
									!fieldsStatus.emailIsUnique)
							}
							onBlur={handleInputError(
								'email',
								!fieldsStatus.email
							)}
							onInput={handleInputError('email', false)}
						/>

						<Input
							placeholder={
								!formData.phoneNumber && errors.phoneNumber
									? t('fieldEmpty')
									: ''
							}
							title={t('phoneNumber') + ' *'}
							value={formData.phoneNumber}
							setValue={handleChange('phoneNumber')}
							type="phone"
							required={true}
							isError={
								errors.phoneNumber ||
								(checkPhoneRequest.called &&
									!checkPhoneRequest.loading &&
									!fieldsStatus.phoneNumberIsUnique)
							}
							onBlur={handleInputError(
								'phoneNumber',
								!fieldsStatus.phoneNumber
							)}
							onInput={handleInputError('phoneNumber', false)}
						/>

						<Input
							placeholder={
								!formData.passwordOne && errors.passwordOne
									? t('fieldEmpty')
									: ''
							}
							title={t('password') + ' *'}
							value={formData.passwordOne}
							setValue={handleChange('passwordOne')}
							type="password"
							required={true}
							isError={errors.passwordOne || errors.passwordsBoth}
							onBlur={handleInputError(
								'passwordOne',
								!fieldsStatus.passwordOne
							)}
							onInput={handleInputError('passwordOne', false)}
						/>

						<Input
							placeholder={
								!formData.passwordTwo && errors.passwordsBoth
									? t('fieldEmpty')
									: ''
							}
							title={t('repeatPassword') + ' *'}
							value={formData.passwordTwo}
							setValue={handleChange('passwordTwo')}
							type="password"
							required={true}
							isError={errors.passwordsBoth}
							onBlur={handleInputError(
								'passwordsBoth',
								!fieldsStatus.passwordsAreEqual
							)}
							onInput={handleInputError('passwordsBoth', false)}
						/>
					</div>
					{requestGetCodeStatus?.error?.message.includes('-04-') && (
						<div className={style.error}>
							{t('tooManyRequests')}
						</div>
					)}
					<div className={style.buttonsContainer}>
						<Button
							text={t('toRegistration')}
							submit={true}
							onClick={() => {}}
							type="primary-orange"
							disabled={!buttonActive}
						/>
						<Button
							text={t('haveAnAccountEnter')}
							type="secondary-orange"
							onClick={() => router.push('/login')}
						/>
					</div>
				</form>
			)}
			{stage === 1 && (
				<SMSVerificationForm
					number={formData.phoneNumber || '+79963789005'}
					region={formData.region}
					dataSubmit={() => handleSubmit()}
					initialTimestampAfterTimeout={nextTimestamp}
				/>
			)}
		</>
	);
}
