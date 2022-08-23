import mongoose from 'mongoose';

const CountryLocationSchema = new mongoose.Schema({
	location: {
		type: String,
		required: true,
	},
});

export default mongoose.model('CountryLocation', CountryLocationSchema);
