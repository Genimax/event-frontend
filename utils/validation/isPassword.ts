export const passwordLengthIsOkay = (password: string) => {
	return password.length > 7;
};

export const passwordIsValid = (password: string) => {
	const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
	return passwordRegex.test(password);
};
