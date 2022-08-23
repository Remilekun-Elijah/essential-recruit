import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	job: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Job',
		required: true,
	},
	jobCreator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

JobApplicationSchema.pre(/^find/, function (next) {
	this.populate({ path: 'job', select: '' });
});

export default mongoose.model('JobApplication', JobApplicationSchema);
