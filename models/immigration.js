import mongoose from 'mongoose';

const immigrationSchema = new mongoose.Schema({
	owner: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'User',
		required: true,
	},
	fullName: {
		type: String,
		required: true,
	},
 gender: String,
 nationality: {
  type: mongoose.SchemaTypes.ObjectId,
		ref: 'Nationality',
		required: true,
 },
	hasPassport: {
		type: Boolean,
		required: true
	},
	passportExpiry: {
		type: String,
		required: true
	},
	dob: {
		type: String,
		required: true
	},
	maritalStatus: {
  type: mongoose.SchemaTypes.ObjectId,
		ref: 'MaritalStatus',
		required: true,
 },
	kidsCount:{
		type: Number,
		default: 0
	},
	countryOfBirth: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'CountryLocation',
		required: true,
	},
	countryOfResidence: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'CountryLocation',
		required: true,
	},
	occupation:{
		type: String,
		required: true
	},
	proofOfFund:{
		type: String,
		required: true
	},
	testTaken: [
		{
			actualTest: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Test',
		},
		expiry: String,
	},
],
			jobOffer: [
				{
				fromCanada: Boolean,
				role: String,
				employerProvince: {
					type: mongoose.SchemaTypes.ObjectId,
					ref: 'CanadaProvince',
				},
			}
			],
			hasCanadaFriend: Boolean,
			canadaFriendProvince: {
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'CanadaProvince',
			},
			hasCriminalOffence: Boolean,
			hasMedicalProblem: Boolean,
			livedInOtherCountryForSixMonth: Boolean,
			countriesLivedIn: [
				{
					type: mongoose.SchemaTypes.ObjectId,
					ref: 'CountryLocation',
				}
			],
			hasCanadaVisaDenial: Boolean,
			deniedVisa: {
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'VisaType',
			}
});

immigrationSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'owner',
		select:
			'email avatar -_id',
	})
	.populate({
		path: "nationality",
		select: 'nationality -_id'
	})
	.populate({
		path: "maritalStatus",
		select: "status -_id"
	})
	.populate({
		path: "countryOfBirth",
		select: "location -_id"
	})
	.populate({
		path: "countryOfResidence",
		select: "location -_id"
	})
	.populate([{
		path: "testTaken.actualTest",
		select: "-_id"
	}])
	.populate([{
		path: "jobOffer.employerProvince",
		select: "-_id"
	}])
	.populate({
		path: "canadaFriendProvince",
		select: "province -_id"
	})
	.populate([{
		path: "countriesLivedIn",
		select: "location -_id"
	}])
	.populate({
		path: "deniedVisa",
		select: "type -_id"
	})

	next()
	
})

export default mongoose.model('Immigration', immigrationSchema);	