const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2'); //  Cursor based pagination library
const mongoose_delete = require('mongoose-delete'); // Enables soft deletion of documents in MongoDB

const movieSchema = new schema(
	{
		title: { type: String, unique: true, required: true },
		description: { type: String, required: true },
		image: { type: String, required: true },
		stock: { type: Number, minimum: 0, default: 5 },
		rental_price: { type: Number, default: 10 },
		sales_price: { type: Number, default: 20 },
		availability: { type: Boolean, default: true },
		likes: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

movieSchema.plugin(mongoosePaginate);
movieSchema.plugin(mongoose_delete, { deletedAt: true });

module.exports = mongoose.model('Movie', movieSchema, 'movies');
