import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
	owner: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'User',
		required: true,
	},
	applicationStage: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'ApplicationStage',
		required: true,
	},
	tierLevel: {
		type: Number,
	},
	relocating: {
		type: Boolean,
		required: true,
	},
	relocationIdealTimeline: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'RelocationIdealTimeline',
		required: true,
	},
	jobSearchStage: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'JobSearchStage',
		required: true,
	},
	workingExperience: {
		type: Number, // 0 or less represents experience level of less than 1 year. 1 or more represents experience level of more than 1 year
		// required: true,
	},
	currentLocation: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'CountryLocation',
		// required: true,
	},
	locationPreferences: [
		{ type: mongoose.SchemaTypes.ObjectId, ref: 'CanadaProvince' },
	],
	takingRolesOutsideTopLocationPref: {
		type: Boolean,
		// required: true,
	},
	workConcerns: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'WorkConcern' }],
	hasLicense: { 
		type: Number,
		// required: true 
	},
	activeLicenseLocations: [
		{
			location: { type: mongoose.SchemaTypes.ObjectId, ref: 'CountryLocation' },
			licensePin: { type: Number },
		},
	],
	highestEducationLevel: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'EducationLevel',
	},
	workedInLongTermFacility: {
		type: Boolean,
		// required: true,
	},
	certifications: [
		{ type: mongoose.SchemaTypes.ObjectId, ref: 'Certification' },
	],
	otherCertifications: [{ type: String }],
	specialties: [
		{
			specialty: { type: mongoose.SchemaTypes.ObjectId, ref: 'Specialty' },
			yearsOfExperience: { type: Number },
		},
	],
	spokenLanguages: [
		{
			language: { type: mongoose.SchemaTypes.ObjectId, ref: 'SpokenLanguage' },
			fluency: { type: String, enum: ['fluent', 'intermediate', 'basic'] },
		},
	],
	hasIELTS: {
		type: Number,
		// required: true,
	},
	IELTSDocument: {
		type: String,
	},
	credentialsEvaluated: {
		type: Boolean,
		// required: true,
	},
	ECADocument: {
		type: String,
	},
	phoneNumber: {
		type: String,
		// required: true,
	},
	resumeDocument: {
		type: String,
		// required: true,
	},
	expertiseLevel: {
		type: String,
		enum: ['intermediate', 'advanced', 'junior'],
	},
	offerLetterDocument: {
		type: String,
	},
	introductoryVideo: {
		type: String,
	},
	avatar: {
		type: String,
	},
});

ApplicationSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'owner',
		select:
			'email firstName lastName avatar jobApplications createdAt -_id',
	})
		.populate({
			path: 'applicationStage',
			select: 'applicationStage _id',
		})
		.populate({
			path: 'relocationIdealTimeline',
			select: 'timeline -_id',
		})
		.populate({
			path: 'jobSearchStage',
			select: 'stage -_id',
		})
		.populate({
			path: 'currentLocation',
			select: 'location -_id',
		})
		.populate({
			path: 'locationPreferences',
			select: 'province -_id',
		})
		.populate({
			path: 'workConcerns',
			select: 'concern -_id',
		})
		.populate({
			path: 'activeLicenseLocations.location',
			select: 'location licensePin -_id',
		})
		.populate({
			path: 'highestEducationLevel',
			select: 'educationLevel levelDescription -_id',
		})
		.populate({
			path: 'certifications',
			select: 'certification certificationDescription -_id',
		})
		.populate({ path: 'specialties.specialty', select: 'specialty -_id' })
		.populate({
			path: 'spokenLanguages',
			select: '-_id',
			populate: {
				path: 'language',
				select: '-_id',
			},
		});
	next();
});

ApplicationSchema.post(/find/, function (doc) {
	if(doc){
			if(doc.applicationStage.applicationStage === "Personal Details" && doc.phoneNumber){
				doc.applicationStage.applicationStage = "Completed";
			}
	}
})

export default mongoose.model('Application', ApplicationSchema);
