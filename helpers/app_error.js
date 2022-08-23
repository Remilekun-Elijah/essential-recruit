import HttpStatuses from './http_statuses.js';

/**
 * @class
 *
 * Error thrown when an error occurred in the Application.
 */
export default class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * @class
 *
 * Error thrown when a concrete implementation of an abstract class isn't implemented.
 */
export class UnImplementedError extends AppError {
	constructor(methodName) {
		super(
			`Missing concrete implementation of method ${methodName}`,
			HttpStatuses.statusNotImplemented,
		);
		this.isOperational = false;
	}
}
