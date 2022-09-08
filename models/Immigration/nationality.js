import mongoose from 'mongoose';

const NationalitySchema = new mongoose.Schema({
	nationality: {
		type: String,
		required: true,
	},
});

export default mongoose.model('Nationality', NationalitySchema);	