import { body } from 'express-validator';
import mongoose from 'mongoose';

import GeneralModels from '../../models/Application/index.js';

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

export const validateApplicationCreation = [
	body('applicationStage')
		.trim()
		.isString()
		.withMessage('application stage must be an id in a string')
		.isMongoId()
		.withMessage('invalid application stage id')
		.custom((value, { req }) => {
			return GeneralModels.ApplicationStage.findById(value).then(stage => {
				if (!stage) {
					return Promise.reject('application stage does not exist');
				}
			});
		}),

	body('relocating')
		.exists({ checkNull: true, checkFalsy: false })
		.withMessage('relocating field is required')
		.isBoolean()
		.withMessage('relocating field must be either true or false'),

	body('relocationIdealTimeline')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('relocationIdealTimeline field is required')
		.isMongoId()
		.withMessage('invalid relocationIdealTimeline id')
		.custom((value, { req }) => {
			return GeneralModels.RelocationIdealTimeline.findById(value).then(
				timeline => {
					if (!timeline) {
						return Promise.reject(
							'relocation ideal timeline with this id does not exist',
						);
					}
				},
			);
		}),

	body('jobSearchStage')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('jobSearchStage field is required')
		.isString()
		.isMongoId()
		.withMessage('invalid jobSearchStage id')
		.custom((value, { req }) => {
			return GeneralModels.JobSearchStage.findById(value).then(stage => {
				if (!stage) {
					return Promise.reject('jobSearchStage with this id does not exist');
				}
			});
		}),

	body('workingExperience')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('workingExperience field is required')
		.isInt()
		.withMessage('workingExperience must be a number'),

	body('currentLocation')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('currentLocation field is required')
		.isString()
		.isMongoId()
		.withMessage('invalid currentLocation id')
		.custom((value, { req }) => {
			return GeneralModels.CountryLocation.findById(value).then(country => {
				if (!country) {
					return Promise.reject('country location with this id does not exist');
				}
			});
		}),

	body('locationPreferences')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('locationPreferences field is required')
		.isArray({ min: 1, max: 10 })
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
		.custom((array, { req }) => {
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

	body('takingRolesOutsideTopLocationPref')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: false })
		.withMessage('takingRolesOutsideTopLocationPref field is required')
		.isBoolean()
		.withMessage(
			'takingRolesOutsideTopLocationPref field must be a boolean value',
		),

	body('workConcerns')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('workConcerns field is required')
		.isArray({ min: 1, max: 3 })
		.withMessage(
			'workConcerns must be an array of work concerns with minimum of 1 and maximum of 3 work concerns ids',
		)
		.custom(array => {
			for (let id of array) {
				if (!isValidObjectId(id)) {
					return false;
				}
				return true;
			}
		})
		.withMessage('workConcerns must contain valid ids only')
		.custom((array, { req }) => {
			for (let workConcernId of array) {
				return GeneralModels.WorkConcern.findById(workConcernId).then(
					workConcern => {
						if (!workConcern) {
							return Promise.reject('workConcern with this id does not exist');
						}
					},
				);
			}
		}),

	body('hasLicense')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: false })
		.withMessage('hasLicense field is required')
		.isInt({ min: 0, max: 2 })
		.withMessage('hasLicense field must be a number value between 0 and 2'),

	body('activeLicenseLocations')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.if(body('hasLicense').equals('2'))
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('activeLicenseLocations field is required')
		.isArray({ min: 1, max: 10 })
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
		.custom((locations, { req }) => {
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

	body('highestEducationLevel')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('highestEducationLevel field is required')
		.isMongoId()
		.withMessage('invalid highestEducationLevel id')
		.custom((value, { req }) => {
			return GeneralModels.EducationLevel.findById(value).then(level => {
				if (!level) {
					return Promise.reject('education level with this id does not exist');
				}
			});
		}),

	body('workedInLongTermFacility')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: false })
		.withMessage('workedInLongTermFacility field is required')
		.isBoolean()
		.withMessage('workedInLongTermFacility must be a boolean value'),

	body('certifications')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('certifications field is required')
		.isArray({ min: 1, max: 5 })
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
		.custom((array, { req }) => {
			for (let certId of array) {
				return GeneralModels.Certification.findById(certId).then(cert => {
					if (!cert) {
						return Promise.reject(
							'certifications must contain valid certification ids only',
						);
					}
				});
			}
		}),

	body('otherCertifications')
		.if(body('otherCertifications').exists())
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.isArray({ min: 1 })
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
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('specialties field is required')
		.isArray({ min: 1, max: 10 })
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
		.custom((specialties, { req }) => {
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

	body('spokenLanguages')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('spokenLanguages field is required')
		.isArray({ min: 1, max: 5 })
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
		.custom((spokenLanguages, { req }) => {
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

	body('hasIELTS')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: false })
		.withMessage('hasIELTS field is required')
		.isInt({ min: 0, max: 2 })
		.withMessage('hasIELTS field must be a number value between 0 and 2'),

	body('ieltsDocument')
		.custom((value, { req }) => {
			if (req.body.hasIELTS !== '1' && req.files['ieltsDocument']) {
				throw 'cannot provide ielts document when you do not have ielts';
			} else {
				return true;
			}
		})
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue'),

	body('credentialsEvaluated')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: false })
		.withMessage('credentialsEvaluated field is required')
		.isBoolean()
		.withMessage('credentialsEvaluated field must be a boolean value'),

	body('ecaDocument')
		.custom((value, { req }) => {
			if (
				req.body.credentialsEvaluated !== 'true' &&
				req.files['ecaDocument']
			) {
				throw 'cannot provide eca document when your credentials have not been evaluated';
			} else {
				return true;
			}
		})
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue'),

	body('resumeDocument')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.custom((value, { req }) => {
			if (!req.files['resumeDocument']) {
				throw 'please provide a valid resume document';
			}
			return true;
		}),

	body('phoneNumber')
		.custom((value, { req }) => {
			if (req.body.relocating === 'true' || req.body.relocating === true) {
				return true;
			}
			return false;
		})
		.withMessage('relocating field must be true to continue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('phoneNumber field is required')
		.isMobilePhone()
		.withMessage('phoneNumber must be a valid phone number'),
];

export const validateApplicationEdit = [
	body('firstName')
		.trim()
		.if(body('firstName').exists({ checkFalsy: true, checkNull: true }))
		.isString()
		.withMessage('firstName must be a string value')
		.isLength({ min: 3, max: 20 })
		.withMessage(
			'firstName must be at least 3 characters or at most 20 characters',
		),

	body('lastName')
		.trim()
		.if(body('lastName').exists({ checkFalsy: true, checkNull: true }))
		.isString()
		.withMessage('lastName must be a string value')
		.isLength({ min: 3, max: 20 })
		.withMessage(
			'lastName must be at least 3 characters or at most 20 characters',
		),

	body('currentLocation')
		.if(body('currentLocation').exists({ checkFalsy: true, checkNull: true }))
		.isString()
		.isMongoId()
		.withMessage('invalid currentLocation id')
		.custom((value, { req }) => {
			return GeneralModels.CountryLocation.findById(value).then(country => {
				if (!country) {
					return Promise.reject('country location with this id does not exist');
				}
			});
		}),

	body('spokenLanguages')
		.if(body('spokenLanguages').exists({ checkFalsy: true, checkNull: true }))
		.isArray({ min: 1, max: 5 })
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
		.custom((spokenLanguages, { req }) => {
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
		.custom((value, { req }) => {
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
		.isArray({ min: 1, max: 5 })
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
		.custom((array, { req }) => {
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
		.isArray({ min: 1 })
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
		.isArray({ min: 1, max: 10 })
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
		.custom((specialties, { req }) => {
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
		.isArray({ min: 1, max: 10 })
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
		.custom((locations, { req }) => {
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
		.isArray({ min: 1, max: 10 })
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
		.custom((specialties, { req }) => {
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
		.isArray({ min: 1, max: 10 })
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
		.custom((array, { req }) => {
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
		.custom((value, { req }) => {
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
		.custom((value, { req }) => {
			if (req.body.video) {
				throw 'cannot upload an introductory video via this endpoint';
			}
			return true;
		}),
];
