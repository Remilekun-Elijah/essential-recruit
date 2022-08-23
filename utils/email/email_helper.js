import nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text';

import {
	WelcomeTemplate,
	EmailVerificationTemplate,
	PasswordResetTemplate,
	PasswordResetSuccessfulTemplate,
	ContactUsTemplate,
} from './email_templates.js';

export default class EmailHelper {
	constructor(email, firstName, url) {
		this._emailSender = `Essential Recruit <${process.env.EMAIL_SENDER}>`;
		this._userEmail = email;
		this._firstName = firstName;
		this._url = url;
	}

	_createTransporter() {
		if (process.env.APP_MODE === 'PRODUCTION') {
			return nodemailer.createTransport({
				service: 'SendGrid',
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASSWORD,
				},
			});
		} else {
			return nodemailer.createTransport({
				host: process.env.MAILTRAP_HOST,
				port: process.env.MAILTRAP_PORT,
				ssl: false,
				tls: true,
				auth: {
					user: process.env.MAILTRAP_USERNAME,
					pass: process.env.MAILTRAP_PASSWORD,
				},
			});
		}
	}

	async _sendEmail(htmlTemplate, emailSubject) {
		const emailData = {
			from: this._emailSender,
			to: this._userEmail,
			subject: emailSubject,
			html: htmlTemplate,
			text: htmlToText(htmlTemplate),
		};
		try {
			await this._createTransporter().sendMail(emailData);
		} catch (error) {
			throw error;
		}
	}

	_generateFirstName() {
		return this._firstName.charAt(0).toUpperCase() + this._firstName.slice(1);
	}

	async sendWelcomeEmail() {
		const welcomeTemplate = WelcomeTemplate.replace(
			'<firstName>',
			this._generateFirstName(),
		)
			.replaceAll('<company_name>', process.env.COMPANY_NAME)
			.replace('<company_email>', process.env.COMPANY_EMAIL)
			.replace('<company_phone>', process.env.COMPANY_PHONE);
		await this._sendEmail(
			welcomeTemplate,
			`Welcome To ${process.env.COMPANY_NAME}`,
		);
	}

	async sendVerificationCode(verificationCode) {
		const emailConfirmationTemplate = EmailVerificationTemplate.replace(
			'<company_name>',
			process.env.COMPANY_NAME,
		)
			.replace('<firstname>', 'there')
			.replace('<code>', verificationCode)
			.replace('<company_email>', process.env.COMPANY_EMAIL)
			.replace('<company_phone>', process.env.COMPANY_PHONE);
		await this._sendEmail(
			emailConfirmationTemplate,
			'Verification code (expires in 1 hour)',
		);
	}

	async sendPasswordResetEmail(verificationCode) {
		const passwordResetTemplate = PasswordResetTemplate.replace(
			'<code>',
			verificationCode,
		)
			.replace('<firstname>', this._generateFirstName())
			.replace('<company_name>', process.env.COMPANY_NAME)
			.replace('<company_email>', process.env.COMPANY_EMAIL)
			.replace('<company_phone>', process.env.COMPANY_PHONE);
		await this._sendEmail(
			passwordResetTemplate,
			'Password reset (expires in 10 minutes)',
		);
	}

	async sendPasswordResetSuccessfulEmail() {
		const template = PasswordResetSuccessfulTemplate.replace(
			'<user>',
			this._generateFirstName(),
		)
			.replace('<firstname>', this._generateFirstName())
			.replace('<company_name>', process.env.COMPANY_NAME)
			.replace('<company_email>', process.env.COMPANY_EMAIL)
			.replace('<company_phone>', process.env.COMPANY_PHONE);
		await this._sendEmail(template, 'Password Reset Successful');
	}

	async sendContactUsEmail(sender, name, subject, message) {
		this._emailSender = sender;
		this._userEmail = process.env.COMPANY_EMAIL;
		const template = ContactUsTemplate.replaceAll('<name>', name)
			.replace('<sender>', sender)
			.replace('<company_email>', process.env.COMPANY_EMAIL)
			.replace('<message>', message)
			.replace('<subject>', subject)
			.replace('<date_sent>', new Date().toLocaleString());
		await this._sendEmail(template, subject);
	}
}
