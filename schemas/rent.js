const mongoose = require('mongoose');
const schema = mongoose.Schema;

const rentSchema = new schema(
	{
		movieID: { type: String, required: true },
		customerID: { type: String, required: true },
		amount: { type: Number, required: true },
		cost: { type: Number, required: true },
		returnDate: { type: Date, default: Date.now() + 3 * 24 * 60 * 60 * 1000 },
		returned: { type: Boolean, default: false },
		returnedAt: { type: Date },
		penalty: { type: Number },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Rent', rentSchema, 'rentals');
