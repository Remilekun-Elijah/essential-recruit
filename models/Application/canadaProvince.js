import mongoose from 'mongoose';

const CanadaProvinceSchema = new mongoose.Schema({
	province: {
		type: String,
		required: true,
	},
});

export default mongoose.model('CanadaProvince', CanadaProvinceSchema);
