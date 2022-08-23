import Response from '../helpers/response.js';
import HttpStatuses from '../helpers/http_statuses.js';

export default function recruiterApproved(req, res, next) {
	if (req.user.role === 'recruiter' && !req.user.recruiterApproved) {
		return Response.error(
			res,
			'recruiter has not been approved yet by an admin',
			HttpStatuses.statusForbidden,
		);
	}
	return next();
}
