import mongoose from 'mongoose';

const WorkConcern = new mongoose.Schema({
	concern: {
		type: String,
		required: true,
	},
});

export default mongoose.model('WorkConcern', WorkConcern);
