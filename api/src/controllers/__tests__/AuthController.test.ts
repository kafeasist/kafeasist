import 'module-alias/register';
import {
	ForgotPasswordParams,
	LoginParams,
	RegisterParams,
	ResetPasswordParams,
} from '../AuthController';
import { assert } from 'chai';
import { TestFactory } from '../../utils/TestFactory';
import {
	ACCOUNT_CREATED,
	ALREADY_IN_USE,
	AUTH_ERROR,
	FAILED_FORGOT_PASSWORD,
	INPUT_EMAIL,
	INPUT_LAST_NAME,
	INPUT_NAME,
	INPUT_PASSWORD,
	INPUT_PASSWORD_MATCH,
	INPUT_PHONE,
	NOT_AUTH_ERROR,
	PASSWORD_CHANGED,
	SAME_PASSWORD,
	SUCCESSFUL_FORGOT_PASSWORD,
	SUCCESSFUL_LOGIN,
	SUCCESSFUL_LOGOUT,
	USERNAME_OR_PASSWORD_NOT_FOUND,
} from '../../config/Responses';

describe('TESTING /api/auth', () => {
	const factory: TestFactory = new TestFactory();

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});

	const registerOptions: RegisterParams = {
		first_name: 'Test',
		last_name: 'Test',
		email: 'test@test.com',
		password: '123Test123',
		passwordAgain: '123Test123',
		phone: '0000000000',
	};

	describe('POST /register', () => {
		it('registers new user', (done) => {
			factory.app
				.post('/api/auth/register')
				.send(registerOptions)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.message === ACCOUNT_CREATED.message);
					return done();
				});
		});

		it('errors first_name', (done) => {
			factory.app
				.post('/api/auth/register')
				.send({
					...registerOptions,
					first_name: 'a',
				})
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === INPUT_NAME.message);
					return done();
				});
		});

		it('errors last_name', (done) => {
			factory.app
				.post('/api/auth/register')
				.send({
					...registerOptions,
					last_name: 'a',
				})
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === INPUT_LAST_NAME.message);
					return done();
				});
		});

		it('errors email', (done) => {
			factory.app
				.post('/api/auth/register')
				.send({
					...registerOptions,
					email: 'test@test',
				})
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === INPUT_EMAIL.message);
					return done();
				});
		});

		it('errors password', (done) => {
			factory.app
				.post('/api/auth/register')
				.send({
					...registerOptions,
					password: 'testpassword',
				})
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === INPUT_PASSWORD.message);
					return done();
				});
		});

		it('errors passwords not matching', (done) => {
			factory.app
				.post('/api/auth/register')
				.send({
					...registerOptions,
					password: 'Testpass123',
					passwordAgain: 'Testpass1234',
				})
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === INPUT_PASSWORD_MATCH.message);
					return done();
				});
		});

		it('errors phone', (done) => {
			factory.app
				.post('/api/auth/register')
				.send({
					...registerOptions,
					phone: 123,
				})
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === INPUT_PHONE.message);
					return done();
				});
		});

		it('errors phone', (done) => {
			factory.app
				.post('/api/auth/register')
				.send({
					...registerOptions,
					phone: 123,
				})
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === INPUT_PHONE.message);
					return done();
				});
		});

		it('errors duplicate', (done) => {
			factory.app
				.post('/api/auth/register')
				.send(registerOptions)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === ALREADY_IN_USE.message);
					return done();
				});
		});
	});

	let cookies: string;
	describe('POST /login', () => {
		it('logs in with e-mail', (done) => {
			factory.app
				.post('/api/auth/login')
				.send({
					emailOrPhone: registerOptions.email,
					password: registerOptions.password,
				} as LoginParams)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					cookies = res.headers['set-cookie'].pop().split(';')[0];
					assert(res.body.message === SUCCESSFUL_LOGIN.message);
					return done();
				});
		});

		it('should fail already logged in', (done) => {
			factory.app
				.post('/api/auth/login')
				.set('Cookie', cookies)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === NOT_AUTH_ERROR.message);
					return done();
				});
		});

		it('should fail auth', (done) => {
			factory.app
				.post('/api/auth/logout')
				.expect(401)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === AUTH_ERROR.message);
					return done();
				});
		});

		it('should logout', (done) => {
			factory.app
				.post('/api/auth/logout')
				.set('Cookie', cookies)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.message === SUCCESSFUL_LOGOUT.message);
					return done();
				});
		});

		it('should not login due to email', (done) => {
			factory.app
				.post('/api/auth/login')
				.send({
					emailOrPhone: 'test',
					password: registerOptions.password,
				} as LoginParams)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(
						res.body.error ===
							USERNAME_OR_PASSWORD_NOT_FOUND.message,
					);
					return done();
				});
		});

		it('should not login due to password', (done) => {
			factory.app
				.post('/api/auth/login')
				.send({
					emailOrPhone: registerOptions.email,
					password: 'test',
				} as LoginParams)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(
						res.body.error ===
							USERNAME_OR_PASSWORD_NOT_FOUND.message,
					);
					return done();
				});
		});

		it('should login with phone', (done) => {
			factory.app
				.post('/api/auth/login')
				.send({
					emailOrPhone: registerOptions.phone,
					password: registerOptions.password,
				} as LoginParams)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.message === SUCCESSFUL_LOGIN.message);
					return done();
				});
		});
	});

	let token: string;
	describe('POST /forgot-password', () => {
		it('should send successful message', (done) => {
			factory.app
				.post('/api/auth/forgot-password')
				.send({
					emailOrPhone: registerOptions.email,
				} as ForgotPasswordParams)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(
						res.body.message === SUCCESSFUL_FORGOT_PASSWORD.message,
					);

					token = res.body.data;
					return done();
				});
		});

		it('should send successful message with phone', (done) => {
			factory.app
				.post('/api/auth/forgot-password')
				.send({
					emailOrPhone: registerOptions.phone,
				} as ForgotPasswordParams)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(
						res.body.message === SUCCESSFUL_FORGOT_PASSWORD.message,
					);
					return done();
				});
		});

		it('should send successful message with non-sense input', (done) => {
			factory.app
				.post('/api/auth/forgot-password')
				.send({
					emailOrPhone: 'test',
				} as ForgotPasswordParams)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(
						res.body.message === SUCCESSFUL_FORGOT_PASSWORD.message,
					);
					return done();
				});
		});
	});

	describe('POST /reset-password', () => {
		it('should fail same password', (done) => {
			factory.app
				.post('/api/auth/reset-password?token=' + token)
				.send({
					password: registerOptions.password,
					confirmPassword: registerOptions.passwordAgain,
				} as ResetPasswordParams)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === SAME_PASSWORD.message);
					return done();
				});
		});

		it('should reset password', (done) => {
			factory.app
				.post('/api/auth/reset-password?token=' + token)
				.send({
					password: 'NewTestPass123',
					confirmPassword: 'NewTestPass123',
				} as ResetPasswordParams)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.message === PASSWORD_CHANGED.message);
					return done();
				});
		});

		it('should fail reset password', (done) => {
			factory.app
				.post('/api/auth/reset-password')
				.send({
					password: 'NewTestPass123',
					confirmPassword: 'NewTestPass123',
				} as ResetPasswordParams)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					assert(res.body.error === FAILED_FORGOT_PASSWORD.message);
					return done();
				});
		});
	});
});
