import {
	body
} from 'express-validator';
import mongoose from 'mongoose';

import GeneralModels from '../../models/Application/index.js';
import joi from 'joi'

function isValidObjectId(objectId) {
	const ObjectId = mongoose.Types.ObjectId;
	if (ObjectId.isValid(objectId)) {
		if (String(new ObjectId(objectId)) === objectId) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}



// let appStage = "Relocation";

let stageOne = joi.object().keys({
		relocating: joi.boolean().required().valid(true),
		relocationIdealTimeline: joi.string().required(),
		jobSearchStage: joi.string().required()
	}),

	stageTwo = joi.object().keys({
		workingExperience: joi.number().label("Work Experience").required(),
		currentLocation: joi.string().label("Current Location").required(),
		locationPreferences: joi.array().items(joi.string()),
		takingRolesOutsideTopLocationPref: joi.boolean().required()
	}),


	stageThree = joi.object().keys({
		workConcerns: joi.array()
			.min(1).max(3),
		hasLicense: joi.number().min(0).max(2),
		activeLicenseLocations: joi.array().items({
			location: joi.string(),
			licensePin: joi.number()
		}).min(1).max(10)
	}),

	stageFour = joi.object().keys({
		highestEducationLevel: joi.string().required(),
		workedInLongTermFacility: joi.boolean().required(),
		certifications: joi.array().items(joi.string().label("certification Id")).min(1).max(5).required(),
		otherCertifications: joi.array().items(joi.string())
	}),

	stageFive = joi.object().keys({
		specialties: joi.array().items({
			specialty: joi.string().label('Specialty id').required(),
			yearsOfExperience: joi.number().label('Years of experience').min(1).max(10).required()
		}).min(1).max(10).required(),

		spokenLanguages: joi.array().items({
			language: joi.string().required(),
			fluency: joi.string().valid('fluent', 'intermediate', 'basic').required()
		}).min(1).max(5),

		hasIELTS: joi.number().min(0).max(2).required(),

		credentialsEvaluated: joi.boolean().required()
	}),

	stageSix = joi.object().keys({
		phoneNumber: joi.string().label("Phone number").required()
	})

const stageLevels = {
	"Relocation": stageOne,
	"Work and Experience": stageTwo,
	"Career Details": stageThree,
	"Education": stageFour,
	"Specialties & Requirements": stageFive,
	"Personal Details": stageSix,
}
const stages = Object.keys(stageLevels);

export const validateAppStage = async (req, res, next) => {
	const schema = joi.object().keys({
		applicationStage: joi.string().label("Application Stage").required()
	});
	try {
		const applicationStage = req.headers["app-id"];
		await schema.validateAsync({
			applicationStage
		});

		const stage = await GeneralModels.ApplicationStage.findById(applicationStage)
		const allStages = await GeneralModels.ApplicationStage.find({}).lean();

		if (stage.applicationStage) {

			let nextStage;
			switch (stage.applicationStage) {
				case stages[0]:
					nextStage = allStages.filter(stage => stage.applicationStage === stages[1])
					break;
				case stages[1]:
					nextStage = allStages.filter(stage => stage.applicationStage === stages[2])
					break;
				case stages[2]:
					nextStage = allStages.filter(stage => stage.applicationStage === stages[3])
					break;
				case stages[3]:
					nextStage = allStages.filter(stage => stage.applicationStage === stages[4])
					break;
				case stages[4]:
					nextStage = allStages.filter(stage => stage.applicationStage === stages[5])
					break;
			}

			res.locals.nextStage = nextStage ? nextStage[0] : allStages[allStages.length - 1];
			res.locals.appStage = stage.applicationStage;
			res.locals.appStageId = stage._id;
			next()
		} else {
			res.status(422).json({
				status: 'fail',
				code: 422,
				message: "Invalid application stage Id"
			})
		}
	} catch (err) {
		res.status(500).json({
			status: 'fail',
			code: 500,
			message: err.message
		})
	}
}

export const validateApplicationCreation = async (req, res, next) => {
	const appStage = res.locals.appStage;
	let error;
	try {
		if (appStage) {
			if (req.body.hasLicense) error = req.body.hasLicense == 2 && (req.body.activeLicenseLocations instanceof Array == false || !req.body.activeLicenseLocations.length) ? "Active License Location is required" : null;
			switch (appStage) {

				case stages[5]:
					error = !req.files["resumeDocument"] ? "You must provide resume document before proceeding" : null;
					break;
				case stages[4]:
					error = req.body.hasIELTS != '1' && req.files['ieltsDocument'] ?
						"Cannot provide ielts document when you do not have ielts" : req.body.hasIELTS == '1' && !req.files['ieltsDocument'] ? "You must provide ielts document before proceeding" : null;
					break;
				case stages[4]:
					error = req.body.credentialsEvaluated !== 'true' &&
						req.files['ecaDocument'] ? "Cannot provide eca document when your credentials have not been evaluated" :
						req.body.credentialsEvaluated == 'true' &&
						(!req.files['ecaDocument'] && !req.files['ieltsDocument']) ? "You must provide eca document before proceeding" : null;
					break
			}

			if (error) {
				res.status(422).json({
					status: 'fail',
					code: 422,
					message: error
				})
			} else {
				await stageLevels[appStage].validateAsync(req.body)
				next()
			}
		} else res.status(500).json({
			status: 'fail',
			code: 500,
			message: err.message
		})
	} catch (err) {

		if (err.details) {
			res.status(422).json({
				status: 'fail',
				code: 422,
				message: err.details[0].message
			})
		} else {
			res.status(500).json({
				status: 'fail',
				code: 500,
				message: err.message
			})
		}
	}
}





export const validateApplicationEdit = [
	body('firstName')
	.trim()
	.if(body('firstName').exists({
		checkFalsy: true,
		checkNull: true
	}))
	.isString()
	.withMessage('firstName must be a string value')
	.isLength({
		min: 3,
		max: 20
	})
	.withMessage(
		'firstName must be at least 3 characters or at most 20 characters',
	),

	body('lastName')
	.trim()
	.if(body('lastName').exists({
		checkFalsy: true,
		checkNull: true
	}))
	.isString()
	.withMessage('lastName must be a string value')
	.isLength({
		min: 3,
		max: 20
	})
	.withMessage(
		'lastName must be at least 3 characters or at most 20 characters',
	),

	body('currentLocation')
	.if(body('currentLocation').exists({
		checkFalsy: true,
		checkNull: true
	}))
	.isString()
	.isMongoId()
	.withMessage('invalid currentLocation id')
	.custom((value, {
		req
	}) => {
		return GeneralModels.CountryLocation.findById(value).then(country => {
			if (!country) {
				return Promise.reject('country location with this id does not exist');
			}
		});
	}),

	body('spokenLanguages')
	.if(body('spokenLanguages').exists({
		checkFalsy: true,
		checkNull: true
	}))
	.isArray({
		min: 1,
		max: 5
	})
	.withMessage(
		'spokenLanguages must be an array with minimum of 1 and maximum of 5 objects',
	)
	.custom(spokenLanguages => {
		for (let obj of spokenLanguages) {
			if (
				!isValidObjectId(obj.language) ||
				!['fluent', 'intermediate', 'basic'].includes(obj.fluency)
			) {
				return false;
			}
			return true;
		}
	})
	.withMessage(
		`spokenLanguages must contain objects with valid spoken language id and correct fluency values which are: ${[
				'fluent',
				'intermediate',
				'basic',
			].join(', ')}`,
	)
	.custom((spokenLanguages, {
		req
	}) => {
		for (let obj of spokenLanguages) {
			return GeneralModels.SpokenLanguage.findById(obj.language).then(
				language => {
					if (!language) {
						return Promise.reject(
							'spokenLanguages must contain objects with valid language ids',
						);
					}
				},
			);
		}
	}),

	body('highestEducationLevel')
	.if(
		body('highestEducationLevel').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.isMongoId()
	.withMessage('invalid highestEducationLevel id')
	.custom((value, {
		req
	}) => {
		return GeneralModels.EducationLevel.findById(value).then(level => {
			if (!level) {
				return Promise.reject('education level with this id does not exist');
			}
		});
	}),

	body('certifications')
	.if(
		body('certifications').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.isArray({
		min: 1,
		max: 5
	})
	.withMessage('certifications field must be an array of certification ids')
	.custom(array => {
		for (let id of array) {
			if (!isValidObjectId(id)) {
				return false;
			}
			return true;
		}
	})
	.withMessage('certifications must contain valid certification ids only')
	.custom((array, {
		req
	}) => {
		for (let certId of array) {
			return GeneralModels.Certification.findById(certId).then(cert => {
				if (!cert) {
					return Promise.reject('certification id does not exist');
				}
			});
		}
	}),

	body('otherCertifications')
	.if(
		body('otherCertifications').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.isArray({
		min: 1
	})
	.withMessage('otherCertifications field must be an array of strings')
	.custom(array => {
		for (let cert of array) {
			if (typeof cert !== 'string') {
				return false;
			}
			return true;
		}
	})
	.withMessage(
		'otherCertifications must contain strings of certification only',
	),

	body('specialties')
	.if(
		body('specialties').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.isArray({
		min: 1,
		max: 10
	})
	.withMessage(
		'specialties must be an array with minimum of 1 and maximum of 10 objects',
	)
	.custom(specialties => {
		for (let obj of specialties) {
			if (
				!isValidObjectId(obj.specialty) ||
				String(obj.yearsOfExperience).length > 2
			) {
				return false;
			}
			return true;
		}
	})
	.withMessage(
		'specialties must contain objects with valid specialty id and correct years of experience (e.g 10)',
	)
	.custom((specialties, {
		req
	}) => {
		for (let obj of specialties) {
			return GeneralModels.Specialty.findById(obj.specialty).then(
				specialty => {
					if (!specialty) {
						return Promise.reject('specialty id does not exist');
					}
				},
			);
		}
	}),

	body('activeLicenseLocations')
	.if(
		body('specialties').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.isArray({
		min: 1,
		max: 10
	})
	.withMessage(
		'activeLicenseLocations must be an array with minimum of 1 and maximum of 10 objects',
	)
	.custom(locations => {
		for (let obj of locations) {
			if (!isValidObjectId(obj.location) || obj.licensePin.length !== 12) {
				return false;
			}
			return true;
		}
	})
	.withMessage(
		'activeLicenseLocations must contain objects with valid country location id and correct license pin (12)',
	)
	.custom((locations, {
		req
	}) => {
		for (let obj of locations) {
			return GeneralModels.CountryLocation.findById(obj.location).then(
				location => {
					if (!location) {
						return Promise.reject(
							'activeLicenseLocations must contain objects with valid country location ids',
						);
					}
				},
			);
		}
	}),

	body('specialties')
	.if(
		body('specialties').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.isArray({
		min: 1,
		max: 10
	})
	.withMessage(
		'specialties must be an array with minimum of 1 and maximum of 10 objects',
	)
	.custom(specialties => {
		for (let obj of specialties) {
			if (
				!isValidObjectId(obj.specialty) ||
				String(obj.yearsOfExperience).length > 2
			) {
				return false;
			}
			return true;
		}
	})
	.withMessage(
		'specialties must contain objects with valid specialty id and correct years of experience (e.g 10)',
	)
	.custom((specialties, {
		req
	}) => {
		for (let obj of specialties) {
			return GeneralModels.Specialty.findById(obj.specialty).then(
				specialty => {
					if (!specialty) {
						return Promise.reject('specialty id does not exist');
					}
				},
			);
		}
	}),

	body('locationPreferences')
	.if(
		body('locationPreferences').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.isArray({
		min: 1,
		max: 10
	})
	.withMessage(
		'locationPreferences must be an array of canada provinces with minimum of 1 and maximum of 10 province ids',
	)
	.custom(array => {
		for (let id of array) {
			if (!isValidObjectId(id)) {
				return false;
			}
			return true;
		}
	})
	.withMessage('locationPreferences must contain valid location ids only')
	.custom((array, {
		req
	}) => {
		for (let provinceId of array) {
			return GeneralModels.CanadaProvince.findById(provinceId).then(
				province => {
					if (!province) {
						return Promise.reject(
							'canada province with this id does not exist',
						);
					}
				},
			);
		}
	}),

	body('workingExperience')
	.if(
		body('workingExperience').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.isInt()
	.withMessage('workingExperience must be a number'),

	body('phoneNumber')
	.if(
		body('phoneNumber').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.isMobilePhone()
	.withMessage('phoneNumber must be a valid phone number'),

	body('expertiseLevel')
	.if(
		body('expertiseLevel').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.isString()
	.withMessage('expertiseLevel must be a string value')
	.isIn(['intermediate', 'advanced', 'junior'])
	.withMessage('expertiseLevel can only by intermediate, advanced or junior'),

	body('avatar')
	.if(
		body('avatar').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.custom((value, {
		req
	}) => {
		if (req.body.avatar) {
			throw 'cannot upload an avatar via this endpoint';
		}
		return true;
	}),

	body('video')
	.if(
		body('video').exists({
			checkFalsy: true,
			checkNull: true,
		}),
	)
	.custom((value, {
		req
	}) => {
		if (req.body.video) {
			throw 'cannot upload an introductory video via this endpoint';
		}
		return true;
	}),
];