import Response from '../helpers/response.js';
import HttpStatuses from '../helpers/http_statuses.js';
import Application from '../models/application.js';

export default function (req, res, next) {
	Application.findOne({ owner: req.user.id }).then(application => {
		if (application) {
			return Response.error(
				res,
				'this applicant has already been onboarded',
				HttpStatuses.statusForbidden,
			);
		} else {
			next();
		}
	});
}
