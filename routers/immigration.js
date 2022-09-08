import { Router } from 'express';
import authenticate from '../middlewares/authenticate.js';
import userVerified from '../middlewares/user_verified.js';
import ImmigrationController from '../controllers/immigration.js';

const router = Router();

router.use(authenticate);
router.use(userVerified);

router.post("/", ImmigrationController.createOne())
router.get('/', ImmigrationController.getImmigration())
export default router;