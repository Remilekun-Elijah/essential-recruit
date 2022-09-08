import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
	test: {
		type: String,
		required: true,
	},
	lang: {
		type: String,
		required: true,
	},
});

export default mongoose.model('Test', TestSchema);	