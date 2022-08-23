import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	// Define a Job entity properties.
});

export default mongoose.model('Job', JobSchema);
