import mongoose from 'mongoose';

const visaTypeSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
});

export default mongoose.model('VisaType', visaTypeSchema);	