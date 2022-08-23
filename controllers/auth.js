import catchAsyncError from '../helpers/catch_async_error.js';
import HttpStatuses from '../helpers/http_statuses.js';
import Response from '../helpers/response.js';
import EmailHelper from '../utils/email/email_helper.js';

import User from '../models/user.js';

export default class AuthController {
	static generateJWT(req, res, user) {
		const jwt = user.generateJWT();
		const jwtCookieOptions = {
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
		};
		res.cookie('jwt', jwt, jwtCookieOptions);
		return jwt;
	}

	static createEmailAddress() {
		return catchAsyncError(async function (req, res, next) {
			const { email, role } = req.body;
			const verificationCode = User.generateVerificationCode(6);
			const user = new User({
				email,
				role,
				verificationCode,
				verificationCodeExpiresIn: Date.now() + 60 * 60 * 1000,
			});
			await user.save();
			await new EmailHelper(email).sendVerificationCode(verificationCode);
			Response.OK(
				res,
				'verification code sent to email address provided',
				HttpStatuses.statusCreated,
			);
		});
	}

	static verifyUser() {
		return catchAsyncError(async function (req, res, next) {
			const user = await User.findOne(
				{
					verificationCode: Number(req.body.code),
					verificationCodeExpiresIn: { $gt: Date.now() },
				},
				'email role',
			);
			if (!user) {
				return Response.error(
					res,
					'verification code is invalid or has expired',
					HttpStatuses.statusForbidden,
				);
			}
			user.verificationCode = undefined;
			user.verificationCodeExpiresIn = undefined;
			user.userVerified = true;
			await user.save({ validateBeforeSave: false });
			Response.OK(res, 'user verified successfully', {
				email: user.email,
				role: user.role,
			});
		});
	}

	static createUser() {
		return catchAsyncError(async function (req, res, next) {
			const {
				email,
				firstName,
				lastName,
				role,
				password,
				companyName,
				companyProvince,
				companyCity,
				phoneNumber,
			} = req.body;
			const user = await User.findOne({ email });
			user.firstName = firstName;
			user.lastName = lastName;
			user.password = password;
			role === 'recruiter' && (user.companyName = companyName);
			role === 'recruiter' && (user.companyProvince = companyProvince);
			role === 'recruiter' && (user.companyCity = companyCity);
			role === 'recruiter' && (user.phoneNumber = phoneNumber);
			await user.save();
			Response.OK(res, 'user created successfully', HttpStatuses.statusCreated);
		});
	}

	static login() {
		return catchAsyncError(async function (req, res, next) {
			const user = await User.findOne(
				{ email: req.body.email },
				'email firstName lastName role phoneNumber createdAt',
			);
			const jwt = AuthController.generateJWT(req, res, user);
			Response.OK(res, 'user logged in successfully', { user, token: jwt });
		});
	}

	static resendToken() {
		return catchAsyncError(async (req, res, next) => {
			const length = req.query.type === 'password' ? 4 : 6;
			const verificationCode = User.generateVerificationCode(length);
			req.user.verificationCode = verificationCode;
			req.user.verificationCodeExpiresIn = Date.now() + 60 * 60 * 1000;
			await req.user.save({ validateBeforeSave: false });
			req.query.type === 'password'
				? await new EmailHelper(
						req.user.email,
						req.user.firstName,
				  ).sendPasswordResetEmail(verificationCode)
				: await new EmailHelper(req.user.email).sendVerificationCode(
						verificationCode,
				  );
			Response.OK(res, 'verification code resent to email address provided');
		});
	}

	static forgotPassword() {
		return catchAsyncError(async function (req, res, next) {
			const verificationCode = User.generateVerificationCode();
			req.user.verificationCode = verificationCode;
			req.user.verificationCodeExpiresIn = Date.now() + 10 * 60 * 1000;
			await req.user.save();
			await new EmailHelper(
				req.user.email,
				req.user.firstName,
			).sendPasswordResetEmail(verificationCode);
			Response.OK(res, 'password reset code sent to email address');
		});
	}

	static resetPassword() {
		return catchAsyncError(async function (req, res, next) {
			const user = await User.findOne(
				{
					verificationCode: Number(req.body.code),
					verificationCodeExpiresIn: { $gt: Date.now() },
				},
				'email avatar id role firstName lastName',
			);
			if (!user) {
				return Response.error(
					res,
					'verification code is invalid or has expired',
					HttpStatuses.statusForbidden,
				);
			}
			user.verificationCode = undefined;
			user.verificationCodeExpiresIn = undefined;
			user.password = req.body.password;
			await user.save();
			await new EmailHelper(
				user.email,
				user.firstName,
			).sendPasswordResetSuccessfulEmail();
			const jwt = AuthController.generateJWT(req, res, user);
			user.password = undefined;
			Response.OK(res, 'password reset successful', {
				user,
				token: jwt,
			});
		});
	}

	static contact() {
		return catchAsyncError(async function (req, res, next) {
			const { email: sender, name, subject, message } = req.body;
			await new EmailHelper().sendContactUsEmail(
				sender,
				name,
				subject,
				message,
			);
			Response.OK(res, 'email address successfully sent');
		});
	}
}
