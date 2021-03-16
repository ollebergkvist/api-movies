require('dotenv').config(); // Loads environment variables from a .env file into process.env
const mongoose = require('mongoose'); // Object modeling tool designed to work in an asynchronous environment
const createServer = require('./models/server.js'); // Express server module
let uri = '';
let port = '';

// Set environment variables depending on build
if (process.env.NODE_ENV === 'test') {
	uri = 'mongodb://localhost:27017/movies';
	port = 3000;
} else {
	uri = process.env.MONGODB_URI;
	port = process.env.PORT;
}

console.log(uri);

// Create db connection
const connection = mongoose
	.connect(uri, {
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		keepAlive: 300000,
		connectTimeoutMS: 30000,
	})
	.then(() => {
		if (connection) {
			console.log('Database connected');
		} else {
			console.log('Database connection error');
		}
	})
	.then(() => {
		// Start express server on given port
		const app = createServer();
		app.listen(port, () => {
			console.log(`Server listening on ${port} `);
		});
	});
