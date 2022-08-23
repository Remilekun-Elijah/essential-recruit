import mongoose from 'mongoose';

export const EducationLevelSchema = new mongoose.Schema({
	educationLevel: {
		type: String,
		required: true,
	},
	levelDescription: {
		type: String,
		required: true,
	},
});

export default mongoose.model('EducationLevel', EducationLevelSchema);
