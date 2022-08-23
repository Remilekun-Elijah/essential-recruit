import Response from '../helpers/response.js';
import HttpStatuses from '../helpers/http_statuses.js';

export default (err, req, res, next) => {
	process.env.APP_MODE === 'DEVELOPMENT' && console.error(err);
	if (err.status === HttpStatuses.statusBadRequest) {
		return Response.error(
			res,
			'invalid or malformed json data sent to the server',
			HttpStatuses.statusBadRequest,
		);
	}
	if (err.code === 'LIMIT_UNEXPECTED_FILE') {
		return Response.error(
			res,
			'invalid field(s) provided',
			HttpStatuses.statusBadRequest,
		);
	}
	return Response.error(res, err.message, err.statusCode);
};
