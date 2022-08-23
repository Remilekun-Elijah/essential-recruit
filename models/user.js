import mongoose from 'mongoose';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'an email address is required'],
			maxlength: [50, 'email address must not be more than 50 characters'],
			minlength: [5, 'email address must not be less than 5 characters'],
			lowercase: true,
			trim: true,
			unique: true,
		},
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		password: {
			type: String,
			select: false,
		},
		phoneNumber: String,
		companyName: {
			type: String,
			trim: true,
		},
		companyProvince: {
			type: String,
			trim: true,
		},
		companyCity: {
			type: String,
			trim: true,
		},
		avatar: String,
		userVerified: {
			type: Boolean,
			default: false,
			select: false,
		},
		recruiterApproved: {
			type: Boolean,
			default: false,
			select: false,
		},
		role: {
			type: String,
			enum: {
				values: ['admin', 'applicant', 'recruiter'],
				message: 'role can either be admin, applicant or recruiter',
			},
		},
		verificationCode: Number,
		verificationCodeExpiresIn: Date,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	},
);

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await argon2.hash(this.password);
	next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
	try {
		return await argon2.verify(this.password, password);
	} catch (error) {
		throw error;
	}
};

UserSchema.statics.generateVerificationCode = function (length = 4) {
	const verificationCode =
		length === 4
			? Math.floor(1000 + Math.random() * 9000)
			: Math.floor(100000 + Math.random() * 900000);
	return verificationCode;
};

UserSchema.methods.isRecruiter = function () {
	return this.role === 'recruiter';
};

UserSchema.methods.isAdmin = function () {
	return this.role === 'admin';
};

UserSchema.methods.isApplicant = function () {
	return this.role === 'applicant';
};

UserSchema.methods.isRecruiterApproved = function () {
	return this.recruiterApproved;
};

UserSchema.methods.generateJWT = function () {
	const token = jwt.sign(
		{ email: this.email, id: this.id },
		process.env.JWT_SECRET,
		{ expiresIn: Date.now() + (30 * 24 * 60 * 60 * 1000) / 1000 },
	);
	return token;
};

// UserSchema.virtual('jobsApplied', {
// 	ref: 'JobApplication',
// 	localField: '_id',
// 	foreignField: 'owner',
// });

// UserSchema.pre(/^find/, function (next) {
// 	this.populate({ path: 'jobsApplied', populate: { path: 'job' } });
// 	next();
// });

export default mongoose.model('User', UserSchema);
