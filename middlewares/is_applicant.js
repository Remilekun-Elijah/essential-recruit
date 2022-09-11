import Response from '../helpers/response.js';
import HttpStatuses from '../helpers/http_statuses.js';
import Application from '../models/application.js';

export default function (req, res, next) {
	
	if (!req.user.isApplicant()) {
		return Response.error(
			res,
			'only applicants can be onboarded',
			HttpStatuses.statusForbidden,
		);
	}
	next();
}
