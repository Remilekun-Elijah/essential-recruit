import {
 Router
} from "express";
import JobController from "../controllers/job.js";
import authenticate from '../middlewares/authenticate.js';
import userVerified from '../middlewares/user_verified.js';
import uploader from '../config/multer.js';
import {
 validateSchema,
 createJobSchema,
 editJobSchema
} from '../middlewares/validators/job.js'
import { validateObjectIds } from "../middlewares/query.js";
import JobApplicationController from "../controllers/jobApplication.js";
import isOnboarded from '../middlewares/is_onboarded.js';

const router = Router();

router.use(validateObjectIds)
router.use(authenticate);
router.use(userVerified);
router.use(JobController.verifyDelete())


router.route("/")
 .get(JobController.retrieveAll())
 .post(
  uploader.imageUpload.single("companyLogo"),
  validateSchema(createJobSchema),
  JobController.create()
 ).patch(
  uploader.imageUpload.single("companyLogo"),
  validateSchema(editJobSchema),
  JobController.saveDraft()
 );
 router.route("/application")
 .get(JobApplicationController.getAll())

router.route("/:slug")
 .get(JobController.retrieve())
 .put(
  uploader.imageUpload.single("companyLogo"),
  validateSchema(editJobSchema),
  JobController.update()
 )
.delete(JobController.delete())

router.route("/application/:jobId")
.post(
 isOnboarded,
 JobApplicationController.apply())
.get(JobApplicationController.getAll())

export default router;