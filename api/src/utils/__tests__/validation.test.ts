import {
	emailValidation,
	nameValidation,
	passwordValidation,
	phoneValidation,
	usernameValidation,
} from '../validation';
import { expect } from 'chai';

describe('validation util function', () => {
	it('username validation', () => {
		const succeed = [
			'username123',
			'testusername',
			'123username',
			'user_name',
			'user.name',
		];

		const fail = [
			'@username',
			'user-name',
			'_123_456_',
			'_testing_user',
			'test',
			'123',
			'________',
			'._username_.',
			'toolongusername123toolongusername123',
		];

		succeed.forEach((username) =>
			expect(usernameValidation(username)).equal(true),
		);
		fail.forEach((username) =>
			expect(usernameValidation(username)).equal(false),
		);
	});

	it('name validation', async () => {
		const succeed = [
			'Test',
			'Testing',
			'user',
			'name',
			'nameUser',
			'username',
			"te'st",
		];

		const fail = [
			'_test',
			'@User',
			'test.',
			'a',
			'123123',
			'toolongnamecantevenfitthestring',
			'na.me',
		];

		succeed.forEach((name) => expect(nameValidation(name)).equal(true));
		fail.forEach((name) => expect(nameValidation(name)).equal(false));
	});

	it('phone validation', async () => {
		const succeed = [
			'123 123 1212',
			'+90 555 555 5555',
			'(111) 111 1111',
			'+90 (123) 123 1212',
			'123-123-1212',
			'+90 (123) 123-1212',
			'123.123.1212',
		];

		const fail = [
			'123 123 123 123',
			'+91 555 555 5555',
			'a',
			'testing',
			'(555) 555 55 55',
			'+90 (555) 55 555 55',
			'+1 (123) 123 1212',
			'123 123 1212a',
		];

		succeed.forEach((phone) => expect(phoneValidation(phone)).equal(true));
		fail.forEach((phone) => expect(phoneValidation(phone)).equal(false));
	});

	it('email validation', async () => {
		const succeed = [
			'test@test.com',
			'testing@t.com',
			'foo@bar.xyz',
			'a@b.c',
		];

		const fail = [
			'test',
			'test@.com',
			'username@password',
			'root@toor.',
			'@hotmail.com',
		];

		succeed.forEach((email) => expect(emailValidation(email)).equal(true));
		fail.forEach((email) => expect(emailValidation(email)).equal(false));
	});

	it('password validation', async () => {
		const succeed = [
			'Password123',
			'ThisIsAStrongPass1',
			'passwordValidation123',
		];

		const fail = [
			'password',
			'easypass',
			'test',
			'ThisIsALongAssPassword123',
			'strongbutnotenough',
			'needuppercase123',
			'NeeDNumbeR',
		];

		succeed.forEach((pass) => expect(passwordValidation(pass)).equal(true));
		fail.forEach((pass) => expect(passwordValidation(pass)).equal(false));
	});
});
