import { body, query } from 'express-validator';
import User from '../../models/user.js';

export const validateEmailCreation = [
	body('email')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('email address is required')
		.isEmail()
		.withMessage('please provide a valid email address')
		.custom(value => {
			return User.findOne({ email: value }).then(user => {
				if (user) {
					return Promise.reject('email address is already in use');
				}
			});
		}),

	body('role')
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('user role is required')
		.isIn(['applicant', 'recruiter'])
		.withMessage('roles can either be applicant or recruiter only'),
];

export const validateUserVerification = [
	body('code')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('verification code is required')
		.isString()
		.withMessage('verification code must be a string value')
		.matches(/^([0-9]{4}|[0-9]{6})$/)
		.withMessage('verification code must contain 4 to 6 digits only')
		.isLength({ min: 4, max: 6 })
		.withMessage(
			'verification code must be at least 4 numbers or at most 6 numbers',
		),
];

export const validateUserCreation = [
	body('email')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('email address is required')
		.isEmail()
		.withMessage('please provide a valid email address')
		.custom(value => {
			return User.findOne({ email: value }).then(user => {
				if (!user) {
					return Promise.reject('user with this email address does not exist');
				}
			});
		}),

	body('firstName')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('firstName is required')
		.isString()
		.withMessage('firstName must be a string value')
		.isLength({ min: 3, max: 20 })
		.withMessage(
			'firstName must be at least 3 characters or at most 20 characters',
		),

	body('lastName')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('lastName is required')
		.isString()
		.withMessage('lastName must be a string value')
		.isLength({ min: 3, max: 20 })
		.withMessage(
			'lastName must be at least 3 characters or at most 20 characters',
		),

	body('role')
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('user role is required')
		.isIn(['applicant', 'recruiter'])
		.withMessage('roles can either be applicant or recruiter only')
		.custom((value, { req }) => {
			return User.findOne({ email: req.body.email, role: value }).then(user => {
				if (!user) {
					return Promise.reject(
						`user is not ${value === 'recruiter' ? 'a' : 'an'} ${value}`,
					);
				}
			});
		}),

	body('password')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('password is required')
		.isString()
		.withMessage('password must be a string value')
		.isLength({ min: 8 })
		.withMessage('password must contain at least 8 characters')
		.matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d].{8,}$/)
		.withMessage(
			'password must contain minimum eight characters, at least one letter and one number',
		),

	body('companyName')
		.trim()
		.if(body('role').equals('recruiter'))
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('companyName is required')
		.isString()
		.withMessage('companyName must be a string value')
		.isLength({ min: 3, max: 20 })
		.withMessage(
			'companyName must contain at least 3 characters and at most 20 characters',
		),

	body('companyProvince')
		.trim()
		.if(body('role').equals('recruiter'))
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('companyProvince is required')
		.isString()
		.withMessage('companyProvince must be a string value')
		.isLength({ min: 3, max: 20 })
		.withMessage(
			'companyProvince must contain at least 3 characters and at most 20 characters',
		),

	body('companyCity')
		.trim()
		.if(body('role').equals('recruiter'))
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('companyCity is required')
		.isString()
		.withMessage('companyCity must be a string value')
		.isLength({ min: 3, max: 20 })
		.withMessage(
			'companyCity must contain at least 3 characters and at most 20 characters',
		),

	body('phoneNumber')
		.trim()
		.if(body('role').equals('recruiter'))
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('phoneNumber is required')
		.isString()
		.withMessage('phoneNumber must be a string value')
		.isMobilePhone()
		.withMessage('phoneNumber must be a valid phone number')
		.isLength({ min: 11, max: 20 })
		.withMessage(
			'phoneNumber must contain at least 3 characters and at most 20 characters',
		),
];

export const validateUserLogin = [
	body('email')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('email address is required')
		.isEmail()
		.withMessage('please provide a valid email address')
		.custom(value => {
			return User.findOne({ email: value }).then(user => {
				if (!user) {
					return Promise.reject('user with this email address does not exist');
				}
			});
		}),

	body('password')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('password is required')
		.isString()
		.withMessage('password must be a string value')
		.isLength({ min: 8 })
		.withMessage('password must contain at least 8 characters')
		// ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z].{8,}$
		.matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d].{8,}$/)
		.withMessage(
			'password must contain minimum eight characters, at least one letter and one number',
		)
		.custom((value, { req }) => {
			return User.findOne({ email: req.body.email }, '+password').then(
				async user => {
					if (!user.password || !user.firstName || !user.lastName) {
						return Promise.reject('user account has not been fully created');
					}
					if (user && !(await user.isPasswordCorrect(value))) {
						return Promise.reject('email address or password is not correct');
					}
				},
			);
		}),
];

export const validateResendingToken = [
	body('email')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('email address is required')
		.isEmail()
		.withMessage('please provide a valid email address')
		.custom((value, { req }) => {
			return User.findOne({ email: value }, '+userVerified').then(user => {
				if (!user) {
					return Promise.reject('user with this email address does not exist');
				}
				req.user = user;
			});
		})
		.if(
			query('type')
				.exists({ checkFalsy: true, checkNull: true })
				.equals('registration'),
		)
		.custom((value, { req }) => {
			if (req.user.userVerified) {
				return Promise.reject('user already verified');
			}
			return true;
		}),

	query('type')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage("query param 'type' is required")
		.isIn(['password', 'registration'])
		.withMessage(
			"type query param can either be 'password' or 'registration' only",
		),
];

export const validateForgotPassword = [
	body('email')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('email address is required')
		.isEmail()
		.withMessage('please provide a valid email address')
		.custom((value, { req }) => {
			return User.findOne({ email: value }).then(user => {
				if (!user) {
					return Promise.reject('invalid email address provided');
				}
				req.user = user;
			});
		}),
];

export const validateResettingPassword = [
	body('code')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('verification code is required')
		.isString()
		.withMessage('verification code must be a string value')
		.matches(/^([0-9]{4})$/)
		.withMessage('verification code must contain 4 digits only')
		.isLength({ min: 4, max: 4 })
		.withMessage('verification code must be 4 numbers'),

	body('password')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('password is required')
		.isString()
		.withMessage('password must be a string value')
		.isLength({ min: 8 })
		.withMessage('password must contain at least 8 characters')
		.matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d].{8,}$/)
		.withMessage(
			'password must contain minimum eight characters, at least one letter and one number',
		),
];

export const validateContactUs = [
	body('email')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('email address is required')
		.isEmail()
		.withMessage('please provide a valid email address'),

	body('name')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('name is required')
		.isString()
		.withMessage('name must be a string value')
		.isLength({ min: 3, max: 50 })
		.withMessage('name must be at least 3 characters or at most 50 characters'),

	body('subject')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('subject is required')
		.isString()
		.withMessage('subject must be a string value')
		.isLength({ min: 3, max: 20 })
		.withMessage(
			'subject must be at least 3 characters or at most 20 characters',
		),

	body('message')
		.trim()
		.exists({ checkFalsy: true, checkNull: true })
		.withMessage('message is required')
		.isString()
		.withMessage('message must be a string value')
		.isLength({ min: 10, max: 1000 })
		.withMessage(
			'message must be at least 3 characters or at most 1000 characters',
		),
];
