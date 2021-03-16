const mongoose = require('mongoose');
const schema = mongoose.Schema;

const purchaseSchema = new schema(
	{
		movieID: { type: String, required: true },
		customerID: { type: String, required: true },
		amount: { type: Number, required: true },
		cost: { type: Number, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Purchase', purchaseSchema, 'purchases');
