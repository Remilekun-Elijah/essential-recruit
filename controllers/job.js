import HttpStatuses from '../helpers/http_statuses.js';
import Response from '../helpers/response.js';
import catchAsyncError from '../helpers/catch_async_error.js';
import Job from '../models/job.js';
import randomString from 'randomstring';
import uploadToCloudinary from '../config/cloudinary.js';
import { getJobStatusString, JobStatuses } from '../helpers/model_statuses.js';
import fs from 'fs';
import dayjs from 'dayjs'
export default class JobController {

  static async uploadCompanyLogo (req) {
    const label = "companyLogo"
    if (req.body[label]) {
			const logo = await uploadToCloudinary(
				req.body[label],
				'images/recruiters',
			);
			fs.unlinkSync(req.body[label]);
      return logo
		}
  }
  static create(){
   return catchAsyncError(async function(req, res, next){
     const companyLogo = await JobController.uploadCompanyLogo(req),
      status = JobStatuses.published,
      { jobId } = req.query,
      postFix = randomString.generate({
       length: 7,
       charset: 'alphabetic'
      }); 

      let data,
      slug = req.body.title.replace(/[^a-zA-Z0-9-]/g, '-');
      slug = slug.endsWith('-') ? slug + postFix : slug + '-' + postFix;

      req.body = { ...req.body, status, slug, companyLogo };
      
    if(jobId) {
      const job = await Job.findById(jobId);
      if(job){
        if(job.status !== JobStatuses.published) {
        data = await Job.updateOne({_id: jobId}, req.body)
        if(data.acknowledged && data.modifiedCount) Response.OK(res, "Draft published successfully", data, HttpStatuses.statusCreated) 
        else  Response.error(res,  'Failed to publish job, please try again.');
      } else Response.error(res, 'Failed!!! Job already published.', HttpStatuses.statusBadRequest);
      }  else Response.error(res, "Job not found", HttpStatuses.statusNotFound)
    }else {
      
    data = await Job.create(req.body);
    if(data) {
     Response.OK(res, "Job  created successfully", data, HttpStatuses.statusCreated)
    }else {
      Response.error(res,  'Job creation failed, please try again.');
    }
   }
  })
  }

  static saveDraft () {
    return catchAsyncError(async function (req, res, next) {
      req.body = {...req.body, status: JobStatuses.drafted}
      const companyLogo = await JobController.uploadCompanyLogo(req),
       { jobId } = req.query;
       if(companyLogo) req.body.companyLogo = companyLogo
      let data;
      if (jobId){
        data = await Job.findByIdAndUpdate(jobId, req.body)
        if(data) Response.OK(res, "Your changes was saved in your draft successfully", data)
        else Response.error(res, 'Failed to update draft, please try again.');
      }
      else {
        data = await Job.create(req.body)
        if (data) Response.OK(res, "Saved to draft successfully", data, HttpStatuses.statusCreated)
        else Response.error(res, 'Failed to save to draft, please try again.');
      }
    })
  }

  static retrieve () {
    return catchAsyncError(async function (req, res, next) {
      const data = await Job.findOne({slug: req.params.slug});
      console.log(req.params.slug);
      
      if(data){
        data._doc.statusText =  getJobStatusString(data.status)
         Response.OK(res, "Job retrieved successfully", data)
      }
      else Response.error(res, "Job not found", HttpStatuses.statusNotFound)
    })
  }

  static retrieveAll () {
    return catchAsyncError(async function (req, res, next) {
      let { page, pageSize, createdBy } = req.query,
      total=0,
      jobs=[];

      page = parseInt(page) || 1;
      pageSize = parseInt(pageSize) || 10;

      const filter = {
        limit: pageSize,
        skip: Math.round((page - 1) * pageSize),
        status:  JobStatuses.published
      },
      obj = {status: [filter.status, JobStatuses.drafted]};
      //  date = new Date();
      // date.setHours(0, 0, 0, 0);
      // const createdAt = {
      //   $gte: dayjs(date)
      //     .subtract(createdAt || 7, "day")
      //     .toISOString()
      // }
      
      if(createdBy){
        obj.owner = createdBy;
      }else {
        obj.status = filter.status
      }
      total = await Job.countDocuments(obj)
      jobs = await Job.find(obj).skip(filter.skip).limit(filter.limit).sort({createdAt: -1});

      jobs = jobs.map(doc => {
        doc._doc.statusText =  getJobStatusString(doc.status)
       return doc 
      });

      Response.OK(res, "Jobs retrieved successfully", {total, page, pageSize, jobs})
    })
  }

  static update () {
    return catchAsyncError(async function (req, res, next) {
      req.body = {...req.body, status: req.body.status || JobStatuses.published}
      delete req.body.owner
      let companyLogo = req.body.companyLogo ? await JobController.uploadCompanyLogo(req) : "",
      postFix = randomString.generate({
       length: 7,
       charset: 'alphabetic'
      }); 

      let data, slug;

      if(req.body.title){

        slug = req.body.title.replace(/[^a-zA-Z0-9-]/g, '-');
        slug = slug.endsWith('-') ? slug + postFix : slug + '-' + postFix;
        
      }
      req.body = { ...req.body, slug, companyLogo };
      
        data = await Job.findOneAndUpdate({slug: req.params.slug},  {$set: req.body})
      if(data) {
        Response.OK(res, "Job updated successfully", data) 
      } 
      else Response.error(res, 'Job not found.', HttpStatuses.statusNotFound);

    })
  }

  static verifyDelete (){
    return catchAsyncError(async function (req, res, next) {
      const {slug} = req.params,
      {jobId} = req.query,
       status = JobStatuses.deleted,
       obj = {slug, _id: jobId, status}
        if(!slug) delete obj.slug
        if(!jobId) delete obj._id

       const data = await Job.findOne(obj);
      if (data && (slug || jobId)) Response.error(res, "This job has been deleted", HttpStatuses.statusGone)
      else next()
    })
  }

  static delete () {
    return catchAsyncError(async function (req, res, next) {
      const status = JobStatuses.deleted;

      const data = await Job.findOneAndUpdate({slug: req.params.slug}, {status});
      if (data) Response.OK(res, "Job deleted successfully")
      else Response.error(res, "Job not found", HttpStatuses.statusNotFound)
    })
  }
}
