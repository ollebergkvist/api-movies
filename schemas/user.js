const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema(
	{
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		penalty: { type: Number },
		admin: { type: String, default: 'user' },
		favorites: [
			{
				movieID: { type: String },
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema, 'users');
