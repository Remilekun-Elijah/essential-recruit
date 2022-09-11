import {
	JobStatuses
} from '../helpers/model_statuses.js';
import mongoose from 'mongoose';

mongoose.set('returnOriginal', false);

const SalaryRange = new mongoose.Schema({
		min: Number,
		max: Number
	}, {
		_id: false
	}),
	Specialty = new mongoose.Schema({
		specialty: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Specialty',
			select: 'specialty -_id'
		},
		yearsOfExperience: {
			type: Number
		}
	}, {
		_id: false
	});

const JobSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	slug: String,
	companyLogo: String,
	title: {
		type: String,
		required: [true, "Job title is required"]
	},
	experienceLevel: Number,
	specialties: [Specialty],
	otherSpecialties: [Specialty],
	numberOfHires: Number,
	description: String,
	responsibility: String,
	location: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "CountryLocation",
		select: 'location -_id'
	},
	domainUrl: String,
	requiredLanguage: [{
		language: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'SpokenLanguage',
			select: 'language'
		},
		fluency: {
			type: String,
			enum: ['fluent', 'intermediate', 'basic']
		},
	}, ],
	salaryRange: SalaryRange,
	benefits: {
		type: Array
	},
	status: {
		type: Number,
		default: 0 // 0 = drafted, 1 = published, 3 = deleted
	}
}, {
	timestamps: true
});

JobSchema.pre(/^find/, function (next) {
	this.populate({
		path: "owner",
		select: "firstName lastName avatar companyName companyProvince companyCity"
	}).populate([{
		path: "specialties.specialty",
		select: "specialty -_id"
	}]).populate([{
		path: "otherSpecialties.specialty",
		select: "specialty -_id"
	}]).populate({
		path: "location",
		select: "location -_id"
	}).populate([{
		path: "requiredLanguage.language",
		select: "language -_id"
	}])

	next()
})


export default mongoose.model('Job', JobSchema);