import mongoose from 'mongoose';

export const CertificationSchema = new mongoose.Schema({
	certification: {
		type: String,
		required: true,
	},
	certificationDescription: {
		type: String,
		required: true,
	},
});

export default mongoose.model('Certification', CertificationSchema);
