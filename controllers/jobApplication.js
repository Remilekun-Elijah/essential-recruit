import HttpStatuses from '../helpers/http_statuses.js';
import Response from '../helpers/response.js';
import catchAsyncError from '../helpers/catch_async_error.js';
import JobApplication from '../models/jobApplication.js';
import {
 JobStatuses
} from '../helpers/model_statuses.js';
import Application from '../models/application.js';

export default class JobApplicationController {

 static apply() {
  return catchAsyncError(async function (req, res, next) {

   const app = await Application.findOne({
    owner: req.user.id
   })

   const meta = {
    owner: app._id,
    job: req.params.jobId
   }
   const data = await JobApplication.create(meta)
   if (data) {
    Response.OK(res, "Application submitted successfully", data, HttpStatuses.statusCreated)
   } else {
    Response.error(res, 'Failed to submit your application, please try again.');
   }
  })
 }

 static getAll() {
  return catchAsyncError(async function (req, res, next) {

   let {
    page,
    pageSize
   } = req.query,
    jobApplication,
    total;
   pageSize = parseInt(pageSize) || 10;

   const filter = {
    limit: pageSize,
    skip: Math.round((page - 1) * pageSize),
    status: JobStatuses.published
   }

   if (req.route.path === "/application/:jobId") {
    total = await JobApplication.countDocuments({
     status: filter.status,
     job: req.params.jobId
    })

    jobApplication = await JobApplication.find({
     status: filter.status,
     job: req.params.jobId
    }).skip(filter.skip).limit(filter.limit).sort({
     createdAt: -1
    });
   } else {

    total = await JobApplication.countDocuments({
     status: filter.status
    });
    jobApplication = await JobApplication.find({
     status: filter.status
    }).skip(filter.skip).limit(filter.limit).sort({
     createdAt: -1
    });
   }

   Response.OK(res, "Job applications retrieved successfully", {
    page,
    pageSize,
    total,
    jobApplication
   })
  })
 }
}