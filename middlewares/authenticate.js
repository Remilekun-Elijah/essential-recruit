import jwt from 'jsonwebtoken';

import HttpStatuses from '../helpers/http_statuses.js';
import Response from '../helpers/response.js';
import User from '../models/user.js';

export default async function (req, res, next) {
	if (
		!req.headers.authorization ||
		(req.headers.authorization && !req.headers.authorization.trim())
	) {
		return Response.error(
			res,
			'bearer token is required',
			HttpStatuses.statusUnauthorized,
		);
	}
	const bearerToken = req.headers.authorization.replace('Bearer ', '');

	if (!bearerToken) {
		return Response.error(
			res,
			'bearer token is required.',
			HttpStatuses.statusUnauthorized,
		);
	}

	try {
		const { email, exp, id } = jwt.verify(bearerToken, process.env.JWT_SECRET);
		const user = await User.findOne(
			{ email, id },
			'email firstName lastName avatar userVerified recruiterApproved role',
		);
		if (!user) {
			return Response.error(
				res,
				'invalid or malformed token provided.',
				HttpStatuses.statusUnauthorized,
			);
		}
		if (Date.now() > exp * 1000) {
			return Response.error(
				res,
				'token expired, please login again',
				HttpStatuses.statusUnauthorized,
			);
		}
		req.user = user;
		next();
	} catch (error) {
		return Response.error(res, 'unable to authenticate user, please try again');
	}
}
