import { validationResult } from 'express-validator';
import Response from '../../helpers/response.js';
import HttpStatuses from '../../helpers/http_statuses.js';

export default function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const result = errors.mapped({ onlyFirstError: true });
		for (const error in result) {
			for (const key in result[error]) {
				if (key !== 'msg') {
					delete result[error][key];
				}
			}
		}
		return Response.error(
			res,
			'validation failed, check input values provided',
			HttpStatuses.statusUnprocessableEntity,
			result,
		);
	}
	return next();
}
