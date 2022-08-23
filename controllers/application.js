import fs from 'fs';

import HttpStatuses from '../helpers/http_statuses.js';
import Response from '../helpers/response.js';
import catchAsyncError from '../helpers/catch_async_error.js';
import uploadToCloudinary from '../config/cloudinary.js';

import Application from '../models/application.js';
import User from '../models/user.js';

export default class ApplicationController {
	static async uploadDocuments(req) {
		let ieltsDocUrl;
		let ecaDocUrl;
		let resumeDocUrl;
		let offerLetterDocumentUrl;
		if (req.files['ieltsDocument']) {
			ieltsDocUrl = await uploadToCloudinary(
				req.files['ieltsDocument'][0].path,
				'documents/ielts',
			);
			fs.unlinkSync(req.files['ieltsDocument'][0].path);
		}
		if (req.files['ecaDocument']) {
			ecaDocUrl = await uploadToCloudinary(
				req.files['ecaDocument'][0].path,
				'documents/ecas',
			);
			fs.unlinkSync(req.files['ecaDocument'][0].path);
		}
		if (req.files['resumeDocument']) {
			resumeDocUrl = await uploadToCloudinary(
				req.files['resumeDocument'][0].path,
				'documents/resumes',
			);
			fs.unlinkSync(req.files['resumeDocument'][0].path);
		}
		if (req.files['offerLetterDocument']) {
			offerLetterDocument = await uploadToCloudinary(
				req.files['offerLetterDocument'][0].path,
				'documents/offerLetterDocuments',
			);
			fs.unlinkSync(req.files['offerLetterDocument'][0].path);
		}
		return {
			ieltsDocUrl,
			ecaDocUrl,
			resumeDocUrl,
			offerLetterDocumentUrl,
		};
	}

	static createOnboardingApplication() {
		return catchAsyncError(async function (req, res, next) {
			const { ieltsDocUrl, ecaDocUrl, resumeDocUrl } =
				await ApplicationController.uploadDocuments(req);
			const application = new Application({
				owner: req.user.id,
				applicationStage: req.body.applicationStage,
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
			Response.OK(res, 'application onboarding completed successfully');
		});
	}

	static getApplicationDetails() {
		return catchAsyncError(async function (req, res, next) {
			const details = await Application.findOne({ owner: req.user.id });
			Response.OK(res, 'application details retrieved successfully', details);
		});
	}

	static uploadVideo() {
		return catchAsyncError(async function (req, res, next) {
			let videoUrl;
			if (!req.file || !req.file['fieldname'] === 'video') {
				return Response.error(
					res,
					'please provide a valid introductory video',
					HttpStatuses.statusBadRequest,
				);
			}
			const path = req.file.path;
			videoUrl = await uploadToCloudinary(path, '/videos');
			fs.unlinkSync(path);
			await Application.findOneAndUpdate(
				{ owner: req.user.id },
				{ introductoryVideo: videoUrl },
			);
			Response.OK(res, 'introductory video uploaded successfully', {
				video: videoUrl,
			});
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