import mongoose from 'mongoose';

const maritalStatusSchema = new mongoose.Schema({
	status: {
		type: String,
		required: true,
	},
});

export default mongoose.model('MaritalStatus', maritalStatusSchema);	