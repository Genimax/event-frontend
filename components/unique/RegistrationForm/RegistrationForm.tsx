import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import useRegistration from '@/components/hooks/useRegistration';
import { useRouter } from 'next/navigation';
import style from './style.module.scss';
import '../../../config/i18n';
import SMSVerificationForm from '@/components/unique/SMSVerificationForm/SMSVerificationForm';
import { throttle } from '@/utils/throttle';
import { FormLoader } from '@/components/common/FormLoader/FormLoader';
import { apiPaths } from '@/config/api';
import { formatPhoneNumber } from '@/utils/validation/isPhoneNumber';
import Tooltip from '@/components/common/Tooltip/Tooltip';

export default function RegistrationForm() {
	const router = useRouter();
	const { t } = useTranslation();
	const [stage, setStage] = useState(0);
	const [requestGetCodeStatus, setRequestGetCodeStatus] = useState<any>({
		loading: false,
	});

	const {
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
				setRequestGetCodeStatus({ loading: true });

				const response = await apiPaths.registration.requestCode(
					formatPhoneNumber(formData.phoneNumber, formData.region),
					formData.email,
					formData.passwordOne,
					formData.region
				);
				const data = response.data;
				setRequestGetCodeStatus({ loading: false, ...data });
				setNextTimestamp(data?.timestampAfterTimeout);
				alert(data?.verificationCode);

				if (!data.error) {
					setStage(1);
				}
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
						<Tooltip
							message={
								!fieldsStatus.emailIsUnique
									? t('tryOtherEmail')
									: t('wrongEmail')
							}
							isVisible={
								!fieldsStatus.emailIsUnique || errors.email
							}
						>
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
									errors.email || !fieldsStatus.emailIsUnique
								}
								onBlur={() =>
									handleInputError(
										'email',
										!fieldsStatus.email
									)()
								}
								onInput={() => {
									handleInputError('email', false)();
								}}
							/>
						</Tooltip>
						<Tooltip
							message={
								!fieldsStatus.phoneNumberIsUnique
									? t('tryOtherPhone')
									: t('wrongPhone')
							}
							isVisible={
								!fieldsStatus.phoneNumberIsUnique ||
								errors.phoneNumber
							}
						>
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
									!fieldsStatus.phoneNumberIsUnique
								}
								onBlur={() =>
									handleInputError(
										'phoneNumber',
										!fieldsStatus.phoneNumber
									)()
								}
								onInput={() =>
									handleInputError('phoneNumber', false)()
								}
							/>
						</Tooltip>

						<Tooltip
							message={t('passwordConditions')}
							isVisible={errors.passwordOne}
						>
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
								isError={
									errors.passwordOne || errors.passwordsBoth
								}
								onBlur={() =>
									handleInputError(
										'passwordOne',
										!fieldsStatus.passwordOne
									)()
								}
								onInput={() =>
									handleInputError('passwordOne', false)()
								}
							/>
						</Tooltip>
						<Tooltip
							message={t('passwordsNotEqual')}
							isVisible={errors.passwordsBoth}
						>
							<Input
								placeholder={
									!formData.passwordTwo &&
									errors.passwordsBoth
										? t('fieldEmpty')
										: ''
								}
								title={t('repeatPassword') + ' *'}
								value={formData.passwordTwo}
								setValue={handleChange('passwordTwo')}
								type="password"
								required={true}
								isError={errors.passwordsBoth}
								onBlur={() =>
									handleInputError(
										'passwordsBoth',
										!fieldsStatus.passwordsAreEqual
									)()
								}
								onInput={() =>
									handleInputError('passwordsBoth', false)()
								}
							/>
						</Tooltip>
					</div>
					{requestGetCodeStatus?.error &&
						requestGetCodeStatus?.code.includes('02') && (
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
					submitRequestStatus={requestGetCodeStatus}
					setStage={setStage}
				/>
			)}
		</>
	);
}
