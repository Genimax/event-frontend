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
