import Response from '../helpers/response.js';
import HttpStatuses from '../helpers/http_statuses.js';
import Application from '../models/application.js';

export default async function (req, res, next) {
	
	Application.findOne({ owner: req.user.id }).then(application => {
  if(application) next()
  else {
   Response.error(
				res,
				'You must be onboarded before you can perform this action ',
				HttpStatuses.statusForbidden,
			);
  }
	})
 }