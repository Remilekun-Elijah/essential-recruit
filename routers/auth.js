import { Router } from 'express';

import AuthController from '../controllers/auth.js';
import * as AuthValidators from '../middlewares/validators/auth.js';
import ValidationHandler from '../middlewares/validators/validation_handler.js';

const router = Router();

router.post(
	'/createEmail',
	AuthValidators.validateEmailCreation,
	ValidationHandler,
	AuthController.createEmailAddress(),
);

router.post(
	'/verifyUser',
	AuthValidators.validateUserVerification,
	ValidationHandler,
	AuthController.verifyUser(),
);

router.post(
	'/createUser',
	AuthValidators.validateUserCreation,
	ValidationHandler,
	AuthController.createUser(),
);

router.post(
	'/login',
	AuthValidators.validateUserLogin,
	ValidationHandler,
	AuthController.login(),
);

router.post(
	'/resendCode',
	AuthValidators.validateResendingToken,
	ValidationHandler,
	AuthController.resendToken(),
);

router.post(
	'/forgotPassword',
	AuthValidators.validateForgotPassword,
	ValidationHandler,
	AuthController.forgotPassword(),
);

router.patch(
	'/resetPassword',
	AuthValidators.validateResettingPassword,
	ValidationHandler,
	AuthController.resetPassword(),
);

router.post(
	'/contact',
	AuthValidators.validateContactUs,
	ValidationHandler,
	AuthController.contact(),
);

export default router;
