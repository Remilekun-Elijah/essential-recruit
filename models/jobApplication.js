import mongoose from 'mongoose';
// import Application from './application';

const JobApplicationSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Application',
		required: true,
	},
	job: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Job',
		required: true,
	},
	status: {
		type: Number,
		default: 1,
	}
	// jobCreator: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// },
}, {
	timestamps: true
});


JobApplicationSchema.pre(/^find/, function (next) {
	this.populate({ path: 'owner', select: '' })
	.populate({
			path: "job",
			select: ""
		})
		next();
});


export default mongoose.model('JobApplication', JobApplicationSchema);
