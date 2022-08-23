import { Router } from 'express';
import ApplicationController from '../controllers/application.js';

import authenticate from '../middlewares/authenticate.js';
import userVerified from '../middlewares/user_verified.js';
import * as ApplicationValidator from '../middlewares/validators/application.js';
import ValidationHandler from '../middlewares/validators/validation_handler.js';
import isApplicant from '../middlewares/is_applicant.js';
import hasApplication from '../middlewares/has_application.js';

import uploader from '../config/multer.js';

const router = Router();

router.use(authenticate);
router.use(userVerified);
router.use(isApplicant);

router
	.route('/')
	.get(ApplicationController.getApplicationDetails())
	.patch(
		uploader.pdfUpload.fields([
			{ name: 'ieltsDocument', maxCount: 1 },
			{ name: 'ecaDocument', maxCount: 1 },
			{ name: 'resumeDocument', maxCount: 1 },
			{ name: 'offerLetterDocument', maxCount: 1 },
		]),
		ApplicationValidator.validateApplicationEdit,
		ValidationHandler,
		ApplicationController.updateApplication(),
	);

router.post(
	'/uploadVideo',
	uploader.videoUpload.single('video'),
	ApplicationController.uploadVideo(),
);

router.route('/onboard').put(
	hasApplication,
	uploader.pdfUpload.fields([
		{ name: 'ieltsDocument', maxCount: 1 },
		{ name: 'ecaDocument', maxCount: 1 },
		{ name: 'resumeDocument', maxCount: 1 },
	]),
	ApplicationValidator.validateApplicationCreation,
	ValidationHandler,
	ApplicationController.createOnboardingApplication(),
);

export default router;
