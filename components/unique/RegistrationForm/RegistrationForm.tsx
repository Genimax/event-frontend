import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import useRegistration from '@/components/hooks/useRegistration';
import { useRouter } from 'next/navigation';
import style from './style.module.scss';
import '../../../config/i18n';

export default function RegistrationForm() {
	const router = useRouter();
	const { t } = useTranslation();
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

	// Функции для обработки изменения данных формы
	const handleChange = (field: string) => (newValue: any) => {
		setFormData(prev => ({ ...prev, [field]: newValue }));
	};

	const handleInputError = (field: string, condition: boolean) => () => {
		setError({ [field]: condition });
	};

	return (
		<form
			autoComplete="true"
			className={style.authContainer}
			onSubmit={event => event.preventDefault()}
		>
			<h1 className={style.title}>{t('registrationFormTitle')}</h1>
			<div className={style.methods}>
				<div className={style.method}></div>
				<div className={style.method}></div>
				<div className={style.method}></div>
			</div>
			<div className={style.separator}>{t('or')}</div>
			<div className={style.inputContainer}>
				<Input
					title={t('emailAddress')}
					value={formData.email}
					setValue={handleChange('email')}
					autoFocus={true}
					type="email"
					required={true}
					isError={
						errors.email ||
						(checkEmailRequest.called &&
							!fieldsStatus.emailIsUnique)
					}
					onBlur={handleInputError('email', !fieldsStatus.email)}
					onInput={handleInputError('email', false)}
				/>

				<Input
					title={t('phoneNumber')}
					value={formData.phoneNumber}
					setValue={handleChange('phoneNumber')}
					type="phone"
					required={true}
					isError={
						errors.phoneNumber ||
						(checkPhoneRequest.called &&
							!fieldsStatus.phoneNumberIsUnique)
					}
					onBlur={handleInputError(
						'phoneNumber',
						!fieldsStatus.phoneNumber
					)}
					onInput={handleInputError('phoneNumber', false)}
				/>

				<Input
					title={t('password')}
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
					title={t('repeatPassword')}
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
	);
}
