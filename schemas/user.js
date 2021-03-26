const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema(
	{
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		penalty: { type: Number },
		admin: { type: Boolean, default: false },
		favorites: [
			{
				movieID: { type: String },
			},
		],
		resetPasswordToken: { type: String },
		resetPasswordExpires: { type: Date },
		verificationCode: { type: String },
		isActivated: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema, 'users');
