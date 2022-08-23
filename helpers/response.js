import dotenv from 'dotenv';
import AppError from './app_error.js';
import HttpStatuses from './http_statuses.js';

dotenv.config();

/**
 * @class
 *
 * Defines methods that send back http responses
 *
 */
export default class Response {
	/**
	 * @private @method
	 * @param {Response} res HTTP Response object
	 * @param {number} code http response status code
	 * @param {string} message HTTP Response object
	 * @param {object} data data value to send along in the HTTP response
	 * @param {AppError | Error} error error object
	 *
	 * Method is private and not to be used outside of this class.
	 */
	static _sendResponse(res, code, message, data, error) {
		let serverStatus;
		if (String(code).startsWith('2')) {
			serverStatus = 'success';
		} else if (String(code).startsWith('4')) {
			serverStatus = 'fail';
		} else {
			serverStatus = 'error';
		}
		return res.status(code).json({
			status: serverStatus,
			code,
			message: message ?? 'request completed successfully.',
			data: serverStatus === 'success' && data ? data : undefined,
			errors: serverStatus !== 'success' && data ? data : undefined,
			error: error ?? undefined,
			stack: error ? error.stack : undefined,
		});
	}

	/**
	 * @private
	 * @method
	 * @param {Response} res HTTP Response object
	 * @param {AppError | Error} error Error object
	 * @param {object} data data value to send along in the HTTP response
	 *
	 * Send error response message.
	 */
	static _sendErrorResponse(res, error, data) {
		if (process.env.APP_MODE === 'DEVELOPMENT') {
			if (!error.statusCode) {
				error.statusCode = HttpStatuses.statusInternalServerError;
				error.status = 'error';
			}
			return this._sendResponse(
				res,
				error.statusCode,
				error.message,
				data,
				error,
			);
		} else {
			if (error.isOperational) {
				return this._sendResponse(res, error.statusCode, error.message, data);
			}
			console.error(`INTERNAL SERVER/NON-OPERATIONAL ERROR: ${error}`);
			console.error(error.stack);
			return this._sendResponse(
				res,
				HttpStatuses.statusInternalServerError,
				'An internal server error has occurred.',
			);
		}
	}

	/**
	 * @public
	 * @method
	 * @param {Response} res HTTP Response object
	 * @param {number} statusCode http response status code
	 * @param {string} message HTTP Response object
	 * @param {object} data data value to send along in the HTTP response
	 *
	 * Send success response.
	 */
	static OK(res, message, data, statusCode = HttpStatuses.statusOK) {
		return this._sendResponse(res, statusCode, message, data);
	}

	/**
	 * @public
	 * @method
	 * @param {Response} res HTTP Response object
	 * @param {string} message HTTP Response object
	 * @param {object} data data value to send along in the HTTP response
	 *
	 * Send route not implemented response.
	 */
	static routeNotImplemented(res) {
		return this._sendResponse(
			res,
			HttpStatuses.statusNotImplemented,
			'this route is not implemented on this server.',
		);
	}

	/**
	 * @public
	 * @method
	 * @param {Response} res HTTP Response object
	 * @param {string} message HTTP Response object
	 * @param {number} statusCode http response status code
	 * @param {object} data data value to send along in the HTTP response
	 *
	 * Send error response.
	 */
	static error(
		res,
		message,
		statusCode = HttpStatuses.statusInternalServerError,
		data,
	) {
		const errorObject =
			statusCode === HttpStatuses.statusInternalServerError
				? new Error(
						message,
						statusCode ?? HttpStatuses.statusInternalServerError,
				  )
				: new AppError(message, statusCode);

		return this._sendErrorResponse(res, errorObject, data);
	}
}
