import mongoose from 'mongoose';

const JobSearchStageSchema = new mongoose.Schema({
	stage: {
		type: String,
		required: true,
	},
});

export default mongoose.model('JobSearchStage', JobSearchStageSchema);
