import { gql } from '@apollo/client';

export const LOGIN_BY_EMAIL_MUTATION = gql`
	mutation LoginByEmail($email: String!, $password: String!) {
		loginByEmail(loginUserInput: { email: $email, password: $password }) {
			access_token
			refresh_token
		}
	}
`;

export const LOGIN_BY_PHONE_MUTATION = gql`
	mutation loginWithPhone(
		$phoneNumber: String!
		$password: String!
		$region: String!
	) {
		loginWithPhone(
			loginByPhoneUserInput: {
				phoneNumber: $phoneNumber
				password: $password
				region: $region
			}
		) {
			access_token
			refresh_token
		}
	}
`;
