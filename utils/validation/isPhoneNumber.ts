import libphonenumber, { PhoneNumberFormat } from 'google-libphonenumber';
import { config } from '@/config/smsCode/config';

export const isPhoneNumber = (phoneNumber: string, region = 'RU'): boolean => {
	if (!config.supportedRegions.includes(region)) {
		return false;
	}
	const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
	try {
		const number = phoneUtil.parseAndKeepRawInput(phoneNumber, region);
		return phoneUtil.isValidNumber(number);
	} catch (e) {
		return false;
	}
};

export const formatPhoneNumber = (
	phoneNumber: string,
	region = 'RU'
): string | null => {
	const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

	try {
		const number = phoneUtil.parse(phoneNumber, region);
		return phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL);
	} catch (e) {
		console.error(e);
		return null;
	}
};
