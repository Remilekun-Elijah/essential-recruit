import Response from '../helpers/response.js';
import HttpStatuses from '../helpers/http_statuses.js';
import Application from '../models/application.js';
import { applicationStages } from '../config/data/data.js';

export default async function (req, res, next) {
	
	Application.findOne({ owner: req.user.id }).then(application => {
		if (application) {
			const {applicationStage: {applicationStage}} = application;

			
			if(applicationStages.indexOf(applicationStage) ===  applicationStages.length-1 && application.phoneNumber){
			return Response.error(
				res,
				'this applicant has already been onboarded',
				HttpStatuses.statusForbidden,
			);
			}
			else next()
		} else {
			next();
		}
	});
}
