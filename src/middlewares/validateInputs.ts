import {
	INPUT_ADDRESS,
	INPUT_USERNAME,
	INPUT_EMAIL,
	INPUT_LAST_NAME,
	INPUT_NAME,
	INPUT_PASSWORD,
	INPUT_PASSWORD_MATCH,
	INPUT_PHONE,
	MFA_FAILED,
} from '../config/Responses';
import { KafeasistResponse } from '../types/ErrorStack';
import { CreateResponse } from '../utils/CreateResponse';
import {
	addressValidation,
	emailValidation,
	nameValidation,
	passwordValidation,
	phoneValidation,
	usernameValidation,
} from '../utils/validation';

interface InputOptions {
	value: string;
	type?: any;
	required?: boolean;
}

export interface InputsInterface {
	username?: string | InputOptions;
	name?: string | InputOptions;
	last_name?: string | InputOptions;
	phone?: string | InputOptions;
	address?: string | InputOptions;
	password?: string | InputOptions;
	confirmPassword?: string | InputOptions;
	email?: string | InputOptions;
	mfa?: string | InputOptions;
}

export const validateInputs = (
	inputs: InputsInterface,
): KafeasistResponse | void => {
	if (inputs.username) {
		let username = inputs.username as string;
		if (typeof inputs.username !== 'string')
			username = inputs.username.value;
		if (!usernameValidation(username))
			return CreateResponse(INPUT_USERNAME);
	}

	if (inputs.name) {
		let name = inputs.name as string;
		if (typeof inputs.name !== 'string') name = inputs.name.value;
		if (!nameValidation(name)) return CreateResponse(INPUT_NAME);
	}

	if (inputs.last_name) {
		let lastName = inputs.last_name as string;
		if (typeof inputs.last_name !== 'string')
			lastName = inputs.last_name.value;
		if (!nameValidation(lastName)) return CreateResponse(INPUT_LAST_NAME);
	}

	if (inputs.phone) {
		let phone = inputs.phone as string;
		if (typeof inputs.phone !== 'string') phone = inputs.phone.value;
		if (!phoneValidation(phone)) return CreateResponse(INPUT_PHONE);
	}

	if (inputs.address) {
		let address = inputs.address as string;
		if (typeof inputs.address !== 'string') address = inputs.address.value;
		if (!addressValidation(address)) return CreateResponse(INPUT_ADDRESS);
	}

	if (inputs.password) {
		let password = inputs.password as string;
		if (typeof inputs.password !== 'string')
			password = inputs.password.value;
		if (!passwordValidation(password))
			return CreateResponse(INPUT_PASSWORD);

		if (inputs.confirmPassword) {
			let confirmPassword = inputs.confirmPassword as string;
			if (typeof inputs.confirmPassword !== 'string')
				confirmPassword = inputs.confirmPassword.value;
			if (password !== confirmPassword)
				return CreateResponse(INPUT_PASSWORD_MATCH);
		}
	}

	if (inputs.email) {
		let email = inputs.email as string;
		if (typeof inputs.email !== 'string') email = inputs.email.value;
		if (!emailValidation(email)) return CreateResponse(INPUT_EMAIL);
	}

	if (inputs.mfa) {
		let code = inputs.mfa as string;
		if (!code || code.length !== 6 || !/^\d+$/.test(code))
			return CreateResponse(MFA_FAILED);
	}
};
