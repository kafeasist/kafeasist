import { CustomError } from '../types/errorStack';
import { createError } from '../utils/createError';
import {
	addressValidation,
	emailValidation,
	nameValidation,
	passwordValidation,
	phoneValidation,
} from '../utils/validation';

interface InputOptions {
	value: string;
	type?: any;
	required?: boolean;
}

export interface InputsInterface {
	name?: string | InputOptions;
	last_name?: string | InputOptions;
	phone?: string | InputOptions;
	address?: string | InputOptions;
	password?: string | InputOptions;
	confirmPassword?: string | InputOptions;
	email?: string | InputOptions;
}

export const validateInputs = (inputs: InputsInterface): CustomError | void => {
	if (inputs.name) {
		let name = inputs.name as string;
		if (typeof inputs.name !== 'string') name = inputs.name.value;
		if (!nameValidation(name))
			return createError('Girilen isim kriterlere uymuyor', 'name');
	}

	if (inputs.last_name) {
		let lastName = inputs.last_name as string;
		if (typeof inputs.last_name !== 'string')
			lastName = inputs.last_name.value;
		if (!nameValidation(lastName))
			return createError(
				'Girilen soy isim kriterlere uymuyor',
				'last_name',
			);
	}

	if (inputs.phone) {
		let phone = inputs.phone as string;
		if (typeof inputs.phone !== 'string') phone = inputs.phone.value;
		if (!phoneValidation(phone))
			return createError(
				'Lütfen geçerli bir telefon numarası giriniz',
				'phone',
			);
	}

	if (inputs.address) {
		let address = inputs.address as string;
		if (typeof inputs.address !== 'string') address = inputs.address.value;
		if (!addressValidation(address))
			return createError('Lütfen geçerli bir adres giriniz', 'address');
	}

	if (inputs.password) {
		let password = inputs.password as string;
		if (typeof inputs.password !== 'string')
			password = inputs.password.value;
		if (!passwordValidation(password))
			return createError(
				'Girilen şifre 8-24 karakter uzunluğunda en az bir büyük bir küçük harf ve sayı içermelidir',
				'password',
			);

		if (inputs.confirmPassword) {
			let confirmPassword = inputs.confirmPassword as string;
			if (typeof inputs.confirmPassword !== 'string')
				confirmPassword = inputs.confirmPassword.value;
			if (password !== confirmPassword)
				return createError('Girilen şifreler birbiriyle uyuşmuyor', [
					'password',
					'confirmPassword',
				]);
		}
	}

	if (inputs.email) {
		let email = inputs.email as string;
		if (typeof inputs.email !== 'string') email = inputs.email.value;
		if (!emailValidation(email))
			return createError(
				'Lütfen geçerli bir e-posta adresi giriniz',
				'email',
			);
	}
};
