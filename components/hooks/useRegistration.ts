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
import { useMutation } from '@apollo/client';
import {
	CHECK_EMAIL_MUTATION,
	CHECK_PHONE_MUTATION,
} from '@/graphql/mutations/registration';

export default function useRegistration() {
	const [checkEmail, checkEmailRequest] = useMutation(CHECK_EMAIL_MUTATION);
	const [checkPhone, checkPhoneRequest] = useMutation(CHECK_PHONE_MUTATION);

	const [buttonActive, setButtonActive] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		phoneNumber: '',
		passwordOne: '',
		passwordTwo: '',
	});
	const [fieldsStatus, setFieldStatus] = useState({
		email: false,
		emailIsUnique: false,
		phoneNumber: false,
		phoneNumberIsUnique: false,
		passwordOne: false,
		passwordsAreEqual: false,
	});

	const [errors, setErrors] = useState({
		email: false,
		phoneNumber: false,
		passwordOne: false,
		passwordsBoth: false,
	});

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
	}, [formData, setStatus]);

	useEffect(() => {
		setButtonActive(
			fieldsStatus.email &&
				fieldsStatus.emailIsUnique &&
				fieldsStatus.phoneNumber &&
				fieldsStatus.phoneNumberIsUnique &&
				fieldsStatus.passwordOne &&
				fieldsStatus.passwordsAreEqual
		);
	}, [fieldsStatus]);

	/** Email uniqueness check */
	const fetchEmail = useCallback(async () => {
		try {
			const response = await checkEmail({
				variables: {
					email: formData.email,
				},
			});
			const result = response.data.checkUniqueEmail;
			setStatus({ emailIsUnique: result.unique });
			return result;
		} catch (error) {
			console.error(error);
		}
	}, [checkEmail, formData.email, setStatus]);

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
			const response = await checkPhone({
				variables: {
					phoneNumber: formatPhoneNumber(formData.phoneNumber, 'RU'),
					region: 'RU',
				},
			});
			const result = response.data.checkUniquePhoneNumber;
			setStatus({ phoneNumberIsUnique: result.unique });
			return result;
		} catch (error) {
			console.error(error);
		}
	}, [checkPhone, formData.phoneNumber]);

	const debouncedFetchPhone = useMemo(
		() => debounce(fetchPhone, 1000),
		[fetchPhone]
	);

	useEffect(() => {
		if (isPhoneNumber(formData.phoneNumber)) {
			debouncedFetchPhone();
		}
	}, [debouncedFetchPhone, formData.phoneNumber]);

	return {
		buttonActive,
		formData,
		setFormData,
		fieldsStatus,
		setError,
		errors,
		checkEmailRequest,
		checkPhoneRequest,
	};
}
