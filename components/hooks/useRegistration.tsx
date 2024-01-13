import { useCallback, useEffect, useMemo, useState } from 'react';

import isEmail from '@/utils/validation/isEmail';
import {
	formatPhoneNumber,
	isPhoneNumber,
} from '@/utils/validation/isPhoneNumber';
import {
	passwordIsValid,
	passwordLengthIsOkay,
} from '@/utils/validation/isPassword';
import { debounce } from '@/utils/debounce';
import { apiPaths } from '@/config/api';

export default function useRegistration() {
	const [buttonActive, setButtonActive] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		phoneNumber: '',
		passwordOne: '',
		passwordTwo: '',
		region: 'RU',
	});
	const [fieldsStatus, setFieldStatus] = useState({
		email: false,
		emailIsUnique: true,
		phoneNumber: false,
		phoneNumberIsUnique: true,
		passwordOne: false,
		passwordsAreEqual: false,
	});

	const [errors, setErrors] = useState({
		email: false,
		phoneNumber: false,
		passwordOne: false,
		passwordsBoth: false,
	});

	const [emailChecked, setEmailChecked] = useState(false);
	const [phoneChecked, setPhoneChecked] = useState(false);

	const setError = useCallback((valueKey: { [key: string]: any }) => {
		setErrors(prev => ({
			...prev,
			...valueKey,
		}));
	}, []);

	const setStatus = useCallback((valueKey: { [key: string]: any }) => {
		setFieldStatus(prev => ({
			...prev,
			...valueKey,
		}));
	}, []);

	/** Button Basic Check and Status Update */
	useEffect(() => {
		const { email, phoneNumber, passwordOne, passwordTwo } = formData;
		setStatus({
			email: isEmail(email),
			phoneNumber: isPhoneNumber(phoneNumber),
			passwordOne:
				passwordIsValid(passwordOne) &&
				passwordLengthIsOkay(passwordOne),
			passwordsAreEqual: passwordOne === passwordTwo,
		});
	}, [formData, errors]);

	useEffect(() => {
		setButtonActive(
			fieldsStatus.email &&
				fieldsStatus.emailIsUnique &&
				fieldsStatus.phoneNumber &&
				fieldsStatus.phoneNumberIsUnique &&
				fieldsStatus.passwordOne &&
				fieldsStatus.passwordsAreEqual &&
				emailChecked &&
				phoneChecked
		);
	}, [fieldsStatus]);

	/** Email uniqueness check */
	const fetchEmail = useCallback(async () => {
		try {
			const response = await apiPaths.registration.checkUser(
				'email',
				formData.email
			);
			const result = response.data;
			setStatus({ emailIsUnique: result.unique });
			setEmailChecked(true);
			return result;
		} catch (error) {
			console.log(error);
			setEmailChecked(true);
		}
	}, [formData.email]);

	const debouncedFetchEmail = useMemo(
		() => debounce(fetchEmail, 1000),
		[fetchEmail]
	);

	useEffect(() => {
		if (isEmail(formData.email)) {
			debouncedFetchEmail();
		}
	}, [debouncedFetchEmail, formData.email]);

	/** Phone number uniqueness check */
	const fetchPhone = useCallback(async () => {
		try {
			const response = await apiPaths.registration.checkUser(
				'phoneNumber',
				{
					phoneNumber: formatPhoneNumber(
						formData.phoneNumber,
						formData.region
					),
					region: formData.region,
				}
			);
			const result = response.data;
			setStatus({ phoneNumberIsUnique: result.unique });
			setPhoneChecked(true);
			return result;
		} catch (error) {
			console.log(error);
			setPhoneChecked(true);
		}
	}, [formData.phoneNumber]);

	const debouncedFetchPhone = useMemo(
		() => debounce(fetchPhone, 1000),
		[fetchPhone]
	);

	useEffect(() => {
		if (isPhoneNumber(formData.phoneNumber)) {
			debouncedFetchPhone();
		}
	}, [debouncedFetchPhone, formData.phoneNumber]);

	useEffect(() => setEmailChecked(false), [formData.email]);
	useEffect(() => setPhoneChecked(false), [formData.phoneNumber]);

	return {
		buttonActive,
		formData,
		setFormData,
		fieldsStatus,
		setError,
		errors,
		emailChecked,
		phoneChecked,
	};
}
