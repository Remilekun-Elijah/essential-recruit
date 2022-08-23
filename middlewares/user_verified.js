import Response from '../helpers/response.js';
import HttpStatuses from '../helpers/http_statuses.js';

export default function userVerified(req, res, next) {
	if (!req.user.userVerified) {
		return Response.error(
			res,
			'user account is not verified',
			HttpStatuses.statusForbidden,
		);
	}
	return next();
}
