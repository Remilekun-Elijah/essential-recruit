import mongoose from 'mongoose';

const ApplicationStageSchema = new mongoose.Schema({
	applicationStage: {
		type: String,
		required: true,
	},
});

export default mongoose.model('ApplicationStage', ApplicationStageSchema);
