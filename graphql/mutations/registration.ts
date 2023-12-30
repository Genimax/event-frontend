import { gql } from '@apollo/client';

export const CHECK_EMAIL_MUTATION = gql`
	mutation checkUniqueEmail($email: String!) {
		checkUniqueEmail(checkEmailDTO: { email: $email }) {
			unique
			field
		}
	}
`;

export const CHECK_PHONE_MUTATION = gql`
	mutation checkUniquePhoneNumber($phoneNumber: String!, $region: String!) {
		checkUniquePhoneNumber(
			checkPhoneDTO: { phoneNumber: $phoneNumber, region: $region }
		) {
			unique
			field
		}
	}
`;

export const REGISTRATION_REQUEST_CODE_MUTATION = gql`
	mutation checkUniquePhoneNumber(
		$phoneNumber: String!
		$region: String!
		$email: String!
		$password: String!
	) {
		requestVerificationCode(
			registerInput: {
				phoneNumber: $phoneNumber
				region: $region
				email: $email
				password: $password
			}
		) {
			verificationCode
			timestampAfterTimeout
		}
	}
`;

export const REGISTRATION_VERIFY_CODE_MUTATION = gql`
	mutation verifyPhoneNumber(
		$phoneNumber: String!
		$region: String!
		$code: String!
	) {
		verifyPhoneNumber(
			verifyInput: {
				phoneNumber: $phoneNumber
				region: $region
				code: $code
			}
		) {
			access_token
			refresh_token
		}
	}
`;
