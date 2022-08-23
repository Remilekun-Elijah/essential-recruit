import Response from '../helpers/response.js';
import HttpStatuses from '../helpers/http_statuses.js';

export default function authorize(...roles) {
	return function (req, res, next) {
		if (!roles.includes(req.user.role)) {
			return Response.error(
				res,
				'unauthorized to perform this operation',
				HttpStatuses.statusForbidden,
			);
		}
		return next();
	};
}
