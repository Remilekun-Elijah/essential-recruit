import mongoose from 'mongoose';

const SpecialtySchema = new mongoose.Schema({
	specialty: {
		type: String,
		required: true,
	},
});

export default mongoose.model('Specialty', SpecialtySchema);
