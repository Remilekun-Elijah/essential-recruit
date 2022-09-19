import fs from 'fs';
import HttpStatuses from '../helpers/http_statuses.js';
import Response from '../helpers/response.js';
import catchAsyncError from '../helpers/catch_async_error.js';
import uploadToCloudinary from '../config/cloudinary.js';

import Application from '../models/application.js';
import User from '../models/user.js';

export default class ApplicationController {
	static async uploadDocuments(req) {
		// let ieltsDocUrl;
		// let ecaDocUrl;
		// let resumeDocUrl;
		// let offerLetterDocumentUrl;
		// if (req.files['ieltsDocument']) {
		// 	ieltsDocUrl = await uploadToCloudinary(
		// 		req.files['ieltsDocument'][0].path,
		// 		'documents/ielts',
		// 	);
		// 	fs.unlinkSync(req.files['ieltsDocument'][0].path);
		// }
		// if (req.files['ecaDocument']) {
		// 	ecaDocUrl = await uploadToCloudinary(
		// 		req.files['ecaDocument'][0].path,
		// 		'documents/ecas',
		// 	);
		// 	fs.unlinkSync(req.files['ecaDocument'][0].path);
		// }
		// if (req.files['resumeDocument']) {
		// 	resumeDocUrl = await uploadToCloudinary(
		// 		req.files['resumeDocument'][0].path,
		// 		'documents/resumes',
		// 	);
		// 	fs.unlinkSync(req.files['resumeDocument'][0].path);
		// }
		// if (req.files['offerLetterDocument']) {
		// 	offerLetterDocument = await uploadToCloudinary(
		// 		req.files['offerLetterDocument'][0].path,
		// 		'documents/offerLetterDocuments',
		// 	);
		// 	fs.unlinkSync(req.files['offerLetterDocument'][0].path);
		// }
		return {
			ieltsDocUrl: req.body.ieltsDocument || "",
			ecaDocUrl: req.body.ecaDocument || "",
			resumeDocUrl: req.body.resumeDocument || "",
			offerLetterDocumentUrl: req.body.offerLetterDocument || "",
		};
	}

	static createOnboardingApplication() {
		return catchAsyncError(async function (req, res, next) {
			const { ieltsDocUrl, ecaDocUrl, resumeDocUrl } =
				await ApplicationController.uploadDocuments(req);

				let application = await Application.findOne({owner: req.user.id})

				if(application) {
					// Automatically calculate the user tier level depending on whether they provided the required document. tier level 3 means the lowest tier, 2 means the lower tier and 1 represents the highest tier.
					let tierLevel;
					if (
						req.body.hasIELTS == 1 &&
						ieltsDocUrl && ecaDocUrl &&
						req.body.credentialsEvaluated
					) {
						tierLevel = 1;
					} else if (
						req.body.hasIELTS == 1 &&
						(ieltsDocUrl || ecaDocUrl) &&
						req.body.credentialsEvaluated
					) {
						tierLevel = 2;
					} else {
						tierLevel = 3;
					}
					application = await Application.findByIdAndUpdate(application._id, {"$set":{
					applicationStage: res.locals.nextStage._id,
				relocating: req.body.relocating,
				relocationIdealTimeline: req.body.relocationIdealTimeline,
				jobSearchStage: req.body.jobSearchStage,
				workingExperience: req.body.workingExperience,
				currentLocation: req.body.currentLocation,
				locationPreferences: req.body.locationPreferences,
				takingRolesOutsideTopLocationPref:
					req.body.takingRolesOutsideTopLocationPref,
				workConcerns: req.body.workConcerns,
				hasLicense: req.body.hasLicense,
				activeLicenseLocations: req.body.activeLicenseLocations,
				highestEducationLevel: req.body.highestEducationLevel,
				workedInLongTermFacility: req.body.workedInLongTermFacility,
				certifications: req.body.certifications,
				otherCertifications: req.body.otherCertifications,
				specialties: req.body.specialties,
				spokenLanguages: req.body.spokenLanguages,
				hasIELTS: req.body.hasIELTS,
				IELTSDocument: ieltsDocUrl,
				credentialsEvaluated: req.body.credentialsEvaluated,
				ECADocument: ecaDocUrl,
				phoneNumber: req.body.phoneNumber,
				resumeDocument: resumeDocUrl,
				tierLevel: tierLevel
				}
			},{new: true})
			
				}else {

			 application = new Application({
				owner: req.user.id,
				applicationStage: res.locals.nextStage._id,
				relocating: req.body.relocating,
				relocationIdealTimeline: req.body.relocationIdealTimeline,
				jobSearchStage: req.body.jobSearchStage,
				workingExperience: req.body.workingExperience,
				currentLocation: req.body.currentLocation,
				locationPreferences: req.body.locationPreferences,
				takingRolesOutsideTopLocationPref:
					req.body.takingRolesOutsideTopLocationPref,
				workConcerns: req.body.workConcerns,
				hasLicense: req.body.hasLicense,
				activeLicenseLocations: req.body.activeLicenseLocations,
				highestEducationLevel: req.body.highestEducationLevel,
				workedInLongTermFacility: req.body.workedInLongTermFacility,
				certifications: req.body.certifications,
				otherCertifications: req.body.otherCertifications,
				specialties: req.body.specialties,
				spokenLanguages: req.body.spokenLanguages,
				hasIELTS: req.body.hasIELTS,
				IELTSDocument: ieltsDocUrl,
				credentialsEvaluated: req.body.credentialsEvaluated,
				ECADocument: ecaDocUrl,
				phoneNumber: req.body.phoneNumber,
				resumeDocument: resumeDocUrl,
			});

			await application.save();
		}
			Response.OK(res, 'application updated successfully', application);
		});
	}

	static getApplicationDetails() {
		return catchAsyncError(async function (req, res, next) {
			const details = await Application.findOne({ owner: req.user.id });
			Response.OK(res, 'application details retrieved successfully', details);
		});
	}

	static getAllApplications() {
		return catchAsyncError(async function (req, res, next) {
		
		let { page, pageSize } = req.query;
      page = parseInt(page) || 1
      pageSize = parseInt(pageSize) || 10;

      const filter = {
        limit: pageSize,
        skip: Math.round((page - 1) * pageSize)
      }
    
      const total = await Application.countDocuments()
      let application = await Application.find({}).skip(filter.skip).limit(filter.limit).sort({createdAt: -1});

						Response.OK(res, 'application details retrieved successfully', {page, pageSize, total, application});
					});
	}

	static uploadVideo() {
		return catchAsyncError(async function (req, res, next) {
			if (!req.body.video) {
				return Response.error(
					res,
					'please provide a valid introductory video',
					HttpStatuses.statusBadRequest,
				);
			}else{
				await Application.findOneAndUpdate(
					{ owner: req.user.id },
					{ introductoryVideo: req.body.video },
				);
				Response.OK(res, 'introductory video uploaded successfully', {
					video: req.body.video,
				});
			}
		});
			
	}

	static updateApplication() {
		return catchAsyncError(async function (req, res, next) {
			const { ieltsDocUrl, ecaDocUrl, resumeDocUrl, offerLetterDocumentUrl } =
				await ApplicationController.uploadDocuments(req);
			const application = await Application.findOne({ owner: req.user._id });
			const user = await User.findById(req.user._id);
			user.firstName =
				req.body.firstName === '' ? user.firstName : req.body.firstName;
			user.lastName =
				req.body.lastName === '' ? user.lastName : req.body.lastName;
			application.location = req.body.location || application.location;
			application.spokenLanguages =
				req.body.spokenLanguages || application.spokenLanguages;
			application.highestEducationLevel =
				req.body.highestEducationLevel || application.highestEducationLevel;
			application.certifications =
				req.body.certifications || application.certifications;
			application.otherCertifications =
				req.body.otherCertifications || application.otherCertifications;
			application.specialties = req.body.specialties || application.specialties;
			application.activeLicenseLocations =
				req.body.activeLicenseLocations || application.activeLicenseLocations;
			application.locationPreferences =
				req.body.locationPreferences || application.locationPreferences;
			application.expertiseLevel =
				req.body.expertiseLevel || application.expertiseLevel;
			application.phoneNumber = req.body.phoneNumber || application.phoneNumber;
			application.workingExperience =
				req.body.workingExperience || application.workingExperience;
			application.IELTSDocument = ieltsDocUrl || application.IELTSDocument;
			application.ECADocument = ecaDocUrl || application.ECADocument;
			application.offerLetterDocument =
				offerLetterDocumentUrl || application.offerLetterDocument;
			application.resumeDocument = resumeDocUrl || application.resumeDocument;

			await application.save({ validateBeforeSave: false });
			await user.save({ validateBeforeSave: false });
			Response.OK(res, 'application updated successfully');
		});
	}
}
