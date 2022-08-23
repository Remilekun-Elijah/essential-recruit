import mongoose from 'mongoose';

const SpokenLanguage = new mongoose.Schema({
	language: {
		type: String,
		required: true,
	},
});

export default mongoose.model('SpokenLanguage', SpokenLanguage);
